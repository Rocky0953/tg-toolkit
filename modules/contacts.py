#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 6 — Contact & Privacy Module
Operates exclusively on authorized data with strict phone masking (+91******123456)
and zero privacy bypass functionality.
"""

import os
import sys
import csv
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any

try:
    from telethon.tl.functions.contacts import GetContactsRequest, GetBlockedRequest
except ImportError:
    pass

from .utils import (
    get_base_dir,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    mask_phone_number,
    Colors
)
from .telegram_connect import get_client

async def fetch_contacts() -> List[Dict[str, Any]]:
    client = get_client()
    if not client:
        return []

    try:
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Session not authorized. Run ./tg-tool connect")
            await client.disconnect()
            return []

        contact_data = await client(GetContactsRequest(hash=0))
        users = contact_data.users
        contacts = []

        for u in users:
            first = u.first_name or ""
            last = u.last_name or ""
            name = f"{first} {last}".strip()
            
            raw_phone = getattr(u, 'phone', None)
            masked_phone = mask_phone_number(raw_phone)
            
            contacts.append({
                "id": u.id,
                "name": name or "No Name",
                "username": f"@{u.username}" if u.username else "None",
                "phone_masked": masked_phone,
                "mutual": getattr(u, 'mutual_contact', False),
                "verified": getattr(u, 'verified', False)
            })

        await client.disconnect()
        return contacts
    except Exception as e:
        print_error(f"Error retrieving contacts: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return []

def display_contacts_table(contacts: List[Dict[str, Any]]):
    if not contacts:
        print_warning("No contacts found.")
        return

    print("\n" + f"{Colors.CYAN}{Colors.BOLD}{'NAME':<24} {'USERNAME':<18} {'PHONE (MASKED)':<20} {'MUTUAL':<8}{Colors.END}")
    print("─" * 72)
    for c in contacts:
        mut = "Yes" if c.get("mutual") else "No"
        print(f"{c.get('name')[:22]:<24} {c.get('username')[:16]:<18} {c.get('phone_masked'):<20} {mut:<8}")
    print("─" * 72)
    print_info(f"Total contacts: {len(contacts)}\n")

def export_contacts_to_csv(contacts: List[Dict[str, Any]]):
    base = get_base_dir()
    results_dir = os.path.join(base, "data", "results")
    os.makedirs(results_dir, exist_ok=True)
    
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(results_dir, f"contacts_export_{ts}.csv")
    
    try:
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            fieldnames = ["id", "name", "username", "phone_masked", "mutual", "verified"]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(contacts)
        print_success(f"Contacts successfully exported to: {filepath}")
    except Exception as e:
        print_error(f"Export failed: {e}")

async def show_blocked_users():
    client = get_client()
    if not client:
        return

    try:
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Session not authorized.")
            await client.disconnect()
            return

        print_info("Fetching blocked users list...")
        blocked = await client(GetBlockedRequest(offset=0, limit=100))
        users = blocked.users
        await client.disconnect()

        if not users:
            print_info("No blocked users on this account.")
            return

        print("\n" + f"{Colors.RED}{Colors.BOLD}Blocked Users ({len(users)}):{Colors.END}")
        for u in users:
            name = f"{u.first_name or ''} {u.last_name or ''}".strip()
            uname = f"@{u.username}" if u.username else "No username"
            print(f"  - {name} ({uname}) [ID: {u.id}]")
        print()
    except Exception as e:
        print_error(f"Failed to fetch blocked users: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass

def run_contacts_menu():
    cached_contacts: List[Dict[str, Any]] = []

    while True:
        print_banner("Contact & Privacy Manager")
        print(f"[{Colors.BOLD}1{Colors.END}] 👥 My Contacts")
        print(f"[{Colors.BOLD}2{Colors.END}] 🔍 Contact Search")
        print(f"[{Colors.BOLD}3{Colors.END}] ℹ️  Contact Information")
        print(f"[{Colors.BOLD}4{Colors.END}] 🛡️ Privacy Status & Policy")
        print(f"[{Colors.BOLD}5{Colors.END}] 🚫 Blocked Users")
        print(f"[{Colors.BOLD}6{Colors.END}] 💾 Export Contacts (CSV)")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-6]: ").strip()

        if choice == "1":
            print_info("Fetching authorized contacts from Telegram...")
            cached_contacts = asyncio.run(fetch_contacts())
            display_contacts_table(cached_contacts)
            input("Press Enter to continue...")

        elif choice == "2":
            if not cached_contacts:
                cached_contacts = asyncio.run(fetch_contacts())
            q = input("\nEnter name or username keyword: ").strip().lower()
            filtered = [
                c for c in cached_contacts 
                if q in c.get("name", "").lower() or q in c.get("username", "").lower()
            ]
            display_contacts_table(filtered)
            input("Press Enter to continue...")

        elif choice == "3":
            if not cached_contacts:
                cached_contacts = asyncio.run(fetch_contacts())
            q = input("\nEnter exact contact name or @username: ").strip().lower()
            match = next((c for c in cached_contacts if q in c.get("name", "").lower() or q == c.get("username", "").lower()), None)
            if match:
                print(f"\nName:         {match['name']}")
                print(f"Username:     {match['username']}")
                print(f"ID:           {match['id']}")
                print(f"Phone Mask:   {match['phone_masked']}")
                print(f"Mutual:       {'Yes' if match['mutual'] else 'No'}")
            else:
                print_warning("No matching contact found in authorized address book.")
            input("\nPress Enter to continue...")

        elif choice == "4":
            print(f"\n{Colors.GREEN}{Colors.BOLD}Privacy Policy & Compliance Status:{Colors.END}")
            print("  • Phone number privacy: Strict masking (+CountryCode******Last6) is enforced.")
            print("  • Zero harvesting: Contact sync only reads local authorized peer mappings.")
            print("  • Session isolation: Telegram credentials never leave this local Termux device.")
            input("\nPress Enter to continue...")

        elif choice == "5":
            asyncio.run(show_blocked_users())
            input("Press Enter to continue...")

        elif choice == "6":
            if not cached_contacts:
                cached_contacts = asyncio.run(fetch_contacts())
            export_contacts_to_csv(cached_contacts)
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid selection.")

if __name__ == "__main__":
    run_contacts_menu()
