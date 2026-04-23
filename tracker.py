import json
import os
from datetime import datetime

# Path to the data file
DB_FILE = "brews.json"

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
