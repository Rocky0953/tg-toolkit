#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 13 — Settings & Configuration Manager
Manages API ID, masked API Hash, phone numbers, and local configuration safely.
"""

import os
import sys
from typing import Dict, Any

from .utils import (
    get_base_dir,
    get_config_path,
    load_config,
    save_config,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    mask_string,
    mask_phone_number,
    Colors
)
from .telegram_connect import main_connect, main_status, main_disconnect

def configure_api_keys():
    config = load_config()
    print("\n" + f"{Colors.CYAN}{Colors.BOLD}--- Telegram API Configuration ---{Colors.END}")
    print("Obtain your API credentials from: https://my.telegram.org/apps\n")

    cur_id = config.get("api_id", "")
    cur_hash = config.get("api_hash", "")
    cur_phone = config.get("phone", "")

    print(f"Current API ID:   {cur_id or 'Not Set'}")
    print(f"Current API Hash: {mask_string(cur_hash)}")
    print(f"Current Phone:    {mask_phone_number(cur_phone)}\n")

    new_id = input(f"Enter API ID [{cur_id}]: ").strip()
    if new_id:
        config["api_id"] = new_id

    new_hash = input(f"Enter API Hash [{mask_string(cur_hash)}]: ").strip()
    if new_hash:
        config["api_hash"] = new_hash

    new_phone = input(f"Enter Phone [{mask_phone_number(cur_phone)}]: ").strip()
    if new_phone:
        config["phone"] = new_phone

    if save_config(config):
        print_success("Configuration saved with chmod 600 permissions.")
    else:
        print_error("Failed to persist configuration.")

def reset_configuration():
    confirm = input("Are you sure you want to reset local config/config.json? [y/N]: ").strip().lower()
    if confirm == "y":
        cfg = get_config_path()
        if os.path.exists(cfg):
            try:
                os.remove(cfg)
                print_success("config/config.json deleted.")
            except Exception as e:
                print_error(f"Error removing config: {e}")
        else:
            print_info("No config file present.")

def run_settings_menu():
    while True:
        print_banner("Settings & Configuration")
        print(f"[{Colors.BOLD}1{Colors.END}] 🔑 Telegram API Configuration (API ID / Hash)")
        print(f"[{Colors.BOLD}2{Colors.END}] 📱 Telegram Authentication & Connect")
        print(f"[{Colors.BOLD}3{Colors.END}] 📡 Check Connection Status")
        print(f"[{Colors.BOLD}4{Colors.END}] 🔌 Disconnect & Remove Local Session")
        print(f"[{Colors.BOLD}5{Colors.END}] 🗑️  Reset Local Configuration")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-5]: ").strip()

        if choice == "1":
            configure_api_keys()
            input("\nPress Enter to continue...")

        elif choice == "2":
            main_connect()
            input("\nPress Enter to continue...")

        elif choice == "3":
            main_status()
            input("\nPress Enter to continue...")

        elif choice == "4":
            main_disconnect()
            input("\nPress Enter to continue...")

        elif choice == "5":
            reset_configuration()
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid selection.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "config":
        configure_api_keys()
    else:
        run_settings_menu()
