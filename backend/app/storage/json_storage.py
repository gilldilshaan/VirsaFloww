import json
import os
import shutil
import tempfile
import threading
from typing import Callable, Dict, Generic, List, Optional, Type, TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

class JsonFileRepository(Generic[T]):
    """Thread-safe, atomic JSON file repository supporting restart persistence."""

    def __init__(
        self,
        model_cls: Type[T],
        runtime_path: str,
        seed_path: Optional[str] = None,
        id_field: str = "id",
    ):
        self.model_cls = model_cls
        self.runtime_path = os.path.abspath(runtime_path)
        self.seed_path = os.path.abspath(seed_path) if seed_path else None
        self.id_field = id_field
        self._lock = threading.Lock()
        self._data: Dict[str, T] = {}
        self._initialize()

    def _initialize(self) -> None:
        """Initializes repository from runtime file if present, else seed file."""
        with self._lock:
            os.makedirs(os.path.dirname(self.runtime_path), exist_ok=True)
            if os.path.exists(self.runtime_path):
                self._load_from_path(self.runtime_path)
            elif self.seed_path and os.path.exists(self.seed_path):
                self._load_from_path(self.seed_path)
                self._persist_unlocked()
            else:
                self._data = {}
                self._persist_unlocked()

    def _load_from_path(self, path: str) -> None:
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    self._data = {}
                    return
                raw_list = json.loads(content)
                self._data = {}
                for item in raw_list:
                    parsed = self.model_cls.model_validate(item)
                    key = getattr(parsed, self.id_field)
                    self._data[str(key)] = parsed
        except Exception as e:
            raise RuntimeError(f"Failed to load records from {path}: {e}")

    def _persist_unlocked(self) -> None:
        """Atomically persists in-memory state to runtime file."""
        dir_name = os.path.dirname(self.runtime_path)
        os.makedirs(dir_name, exist_ok=True)
        serialized = [item.model_dump(by_alias=True, mode="json") for item in self._data.values()]

        # Write to temporary file in the same directory, flush, fsync, then atomic rename
        with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tmp:
            tmp_name = tmp.name
            json.dump(serialized, tmp, indent=2, ensure_ascii=False)
            tmp.flush()
            os.fsync(tmp.fileno())

        os.replace(tmp_name, self.runtime_path)

    def reset_to_seed(self) -> None:
        """Resets runtime state to seed state. Used for demo resets."""
        with self._lock:
            if self.seed_path and os.path.exists(self.seed_path):
                self._load_from_path(self.seed_path)
                self._persist_unlocked()
            else:
                self._data = {}
                self._persist_unlocked()

    def get(self, entity_id: str) -> Optional[T]:
        with self._lock:
            return self._data.get(str(entity_id))

    def list(
        self,
        filter_fn: Optional[Callable[[T], bool]] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> tuple[List[T], int]:
        with self._lock:
            all_items = list(self._data.values())
            if filter_fn:
                filtered = [item for item in all_items if filter_fn(item)]
            else:
                filtered = all_items
            total = len(filtered)
            paginated = filtered[offset : offset + limit]
            return paginated, total

    def create(self, entity: T) -> T:
        with self._lock:
            key = str(getattr(entity, self.id_field))
            if key in self._data:
                raise ValueError(f"Entity with {self.id_field}='{key}' already exists.")
            self._data[key] = entity
            self._persist_unlocked()
            return entity

    insert = create

    def update(self, entity: T) -> T:
        with self._lock:
            key = str(getattr(entity, self.id_field))
            if key not in self._data:
                raise KeyError(f"Entity with {self.id_field}='{key}' not found.")
            self._data[key] = entity
            self._persist_unlocked()
            return entity

    def delete(self, entity_id: str) -> bool:
        with self._lock:
            key = str(entity_id)
            if key in self._data:
                del self._data[key]
                self._persist_unlocked()
                return True
            return False

    def find_one(self, predicate: Callable[[T], bool]) -> Optional[T]:
        with self._lock:
            for item in self._data.values():
                if predicate(item):
                    return item
            return None

    def find_all(self, predicate: Optional[Callable[[T], bool]] = None) -> List[T]:
        with self._lock:
            if predicate is None:
                return list(self._data.values())
            return [item for item in self._data.values() if predicate(item)]
