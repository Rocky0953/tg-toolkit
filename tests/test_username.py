import unittest
from modules.username_tools import normalize_username

class TestUsernameTools(unittest.TestCase):
    def test_normalize_username(self):
        self.assertEqual(normalize_username("@durov"), "durov")
        self.assertEqual(normalize_username("durov"), "durov")
        self.assertEqual(normalize_username("  @telegram  "), "telegram")
        self.assertEqual(normalize_username(""), "")

if __name__ == "__main__":
    unittest.main()
