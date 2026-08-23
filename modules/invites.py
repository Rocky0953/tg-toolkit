#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 9 — Invite Manager Module
Manages authorized invite links for groups and channels where the
account holds administrative credentials.
"""

import os
import sys
import asyncio
from typing import Dict, Any, List, Optional

try:
    from telethon.tl.functions.messages import ExportChatInviteRequest
except ImportError:
    pass

from .utils import (
    get_base_dir,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    Colors
)
from .telegram_connect import get_client

async def create_chat_invite(chat_id: int) -> Optional[str]:
    client = get_client()
    if not client:
        return None

    try:
        await client.connect()
        if not await client.is_user_authorized():
            print_error("Session not authorized.")
            await client.disconnect()
            return None

        invite = await client(ExportChatInviteRequest(peer=chat_id))
        await client.disconnect()
        return invite.link if hasattr(invite, 'link') else str(invite)
    except Exception as e:
        print_error(f"Invite creation failed (requires admin permissions): {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return None

def run_invites_menu():
    while True:
        print_banner("Invite Manager")
        print(f"[{Colors.BOLD}1{Colors.END}] 🔗 Generate Primary Invite Link")
        print(f"[{Colors.BOLD}2{Colors.END}] 📋 Active Invite Guidelines")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-2]: ").strip()

        if choice == "1":
            cid = input("\nEnter Group/Channel ID (e.g. -1001234567890): ").strip()
            if cid:
                try:
                    num_id = int(cid)
                    print_info("Requesting export invite link from Telegram API...")
                    link = asyncio.run(create_chat_invite(num_id))
                    if link:
                        print_success(f"Generated Link: {link}")
                except ValueError:
                    print_error("Chat ID must be a numeric integer.")
            input("\nPress Enter to continue...")

        elif choice == "2":
            print(f"\n{Colors.CYAN}{Colors.BOLD}Telegram Invite Policies:{Colors.END}")
            print("  • Invite link generation requires Change Chat Info or Invite Users rights.")
            print("  • Unsolicited automated group additions are strictly restricted by Telegram.")
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid option.")

if __name__ == "__main__":
    run_invites_menu()
