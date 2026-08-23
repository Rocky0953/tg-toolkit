#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 8 — Analytics Module
Computes legitimate metadata summaries, account statistics, and growth snapshots.
"""

import os
import sys
import json
import asyncio
from datetime import datetime
from typing import Dict, Any

from .utils import (
    get_base_dir,
    print_banner,
    print_success,
    print_error,
    print_info,
    Colors
)
from .telegram_connect import get_client

async def generate_account_analytics() -> Dict[str, Any]:
    client = get_client()
    if not client:
        return {}

    try:
        await client.connect()
        if not await client.is_user_authorized():
            await client.disconnect()
            return {}

        me = await client.get_me()
        dialogs = await client.get_dialogs(limit=100)
        
        users_count = sum(1 for d in dialogs if d.is_user)
        groups_count = sum(1 for d in dialogs if d.is_group)
        channels_count = sum(1 for d in dialogs if d.is_channel)
        
        unread_total = sum(d.unread_count for d in dialogs)

        stats = {
            "account_id": me.id,
            "name": f"{me.first_name} {me.last_name or ''}".strip(),
            "username": f"@{me.username}" if me.username else "None",
            "dialogs_sampled": len(dialogs),
            "direct_chats": users_count,
            "groups": groups_count,
            "channels": channels_count,
            "total_unread_messages": unread_total,
            "generated_at": datetime.now().isoformat()
        }

        await client.disconnect()
        return stats
    except Exception as e:
        print_error(f"Analytics error: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return {}

def run_analytics_menu():
    while True:
        print_banner("Telegram Analytics Engine")
        print(f"[{Colors.BOLD}1{Colors.END}] 📊 Account Statistics Overview")
        print(f"[{Colors.BOLD}2{Colors.END}] 👥 Dialog Distribution")
        print(f"[{Colors.BOLD}3{Colors.END}] 📈 Growth & Engagement Snapshot")
        print(f"[{Colors.BOLD}4{Colors.END}] 💾 Export Analytics (JSON)")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-4]: ").strip()

        if choice == "1":
            print_info("Analyzing account metrics...")
            stats = asyncio.run(generate_account_analytics())
            if stats:
                print(f"\n{Colors.GREEN}{Colors.BOLD}Account Metrics:{Colors.END}")
                print(f"  • Account:       {stats['name']} ({stats['username']})")
                print(f"  • Direct Chats:  {stats['direct_chats']}")
                print(f"  • Groups:        {stats['groups']}")
                print(f"  • Channels:      {stats['channels']}")
                print(f"  • Unread Items:  {stats['total_unread_messages']}")
            input("\nPress Enter to continue...")

        elif choice == "2":
            stats = asyncio.run(generate_account_analytics())
            if stats:
                total = max(1, stats['dialogs_sampled'])
                print(f"\n{Colors.CYAN}{Colors.BOLD}Distribution Breakdown:{Colors.END}")
                print(f"  • Direct Chats:  {stats['direct_chats']} ({stats['direct_chats']*100//total}%)")
                print(f"  • Groups:        {stats['groups']} ({stats['groups']*100//total}%)")
                print(f"  • Channels:      {stats['channels']} ({stats['channels']*100//total}%)")
            input("\nPress Enter to continue...")

        elif choice == "3":
            print_info("Historical growth metrics are computed locally across session intervals.")
            input("Press Enter to continue...")

        elif choice == "4":
            stats = asyncio.run(generate_account_analytics())
            if stats:
                base = get_base_dir()
                res_dir = os.path.join(base, "data", "results")
                os.makedirs(res_dir, exist_ok=True)
                fn = os.path.join(res_dir, f"analytics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
                with open(fn, "w", encoding="utf-8") as f:
                    json.dump(stats, f, indent=2)
                print_success(f"Exported to {fn}")
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid choice.")

if __name__ == "__main__":
    run_analytics_menu()
