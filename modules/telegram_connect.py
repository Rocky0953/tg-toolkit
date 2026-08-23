#!/usr/bin/env python3
"""Interactive, user-authorized Telegram connection helper for TG-TOOLKIT."""
import asyncio
import json
from pathlib import Path

from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "config.json"
SESSION = ROOT / "data" / "telegram"


def load_config():
    with CONFIG.open(encoding="utf-8") as f:
        data = json.load(f)
    api_id = str(data.get("api_id", "")).strip()
    api_hash = str(data.get("api_hash", "")).strip()
    phone = str(data.get("phone", "")).strip()
    if not api_id or not api_hash:
        raise ValueError("API ID and API Hash are not configured. Run: ./tg-tool config")
    if not api_id.isdigit():
        raise ValueError("API ID must be numeric.")
    if not phone:
        raise ValueError("Phone is not configured. Run: ./tg-tool config")
    return int(api_id), api_hash, phone


async def connect():
    api_id, api_hash, phone = load_config()
    SESSION.parent.mkdir(parents=True, exist_ok=True)
    client = TelegramClient(str(SESSION), api_id, api_hash)
    try:
        await client.start(phone=phone)
        me = await client.get_me()
        name = " ".join(x for x in [me.first_name, me.last_name] if x) or "Telegram user"
        username = f"@{me.username}" if me.username else "no username"
        print("\n[✓] Telegram authentication successful")
        print(f"[✓] Account: {name}")
        print(f"[✓] Username: {username}")
        print("[✓] Session saved locally")
    finally:
        await client.disconnect()


def status():
    session_file = Path(str(SESSION) + ".session")
    if session_file.exists():
        print("[✓] Local Telegram session exists")
        print(f"    Session: {session_file}")
    else:
        print("[!] No Telegram session found")


def remove_session():
    session_file = Path(str(SESSION) + ".session")
    if not session_file.exists():
        print("[!] No local session found")
        return
    answer = input("Remove the local Telegram session? [y/N]: ").strip().lower()
    if answer == "y":
        session_file.unlink()
        print("[✓] Local Telegram session removed")
    else:
        print("Cancelled.")


def main():
    import sys
    command = sys.argv[1] if len(sys.argv) > 1 else "menu"
    if command == "connect":
        asyncio.run(connect())
    elif command == "status":
        status()
    elif command == "remove":
        remove_session()
    else:
        print("Usage: python modules/telegram_connect.py [connect|status|remove]")


if __name__ == "__main__":
    main()
