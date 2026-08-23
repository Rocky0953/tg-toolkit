#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 5 — Username Tools Module
Provides Telegram username checks, profile information inspector,
strict privacy-safe contact phone status, batch CSV processing, and secure exports.
"""

import os
import sys
import csv
import json
import time
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional, List

try:
    from telethon import errors
    from telethon.tl.types import User, Channel, Chat
except ImportError:
    pass

from .utils import (
    get_base_dir,
    load_config,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    mask_phone_number,
    Colors
)
from .telegram_connect import get_client

def normalize_username(raw: str) -> str:
    """Strips whitespace and leading @ from username string."""
    clean = raw.strip()
    if clean.startswith("@"):
        clean = clean[1:]
    return clean

async def resolve_entity(client, username: str) -> Optional[Dict[str, Any]]:
    """Resolves a public entity via Telethon without compromising privacy."""
    try:
        entity = await client.get_entity(username)
        
        info = {
            "query": username,
            "found": True,
            "id": entity.id,
            "username": getattr(entity, 'username', None) or username,
            "restricted": getattr(entity, 'restricted', False),
            "verified": getattr(entity, 'verified', False),
            "fake": getattr(entity, 'fake', False),
            "scam": getattr(entity, 'scam', False),
            "timestamp": datetime.now().isoformat(),
        }

        if isinstance(entity, User):
            info["account_type"] = "Bot" if entity.bot else "User"
            first_name = entity.first_name or ""
            last_name = entity.last_name or ""
            info["display_name"] = f"{first_name} {last_name}".strip()
            
            # Privacy rule: phone is only set if user is in contacts or shared
            raw_phone = getattr(entity, 'phone', None)
            info["phone_masked"] = mask_phone_number(raw_phone) if raw_phone else "Not available"
            info["is_contact"] = getattr(entity, 'contact', False)
            info["is_mutual"] = getattr(entity, 'mutual_contact', False)

        elif isinstance(entity, Channel):
            info["account_type"] = "Supergroup" if entity.megagroup else "Channel"
            info["display_name"] = entity.title or "Channel"
            info["phone_masked"] = "Not applicable (Channel/Supergroup)"
            info["participants_count"] = getattr(entity, 'participants_count', None)

        elif isinstance(entity, Chat):
            info["account_type"] = "Group"
            info["display_name"] = entity.title or "Group"
            info["phone_masked"] = "Not applicable (Group)"
            info["participants_count"] = getattr(entity, 'participants_count', None)

        else:
            info["account_type"] = "Unknown"
            info["display_name"] = str(entity)
            info["phone_masked"] = "Not available"

        return info

    except errors.UsernameNotOccupiedError:
        return {"query": username, "found": False, "reason": "Username not occupied", "account_type": "None"}
    except errors.UsernameInvalidError:
        return {"query": username, "found": False, "reason": "Invalid username format", "account_type": "Invalid"}
    except errors.FloodWaitError as e:
        print_warning(f"Telegram rate limit: wait {e.seconds}s.")
        return {"query": username, "found": False, "reason": f"Rate limited ({e.seconds}s)", "account_type": "RateLimit"}
    except Exception as e:
        return {"query": username, "found": False, "reason": str(e), "account_type": "Error"}

async def check_single_username(username: str) -> Optional[Dict[str, Any]]:
    client = get_client()
    if not client:
        return None

    clean = normalize_username(username)
    if not clean:
        print_error("Invalid empty username provided.")
        return None

    print_info(f"Checking Telegram username @{clean}...")
    
    try:
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Authentication required. Please run: ./tg-tool connect")
            await client.disconnect()
            return None

        result = await resolve_entity(client, clean)
        await client.disconnect()

        if result and result.get("found"):
            print("\n" + f"{Colors.GREEN}{Colors.BOLD}================ USERNAME FOUND ================{Colors.END}")
            print(f"  {Colors.BOLD}Username:{Colors.END}     @{result.get('username')}")
            print(f"  {Colors.BOLD}Account Type:{Colors.END} {result.get('account_type')}")
            print(f"  {Colors.BOLD}Display Name:{Colors.END} {result.get('display_name')}")
            print(f"  {Colors.BOLD}Public ID:{Colors.END}    {result.get('id')}")
            if result.get('verified'):
                print(f"  {Colors.BOLD}Status:{Colors.END}       {Colors.CYAN}Verified Official{Colors.END}")
            if result.get('scam') or result.get('fake'):
                print(f"  {Colors.BOLD}Status:{Colors.END}       {Colors.RED}Flagged as Scam/Fake{Colors.END}")
            print(f"{Colors.GREEN}{Colors.BOLD}================================================{Colors.END}\n")
        else:
            reason = result.get("reason", "Not found") if result else "Lookup failed"
            print_error(f"Username @{clean} could not be resolved: {reason}")

        return result
    except Exception as e:
        print_error(f"Lookup failed: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return None

async def show_profile_info(username: str):
    client = get_client()
    if not client:
        return

    clean = normalize_username(username)
    try:
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Session not authorized. Run ./tg-tool connect")
            await client.disconnect()
            return

        print_info(f"Fetching public profile data for @{clean}...")
        result = await resolve_entity(client, clean)
        await client.disconnect()

        if result and result.get("found"):
            print("\n" + f"{Colors.CYAN}{Colors.BOLD}------------- Profile Information -------------{Colors.END}")
            print(f"  Username:        @{result.get('username')}")
            print(f"  Name:            {result.get('display_name')}")
            print(f"  Account Type:    {result.get('account_type')}")
            print(f"  Public ID:       {result.get('id')}")
            print(f"  Contact In Phone:{'Yes' if result.get('is_contact') else 'No'}")
            print(f"  Mutual Contact:  {'Yes' if result.get('is_mutual') else 'No'}")
            print(f"  Phone (Masked):  {result.get('phone_masked', 'Not available')}")
            print(f"{Colors.CYAN}{Colors.BOLD}-----------------------------------------------{Colors.END}\n")
        else:
            print_error(f"Profile @{clean} unavailable.")
    except Exception as e:
        print_error(f"Profile error: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass

def show_contact_phone_status(username: str):
    """
    Displays the privacy audit status for a username.
    Reinforces that hidden/private phone numbers are never discoverable.
    """
    clean = normalize_username(username)
    print("\n" + f"{Colors.YELLOW}{Colors.BOLD}========= PRIVACY & PHONE NUMBER COMPLIANCE ========={Colors.END}")
    print("Telegram usernames CANNOT be used to discover hidden/private phone numbers.")
    print("Masking format enforced: +CountryCode******Last6Digits")
    print(f"{Colors.YELLOW}{Colors.BOLD}====================================================={Colors.END}\n")
    
    async def _audit():
        client = get_client()
        if not client:
            return
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Authentication required.")
            await client.disconnect()
            return
        
        result = await resolve_entity(client, clean)
        await client.disconnect()
        
        if result and result.get("found"):
            print(f"Username:       @{result.get('username')}")
            print(f"Account Type:   {result.get('account_type')}")
            print(f"Is In Contacts: {'Yes' if result.get('is_contact') else 'No'}")
            print(f"Phone Status:   {result.get('phone_masked', 'Not available')}")
        else:
            print_error(f"Username @{clean} not found or inaccessible.")

    asyncio.run(_audit())

async def run_batch_username_check(input_csv: str, output_csv: Optional[str] = None):
    """
    Reads a list of usernames from a CSV file, performs rate-limited checks,
    and writes results to data/results/batch_usernames_<timestamp>.csv
    """
    if not os.path.exists(input_csv):
        print_error(f"Input file not found: {input_csv}")
        print_info("Create it with a 'username' column header. Example:")
        print("  username")
        print("  durov")
        print("  telegram")
        return

    usernames = []
    with open(input_csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames or "username" not in [col.strip().lower() for col in reader.fieldnames]:
            print_error("CSV file must contain a 'username' column header.")
            return
        
        user_col = next(col for col in reader.fieldnames if col.strip().lower() == "username")
        for row in reader:
            val = normalize_username(row.get(user_col, ""))
            if val:
                usernames.append(val)

    if not usernames:
        print_warning("No valid usernames found in CSV.")
        return

    print_info(f"Loaded {len(usernames)} usernames to verify.")
    client = get_client()
    if not client:
        return

    await client.connect()
    if not await client.is_user_authorized():
        print_error("Client not authorized. Run ./tg-tool connect")
        await client.disconnect()
        return

    base = get_base_dir()
    results_dir = os.path.join(base, "data", "results")
    os.makedirs(results_dir, exist_ok=True)
    
    if not output_csv:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_csv = os.path.join(results_dir, f"batch_usernames_{timestamp}.csv")

    results = []
    config = load_config()
    delay = config.get("rate_limit_delay_seconds", 1.5)

    print_info(f"Beginning batch check with safe delay ({delay}s)...")

    for i, uname in enumerate(usernames, 1):
        print(f"[{i}/{len(usernames)}] Checking @{uname}...")
        res = await resolve_entity(client, uname)
        if res:
            results.append({
                "username": uname,
                "account_type": res.get("account_type", "unknown"),
                "status": "found" if res.get("found") else "not_found",
                "display_name": res.get("display_name", ""),
                "id": res.get("id", ""),
                "phone_masked": res.get("phone_masked", "Not available")
            })
        time.sleep(delay)

    await client.disconnect()

    # Save to CSV
    try:
        with open(output_csv, "w", newline="", encoding="utf-8") as f:
            fieldnames = ["username", "account_type", "status", "display_name", "id", "phone_masked"]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        print_success(f"Batch check completed! Results saved to: {output_csv}")
    except Exception as e:
        print_error(f"Failed to export batch results: {e}")

def export_last_results(data: List[Dict[str, Any]], fmt: str = "csv"):
    """Exports structured data to data/results/ in CSV or JSON format."""
    base = get_base_dir()
    results_dir = os.path.join(base, "data", "results")
    os.makedirs(results_dir, exist_ok=True)
    
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    if fmt == "json":
        filepath = os.path.join(results_dir, f"export_usernames_{ts}.json")
        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            print_success(f"Exported JSON to: {filepath}")
        except Exception as e:
            print_error(f"Export failed: {e}")
    else:
        filepath = os.path.join(results_dir, f"export_usernames_{ts}.csv")
        try:
            if not data:
                print_warning("No data to export.")
                return
            fieldnames = list(data[0].keys())
            with open(filepath, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)
            print_success(f"Exported CSV to: {filepath}")
        except Exception as e:
            print_error(f"Export failed: {e}")

def run_username_menu():
    """Interactive CLI menu for Username Tools."""
    last_results: List[Dict[str, Any]] = []

    while True:
        print_banner("Username Tools")
        print(f"[{Colors.BOLD}1{Colors.END}] 🔍 Check Username")
        print(f"[{Colors.BOLD}2{Colors.END}] 👤 Profile Information")
        print(f"[{Colors.BOLD}3{Colors.END}] 📱 Contact Phone Status")
        print(f"[{Colors.BOLD}4{Colors.END}] 📑 Batch Username Check (CSV)")
        print(f"[{Colors.BOLD}5{Colors.END}] 💾 Export Results")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-5]: ").strip()

        if choice == "1":
            uname = input("\nEnter username (e.g. @example): ").strip()
            if uname:
                res = asyncio.run(check_single_username(uname))
                if res:
                    last_results = [res]
            input("\nPress Enter to continue...")

        elif choice == "2":
            uname = input("\nEnter username: ").strip()
            if uname:
                asyncio.run(show_profile_info(uname))
            input("\nPress Enter to continue...")

        elif choice == "3":
            uname = input("\nEnter username: ").strip()
            if uname:
                show_contact_phone_status(uname)
            input("\nPress Enter to continue...")

        elif choice == "4":
            base = get_base_dir()
            default_csv = os.path.join(base, "data", "input", "usernames.csv")
            custom_path = input(f"\nCSV path [{default_csv}]: ").strip()
            target_csv = custom_path if custom_path else default_csv
            asyncio.run(run_batch_username_check(target_csv))
            input("\nPress Enter to continue...")

        elif choice == "5":
            if not last_results:
                print_warning("No recent lookup results in memory to export.")
            else:
                fmt = input("Format (csv / json) [csv]: ").strip().lower() or "csv"
                export_last_results(last_results, fmt)
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid selection.")
            time.sleep(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg.startswith("@") or len(sys.argv) == 2 and arg not in ("menu", "batch"):
            asyncio.run(check_single_username(arg))
        elif arg == "batch" and len(sys.argv) > 2:
            asyncio.run(run_batch_username_check(sys.argv[2]))
        else:
            run_username_menu()
    else:
        run_username_menu()
