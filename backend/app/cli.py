import sys
import logging
from backend.app.core.config import settings
from backend.app.api.deps import get_container

logger = logging.getLogger("terraledger-cli")

def reset_demo():
    if settings.APP_MODE != "demo":
        print(f"Error: reset-demo is only permitted in APP_MODE=demo. Current mode: {settings.APP_MODE}")
        sys.exit(1)

    container = get_container()
    container.reset_all_to_seeds()
    print("TerraLedger AI demo state successfully reset to baseline seed data.")

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m backend.app.cli <command>")
        print("Available commands:")
        print("  reset-demo    Restores all runtime repositories to initial seed state (demo mode only)")
        sys.exit(1)

    command = sys.argv[1].lower()
    if command == "reset-demo":
        reset_demo()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
