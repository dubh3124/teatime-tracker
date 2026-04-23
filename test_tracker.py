import unittest
import os
import json
from tracker import load_brews, save_brew, DB_FILE

class TestTracker(unittest.TestCase):
    def setUp(self):
        # Use a temporary file for testing
        self.test_file = "test_brews.json"
        import tracker
        tracker.DB_FILE = self.test_file

    def tearDown(self):
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_save_and_load_brew(self):
        sample_brew = {
            "drink_type": "Tea",
            "name": "Earl Grey",
            "notes": "Delicious",
            "timestamp": "2023-10-27T10:00:00"
        }
        save_brew(sample_brew)
        
        brews = load_brews()
        self.assertEqual(len(brews), 1)
        self.assertEqual(brews[0]["name"], "Earl Grey")

if __name__ == "__main__":
    unittest.main()
