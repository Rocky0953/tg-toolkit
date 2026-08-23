import unittest
import os
import tempfile
import json
from modules.utils import mask_string, mask_phone_number, save_config, load_config

class TestConfigUtilities(unittest.TestCase):
    def test_mask_api_hash(self):
        self.assertEqual(mask_string("1234567890abcdef", 4), "************cdef")
        self.assertEqual(mask_string(""), "Not Set")

    def test_mask_phone_number(self):
        # Strict privacy compliance: format must show at most country code and last 6 digits
        masked = mask_phone_number("+919876543210")
        self.assertTrue(masked.endswith("543210"))
        self.assertIn("******", masked)
        self.assertFalse("9876" in masked) # Middle digits must be hidden
        
        self.assertEqual(mask_phone_number("None"), "Not available")
        self.assertEqual(mask_phone_number(""), "Not available")

if __name__ == "__main__":
    unittest.main()
