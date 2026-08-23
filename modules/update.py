#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 14 — GitHub Update & Fast-Forward Module
Checks Rocky0953/tg-toolkit upstream commits and performs safe fast-forward updates.
"""

import os
import sys
import subprocess
from typing import Tuple, Optional

from .utils import (
    get_base_dir,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    Colors
)

def run_git_command(args: list) -> Tuple[int, str, str]:
    base = get_base_dir()
    try:
        res = subprocess.run(args, capture_output=True, text=True, cwd=base)
        return res.returncode, res.stdout.strip(), res.stderr.strip()
    except Exception as e:
        return 1, "", str(e)

def check_for_updates() -> bool:
    print_info("Checking GitHub repository for updates (Rocky0953/tg-toolkit)...")
    
    # 1. Fetch
    code, out, err = run_git_command(["git", "fetch", "origin", "main"])
    if code != 0:
        print_warning("Could not reach remote repository. Verify internet or git remote configuration.")
        return False

    # 2. Get local and remote SHA
    _, local_sha, _ = run_git_command(["git", "rev-parse", "HEAD"])
    _, remote_sha, _ = run_git_command(["git", "rev-parse", "origin/main"])

    print(f"  Local commit:  {local_sha[:8]}")
    print(f"  Remote commit: {remote_sha[:8]}\n")

    if local_sha == remote_sha:
        print_success("TG-TOOLKIT is already up to date!")
        return False

    print_warning("New update available on upstream main branch.")
    
    # Check for uncommitted dirty files
    _, status, _ = run_git_command(["git", "status", "--porcelain"])
    if status:
        print_warning("Local uncommitted modifications detected. Stash or commit before updating.")
        return False

    choice = input("Apply fast-forward update now? [y/N]: ").strip().lower()
    if choice == "y":
        code, out, err = run_git_command(["git", "pull", "--ff-only", "origin", "main"])
        if code == 0:
            print_success("Update successfully applied!")
            return True
        else:
            print_error(f"Update failed: {err or out}")
            return False
    return False

def run_update_menu():
    print_banner("GitHub Update Manager")
    check_for_updates()
    input("\nPress Enter to continue...")

if __name__ == "__main__":
    check_for_updates()
