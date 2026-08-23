import unittest
import os
import tempfile
import csv
from modules.csv_tools import validate_csv, deduplicate_csv

class TestCsvTools(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile(mode="w+", delete=False, newline="")
        writer = csv.writer(self.tmp)
        writer.writerow(["username", "type"])
        writer.writerow(["durov", "user"])
        writer.writerow(["durov", "user"])
        writer.writerow(["telegram", "channel"])
        self.tmp.close()

    def tearDown(self):
        if os.path.exists(self.tmp.name):
            os.remove(self.tmp.name)

    def test_validate_and_deduplicate(self):
        report = validate_csv(self.tmp.name)
        self.assertTrue(report["valid"])
        self.assertEqual(report["rows_count"], 3)

        out_tmp = tempfile.NamedTemporaryFile(delete=False)
        out_tmp.close()
        try:
            removed = deduplicate_csv(self.tmp.name, "username", out_tmp.name)
            self.assertEqual(removed, 1)
        finally:
            if os.path.exists(out_tmp.name):
                os.remove(out_tmp.name)

if __name__ == "__main__":
    unittest.main()
