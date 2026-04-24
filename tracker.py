import json
import os
import sys
import time
from datetime import datetime

# Path to the data file
DB_FILE = "brews.json"

# Default steep times (in seconds)
STEEP_TIMES = {
    "green": 120,   # 2 minutes
    "black": 240,   # 4 minutes
    "herbal": 300,  # 5 minutes
}

def brew_timer(tea_type):
    """Start a countdown for a specific tea type."""
    tea_type = tea_type.lower()
    if tea_type not in STEEP_TIMES:
        print(f"Unknown tea type: {tea_type}. Defaulting to 3 minutes (180s).")
        duration = 180
    else:
        duration = STEEP_TIMES[tea_type]

    print(f"Starting {tea_type} timer for {duration // 60}:{duration % 60:02d}...")
    
    try:
        while duration > 0:
            mins, secs = divmod(duration, 60)
            timer = f"{mins:02d}:{secs:02d}"
            print(f"\rRemaining: {timer}", end="", flush=True)
            time.sleep(1)
            duration -= 1
        
        print("\rRemaining: 00:00")
        print("BEEP BEEP! Your tea is ready!")
    except KeyboardInterrupt:
        print("\nTimer cancelled.")

def load_brews():
    """Load existing logs from the JSON file."""
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []

def save_brew(brew):
    """Save a new brew log to the JSON file."""
    brews = load_brews()
    brews.append(brew)
    with open(DB_FILE, 'w') as f:
        json.dump(brews, f, indent=4)

def get_input(prompt, required=True):
    """Helper to get user input with basic validation."""
    while True:
        value = input(prompt).strip()
        if not value and required:
            print("This field is required.")
            continue
        return value

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "brew" and len(sys.argv) > 2 and sys.argv[2] == "timer":
        tea_type = sys.argv[3] if len(sys.argv) > 3 else "herbal"
        brew_timer(tea_type)
        return

    print("--- Teatime Tracker ---")
    print("Log your latest brew!\n")

    # Guided interactive flow
    while True:
        drink_type = get_input("Drink type (Tea/Coffee): ").capitalize()
        if drink_type in ["Tea", "Coffee"]:
            break
        print("Invalid choice. Please enter 'Tea' or 'Coffee'.")

    name = get_input("Name/Variety: ")
    notes = get_input("Notes (optional): ", required=False)
    
    # Auto-generate timestamp
    timestamp = datetime.now().isoformat()

    brew_data = {
        "drink_type": drink_type,
        "name": name,
        "notes": notes,
        "timestamp": timestamp
    }

    save_brew(brew_data)
    print(f"\nSuccessfully logged your {drink_type}: {name}!")

if __name__ == "__main__":
    main()

