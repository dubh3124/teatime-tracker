import unittest
from unittest.mock import patch, MagicMock
import io
import sys
import os

# Import the tracker
sys.path.append(os.getcwd())
import tracker

class TestTimer(unittest.TestCase):
    @patch('time.sleep', return_value=None)
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_green_timer(self, mock_stdout, mock_sleep):
        tracker.start_timer("green")
        output = mock_stdout.getvalue()
        self.assertIn("Starting green timer for 2:00", output)
        self.assertIn("Remaining: 00:01", output)
        self.assertIn("Brewing complete!", output)
        self.assertIn("\a", output)

    @patch('time.sleep', return_value=None)
    @patch('sys.stdout', new_callable=io.StringIO)
    def test_unknown_timer(self, mock_stdout, mock_sleep):
        tracker.start_timer("unknown")
        output = mock_stdout.getvalue()
        self.assertIn("Unknown tea type: unknown. Defaulting to 3 minutes (180s).", output)
        self.assertIn("Starting unknown timer for 3:00", output)
        self.assertIn("Remaining: 00:01", output)
        self.assertIn("Brewing complete!", output)

if __name__ == '__main__':
    unittest.main()
