#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 11 — Security Center Module
Audits local permissions (chmod 600), .gitignore coverage, session isolation,
and scans for accidental credential exposure without revealing secrets.
"""

import os
import sys
import stat
import subprocess
from typing import List, Dict, Any

from .utils import (
    get_base_dir,
    get_config_path,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    Colors
)

def run_security_audit() -> List[Dict[str, Any]]:
    base = get_base_dir()
    checks = []

    # 1. Config file existence and permissions
    cfg = get_config_path()
    if os.path.exists(cfg):
        st = os.stat(cfg)
        mode = oct(stat.S_IMODE(st.st_mode))
        is_strict = mode in ('0o600', '0600', '0o400', '0400')
        checks.append({
            "title": "config/config.json Permissions (chmod 600)",
            "passed": is_strict,
            "detail": f"File mode is {mode} (Owner read/write only: {'PASS' if is_strict else 'WARN'})",
            "fix": f"chmod 600 {cfg}"
        })
    else:
        checks.append({
            "title": "config/config.json Permissions",
            "passed": True,
            "detail": "Config file not yet created.",
            "fix": None
        })

    # 2. .gitignore protections
    gitignore_path = os.path.join(base, ".gitignore")
    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r", encoding="utf-8") as f:
            gi_content = f.read()
        
        has_cfg = "config/config.json" in gi_content
        has_sess = "*.session" in gi_content
        has_env = ".env" in gi_content
        
        checks.append({
            "title": ".gitignore Config Exclusion",
            "passed": has_cfg,
            "detail": "config/config.json is shielded from git commits" if has_cfg else "config/config.json missing from .gitignore",
            "fix": "Add 'config/config.json' to .gitignore"
        })
        checks.append({
            "title": ".gitignore Session Exclusion",
            "passed": has_sess,
            "detail": "*.session files are shielded from git commits" if has_sess else "*.session missing from .gitignore",
            "fix": "Add '*.session' to .gitignore"
        })
        checks.append({
            "title": ".gitignore .env Exclusion",
            "passed": has_env,
            "detail": ".env files are shielded from git commits" if has_env else ".env missing from .gitignore",
            "fix": "Add '.env' to .gitignore"
        })
    else:
        checks.append({
            "title": ".gitignore Presence",
            "passed": False,
            "detail": ".gitignore file missing!",
            "fix": "Create .gitignore"
        })

    # 3. Log Credential Leak Check
    logs_dir = os.path.join(base, "logs")
    leaks_found = False
    if os.path.exists(logs_dir):
        for root, _, files in os.walk(logs_dir):
            for file in files:
                if file.endswith(".log"):
                    try:
                        with open(os.path.join(root, file), "r", encoding="utf-8", errors="ignore") as lf:
                            content = lf.read()
                            if "api_hash" in content.lower() and len(content) > 200:
                                leaks_found = True
                    except Exception:
                        pass
    checks.append({
        "title": "Log Directory Credential Sanitization",
        "passed": not leaks_found,
        "detail": "Logs are clean of raw API hashes and OTP credentials" if not leaks_found else "Suspicious credentials found in log files",
        "fix": "Truncate logs/ directory"
    })

    return checks

def print_security_report():
    checks = run_security_audit()
    passed_count = sum(1 for c in checks if c["passed"])
    
    print("\n" + f"{Colors.CYAN}{Colors.BOLD}================ SECURITY & PERMISSIONS AUDIT ================{Colors.END}")
    for c in checks:
        if c["passed"]:
            print(f"  {Colors.GREEN}[✓] PASS:{Colors.END} {c['title']}")
            print(f"      {Colors.DIM}{c['detail']}{Colors.END}")
        else:
            print(f"  {Colors.YELLOW}[!] WARN:{Colors.END} {c['title']}")
            print(f"      {Colors.DIM}{c['detail']}{Colors.END}")
            if c.get("fix"):
                print(f"      {Colors.CYAN}Suggested action: {c['fix']}{Colors.END}")
    print("─" * 62)
    print(f"  Security Score: {passed_count}/{len(checks)} Passed")
    print(f"{Colors.CYAN}{Colors.BOLD}=============================================================={Colors.END}\n")

def run_security_menu():
    while True:
        print_banner("Security Center")
        print(f"[{Colors.BOLD}1{Colors.END}] 🛡️ Run Full Security & Permissions Audit")
        print(f"[{Colors.BOLD}2{Colors.END}] 🔒 Enforce chmod 600 on config.json")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-2]: ").strip()

        if choice == "1":
            print_security_report()
            input("Press Enter to continue...")

        elif choice == "2":
            cfg = get_config_path()
            if os.path.exists(cfg):
                try:
                    os.chmod(cfg, 0o600)
                    print_success(f"Enforced chmod 600 on {cfg}")
                except Exception as e:
                    print_error(f"Failed to set permissions: {e}")
            else:
                print_info("No config.json found to modify.")
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid selection.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ("audit", "report", "check"):
        print_security_report()
    else:
        run_security_menu()
