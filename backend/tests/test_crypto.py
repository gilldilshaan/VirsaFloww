import json
from backend.app.utils.crypto import (
    sha256_bytes,
    sha256_canonical_json,
    hash_password,
    verify_password,
)

def test_sha256_known_vector():
    expected = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    assert sha256_bytes(b"abc") == expected

def test_sha256_canonical_json():
    dict1 = {"b": 2, "a": 1, "c": {"y": "val", "x": 10}}
    dict2 = {"a": 1, "c": {"x": 10, "y": "val"}, "b": 2}

    hash1 = sha256_canonical_json(dict1)
    hash2 = sha256_canonical_json(dict2)
    assert hash1 == hash2

    canonical_repr = json.dumps(dict1, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    assert sha256_bytes(canonical_repr.encode("utf-8")) == hash1

def test_scrypt_password_hashing():
    raw_pwd = "SuperSecretPassword123!"
    encoded = hash_password(raw_pwd)

    # Scrypt 64-byte hex digest is 128 chars
    assert len(encoded) == 128

    # Verify matching password
    assert verify_password(raw_pwd, encoded) is True

    # Verify wrong password
    assert verify_password("WrongPassword", encoded) is False
    assert verify_password("", encoded) is False
