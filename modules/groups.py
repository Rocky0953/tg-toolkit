#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 7 — Group & Channel Manager
Inspects authorized dialogs, administrators, participant counts,
and exports data safely without spam or mass-messaging abuse.
"""

import os
import sys
import csv
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional

try:
    from telethon.tl.types import Channel, Chat, User
    from telethon.tl.functions.channels import GetParticipantsRequest, GetAdminLogRequest
    from telethon.tl.types import ChannelParticipantsAdmins, ChannelParticipantsRecent
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

async def fetch_user_dialogs() -> List[Dict[str, Any]]:
    client = get_client()
    if not client:
        return []

    try:
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Session not authorized.")
            await client.disconnect()
            return []

        dialogs = await client.get_dialogs(limit=50)
        groups = []
        for d in dialogs:
            if d.is_group or d.is_channel:
                g_type = "Channel" if d.is_channel and not getattr(d.entity, 'megagroup', False) else "Supergroup" if getattr(d.entity, 'megagroup', False) else "Group"
                groups.append({
                    "id": d.id,
                    "title": d.title,
                    "type": g_type,
                    "entity": d.entity,
                    "unread_count": d.unread_count
                })

        await client.disconnect()
        return groups
    except Exception as e:
        print_error(f"Error loading dialogs: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return []

async def get_group_admins(group_id: int) -> List[Dict[str, Any]]:
    client = get_client()
    if not client:
        return []

    try:
        await client.connect()
        if not await client.is_user_authorized():
            await client.disconnect()
            return []

        admins = []
        async for user in client.iter_participants(group_id, filter=ChannelParticipantsAdmins):
            first = user.first_name or ""
            last = user.last_name or ""
            name = f"{first} {last}".strip()
            admins.append({
                "id": user.id,
                "name": name,
                "username": f"@{user.username}" if user.username else "None",
                "bot": user.bot
            })

        await client.disconnect()
        return admins
    except Exception as e:
        print_error(f"Failed to fetch admins: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return []

def run_groups_menu():
    while True:
        print_banner("Group & Channel Manager")
        print(f"[{Colors.BOLD}1{Colors.END}] 👥 My Groups & Channels List")
        print(f"[{Colors.BOLD}2{Colors.END}] 🛡️ Inspect Group Admins")
        print(f"[{Colors.BOLD}3{Colors.END}] 📊 Group Statistics")
        print(f"[{Colors.BOLD}4{Colors.END}] 💾 Export Group List (CSV)")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-4]: ").strip()

        if choice == "1":
            print_info("Loading dialogs...")
            groups = asyncio.run(fetch_user_dialogs())
            if not groups:
                print_warning("No groups found.")
            else:
                print("\n" + f"{Colors.CYAN}{Colors.BOLD}{'ID':<16} {'TYPE':<14} {'TITLE'}{Colors.END}")
                print("─" * 60)
                for g in groups:
                    print(f"{str(g['id']):<16} {g['type']:<14} {g['title']}")
                print("─" * 60)
                print_info(f"Total: {len(groups)} groups/channels.\n")
            input("Press Enter to continue...")

        elif choice == "2":
            gid = input("\nEnter group ID or username: ").strip()
            if gid:
                try:
                    target = int(gid) if gid.lstrip("-").isdigit() else gid
                    admins = asyncio.run(get_group_admins(target))
                    print(f"\n{Colors.GREEN}{Colors.BOLD}Administrators ({len(admins)}):{Colors.END}")
                    for a in admins:
                        bot_tag = " [BOT]" if a['bot'] else ""
                        print(f"  • {a['name']} ({a['username']}) - ID: {a['id']}{bot_tag}")
                except Exception as e:
                    print_error(f"Error: {e}")
            input("\nPress Enter to continue...")

        elif choice == "3":
            print_info("Group statistics are calculated using safe MTProto metadata counters.")
            input("Press Enter to continue...")

        elif choice == "4":
            groups = asyncio.run(fetch_user_dialogs())
            if groups:
                base = get_base_dir()
                results_dir = os.path.join(base, "data", "results")
                os.makedirs(results_dir, exist_ok=True)
                ts = datetime.now().strftime("%Y%m%d_%H%M%S")
                fn = os.path.join(results_dir, f"groups_{ts}.csv")
                with open(fn, "w", newline="", encoding="utf-8") as f:
                    writer = csv.DictWriter(f, fieldnames=["id", "title", "type", "unread_count"])
                    writer.writeheader()
                    for g in groups:
                        writer.writerow({
                            "id": g["id"],
                            "title": g["title"],
                            "type": g["type"],
                            "unread_count": g["unread_count"]
                        })
                print_success(f"Groups exported to {fn}")
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid option.")

if __name__ == "__main__":
    run_groups_menu()
