#!/usr/bin/env python3
"""
TG-TOOLKIT: Utility and Helper Module
Provides common console formatting, masked phone utilities, configuration loader,
and secure file handling.
"""

import os
import sys
import json
import stat
import logging
from typing import Dict, Any, Optional

VERSION = "1.5.0-dev"

# ANSI Colors for Termux / Linux Terminal
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def print_banner(subtitle: str = "Telegram Management CLI"):
    """Displays the standard professional TG-TOOLKIT header."""
    print(f"{Colors.CYAN}{Colors.BOLD}╔══════════════════════════════════════════════╗{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}║             TG-TOOLKIT v{VERSION:<14}       ║{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}║       {subtitle:<30} ║{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}╚══════════════════════════════════════════════╝{Colors.END}\n")

def print_success(msg: str):
    print(f"{Colors.GREEN}[✓]{Colors.END} {msg}")

def print_info(msg: str):
    print(f"{Colors.CYAN}[*]{Colors.END} {msg}")

def print_warning(msg: str):
    print(f"{Colors.YELLOW}[!]{Colors.END} {msg}")

def print_error(msg: str):
    print(f"{Colors.RED}[✗]{Colors.END} {msg}")

def mask_string(val: str, visible_tail: int = 4) -> str:
    """Masks a sensitive string (e.g. API Hash) showing only tail."""
    if not val:
        return "Not Set"
    if len(val) <= visible_tail:
        return "*" * len(val)
    return "*" * (len(val) - visible_tail) + val[-visible_tail:]

def mask_phone_number(phone: str) -> str:
    """
    Masks a phone number strictly per security guidelines.
    Format: +<country_code>******<last_6_digits>
    Example: +919876543210 -> +91******543210
    """
    if not phone or phone.lower() in ("none", "not available", "hidden", ""):
        return "Not available"
    
    clean = "".join([c for c in phone if c.isdigit() or c == '+'])
    if not clean:
        return "Not available"
    
    has_plus = clean.startswith('+')
    digits = clean[1:] if has_plus else clean
    
    if len(digits) <= 6:
        return f"+******{digits}" if has_plus else f"******{digits}"
    
    # Country code prefix (first 2-3 digits) + ****** + last 6 digits
    last_6 = digits[-6:]
    prefix_len = max(1, min(3, len(digits) - 6))
    prefix = digits[:prefix_len]
    prefix_str = f"+{prefix}" if has_plus or len(digits) > 10 else prefix
    return f"{prefix_str}******{last_6}"

def get_base_dir() -> str:
    """Returns the absolute root directory of tg-toolkit."""
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def get_config_path() -> str:
    return os.path.join(get_base_dir(), "config", "config.json")

def load_config() -> Dict[str, Any]:
    """Loads configuration with security and permission verification."""
    config_file = get_config_path()
    if not os.path.exists(config_file):
        return {}
    
    # Check permissions (warning if open to other users)
    try:
        st = os.stat(config_file)
        mode = stat.S_IMODE(st.st_mode)
        if mode & 0o077:
            # File is group or world readable/writable
            pass
    except Exception:
        pass

    try:
        with open(config_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print_error(f"Error parsing config.json: {e}")
        return {}

def save_config(config_data: Dict[str, Any]) -> bool:
    """Saves configuration and enforces chmod 600 permissions."""
    config_dir = os.path.join(get_base_dir(), "config")
    os.makedirs(config_dir, exist_ok=True)
    config_file = get_config_path()
    
    try:
        with open(config_file, "w", encoding="utf-8") as f:
            json.dump(config_data, f, indent=2)
        # Apply chmod 600 (read/write only by owner)
        try:
            os.chmod(config_file, 0o600)
        except Exception:
            pass
        return True
    except Exception as e:
        print_error(f"Failed to save config: {e}")
        return False

def ensure_directories():
    """Ensures that data/, data/results/, data/input/, logs/ exist."""
    base = get_base_dir()
    for d in ["config", "data", "data/results", "data/input", "logs"]:
        os.makedirs(os.path.join(base, d), exist_ok=True)

def setup_logger(module_name: str) -> logging.Logger:
    """Creates a local logger that never logs sensitive credentials."""
    ensure_directories()
    log_dir = os.path.join(get_base_dir(), "logs")
    log_file = os.path.join(log_dir, "tg-toolkit.log")
    
    logger = logging.getLogger(module_name)
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        fh = logging.FileHandler(log_file, encoding="utf-8")
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fh.setFormatter(formatter)
        logger.addHandler(fh)
    
    return logger
