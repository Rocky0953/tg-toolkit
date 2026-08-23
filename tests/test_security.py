import unittest
import os
from modules.security import run_security_audit
from modules.utils import get_base_dir

class TestSecurityAudit(unittest.TestCase):
    def test_gitignore_contains_critical_files(self):
        base = get_base_dir()
        gitignore_path = os.path.join(base, ".gitignore")
        self.assertTrue(os.path.exists(gitignore_path), ".gitignore must exist")
        
        with open(gitignore_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("config/config.json", content)
        self.assertIn("*.session", content)
        self.assertIn(".env", content)

    def test_audit_runner(self):
        checks = run_security_audit()
        self.assertTrue(len(checks) > 0)
        for check in checks:
            self.assertIn("title", check)
            self.assertIn("passed", check)

if __name__ == "__main__":
    unittest.main()
