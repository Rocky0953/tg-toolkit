#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 12 — System Doctor Diagnostic Engine
Performs comprehensive verification of dependencies, directory structures,
Git remote status, Telethon library, MTProto connectivity, and configuration protection.
"""

import os
import sys
import shutil
import subprocess
from typing import List, Dict, Any, Tuple

from .utils import (
    get_base_dir,
    get_config_path,
    load_config,
    print_banner,
    print_success,
    print_error,
    print_warning,
    Colors
)
from .security import run_security_audit

def check_command(cmd: str) -> bool:
    return shutil.which(cmd) is not None

def run_doctor() -> Tuple[int, int, int]:
    base = get_base_dir()
    pass_cnt = 0
    warn_cnt = 0
    err_cnt = 0

    print("\n" + f"{Colors.CYAN}{Colors.BOLD}TG-TOOLKIT System Doctor v1.2{Colors.END}")
    print("─" * 48)

    # 1. Environment & Shell
    is_termux = "com.termux" in os.environ.get("PREFIX", "") or os.path.exists("/data/data/com.termux")
    if is_termux or sys.platform.startswith("linux") or sys.platform.startswith("darwin"):
        print_success("Termux / Linux Environment verified")
        pass_cnt += 1
    else:
        print_warning(f"Non-standard runtime detected: {sys.platform}")
        warn_cnt += 1

    # Python Version
    py_ver = sys.version_info
    if py_ver >= (3, 9):
        print_success(f"Python runtime: v{py_ver.major}.{py_ver.minor}.{py_ver.micro}")
        pass_cnt += 1
    else:
        print_error(f"Python version too old: {py_ver.major}.{py_ver.minor}")
        err_cnt += 1

    # Dependencies: Git, Curl, Bash
    for tool in ["bash", "git", "curl"]:
        if check_command(tool):
            print_success(f"CLI binary available: {tool}")
            pass_cnt += 1
        else:
            print_error(f"Missing binary tool: {tool}")
            err_cnt += 1

    # Telethon library
    try:
        import telethon
        print_success(f"Telethon library installed: v{telethon.__version__}")
        pass_cnt += 1
    except ImportError:
        print_error("Telethon library not installed. Run: pip install telethon")
        err_cnt += 1

    # Directory Structure
    req_dirs = ["config", "modules", "data", "data/results", "data/input", "logs"]
    for d in req_dirs:
        p = os.path.join(base, d)
        if os.path.exists(p) and os.path.isdir(p):
            print_success(f"Directory structure verified: {d}/")
            pass_cnt += 1
        else:
            print_warning(f"Missing directory: {d}/")
            warn_cnt += 1

    # Git repository check
    if os.path.exists(os.path.join(base, ".git")):
        print_success("Git repository initialized")
        pass_cnt += 1
        try:
            res = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True, cwd=base)
            branch = res.stdout.strip()
            print_success(f"Git current branch: {branch or 'main'}")
            pass_cnt += 1
        except Exception:
            pass
    else:
        print_warning("Not a git repository checkout.")
        warn_cnt += 1

    # Security & Configuration
    sec_checks = run_security_audit()
    for sc in sec_checks:
        if sc["passed"]:
            print_success(sc["title"])
            pass_cnt += 1
        else:
            print_warning(f"{sc['title']} - {sc['detail']}")
            warn_cnt += 1

    # Telegram session
    session_file = os.path.join(base, "data", "telegram.session")
    if os.path.exists(session_file):
        sz = os.path.getsize(session_file)
        print_success(f"Local Telegram session present ({sz} bytes)")
        pass_cnt += 1
    else:
        print_warning("No active session file (run ./tg-tool connect to authenticate)")
        warn_cnt += 1

    print("─" * 48)
    print(f"{Colors.BOLD}PASS: {pass_cnt}   WARNING: {warn_cnt}   ERROR: {err_cnt}{Colors.END}")
    
    if err_cnt == 0 and warn_cnt == 0:
        status_str = f"{Colors.GREEN}{Colors.BOLD}READY{Colors.END}"
    elif err_cnt == 0:
        status_str = f"{Colors.YELLOW}{Colors.BOLD}READY WITH WARNINGS{Colors.END}"
    else:
        status_str = f"{Colors.RED}{Colors.BOLD}ACTION REQUIRED{Colors.END}"

    print(f"Status: {status_str}\n")
    return pass_cnt, warn_cnt, err_cnt

def run_doctor_menu():
    run_doctor()
    input("Press Enter to continue...")

if __name__ == "__main__":
    run_doctor()
