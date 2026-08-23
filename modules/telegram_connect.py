#!/usr/bin/env python3
"""
TG-TOOLKIT: Telegram MTProto Connection Module
Connects securely via Telethon using local session file in data/telegram.session
"""

import os
import sys
import asyncio
from typing import Optional, Tuple, Any

try:
    from telethon import TelegramClient, errors
    from telethon.tl.types import User
    TELETHON_AVAILABLE = True
except ImportError:
    TELETHON_AVAILABLE = False

from .utils import (
    get_base_dir,
    load_config,
    save_config,
    print_success,
    print_error,
    print_warning,
    print_info,
    mask_string,
    mask_phone_number,
    setup_logger,
    Colors
)

logger = setup_logger("telegram_connect")

def get_session_path() -> str:
    base = get_base_dir()
    data_dir = os.path.join(base, "data")
    os.makedirs(data_dir, exist_ok=True)
    return os.path.join(data_dir, "telegram.session")

def get_client() -> Optional[Any]:
    """Creates a Telethon TelegramClient instance using local config and session."""
    if not TELETHON_AVAILABLE:
        print_error("Telethon is not installed. Install via: pip install telethon")
        return None

    config = load_config()
    api_id = config.get("api_id")
    api_hash = config.get("api_hash")
    
    if not api_id or not api_hash:
        print_error("API credentials missing. Please run: ./tg-tool config")
        return None

    try:
        api_id_int = int(api_id)
    except ValueError:
        print_error("Invalid API ID: must be an integer.")
        return None

    session_path = get_session_path().replace(".session", "")
    client = TelegramClient(session_path, api_id_int, api_hash)
    return client

async def run_connect_flow() -> bool:
    """Interactively connects and authenticates to Telegram MTProto."""
    if not TELETHON_AVAILABLE:
        print_error("Telethon library is missing. Run: pkg install python && pip install telethon")
        return False

    config = load_config()
    api_id = config.get("api_id")
    api_hash = config.get("api_hash")
    phone = config.get("phone")

    if not api_id or not api_hash:
        print_warning("No API credentials configured.")
        print_info("Set them using: ./tg-tool config")
        return False

    session_path = get_session_path().replace(".session", "")
    
    print_info("Initializing Telethon MTProto Client...")
    client = TelegramClient(session_path, int(api_id), api_hash)
    
    try:
        await client.connect()
        
        if not await client.is_user_authorized():
            print_info(f"Authorization required for account...")
            if not phone:
                phone = input("Enter your Telegram phone number (e.g. +1234567890): ").strip()
                config["phone"] = phone
                save_config(config)

            try:
                await client.send_code_request(phone)
            except errors.FloodWaitError as e:
                print_error(f"Rate limit: Telegram requires waiting {e.seconds} seconds before retrying.")
                await client.disconnect()
                return False
            except errors.PhoneNumberInvalidError:
                print_error("Invalid phone number provided.")
                await client.disconnect()
                return False
            except Exception as e:
                print_error(f"Failed to send verification code: {e}")
                await client.disconnect()
                return False

            code = input("Enter the login code sent by Telegram: ").strip()
            
            try:
                await client.sign_in(phone=phone, code=code)
            except errors.SessionPasswordNeededError:
                import getpass
                pwd = getpass.getpass("Two-Factor Authentication (2FA) password: ")
                await client.sign_in(password=pwd)
            except errors.PhoneCodeInvalidError:
                print_error("The login code you entered is invalid.")
                await client.disconnect()
                return False
            except errors.PhoneCodeExpiredError:
                print_error("The login code has expired. Please run connect again.")
                await client.disconnect()
                return False
            except Exception as e:
                print_error(f"Sign-in error: {e}")
                await client.disconnect()
                return False

        me = await client.get_me()
        print("\n" + f"{Colors.GREEN}{Colors.BOLD}============================================={Colors.END}")
        print_success("Telegram authentication successful!")
        print(f"  {Colors.BOLD}Name:{Colors.END}     {me.first_name} {me.last_name or ''}".strip())
        print(f"  {Colors.BOLD}Username:{Colors.END} @{me.username or 'No username'}")
        print(f"  {Colors.BOLD}User ID:{Colors.END}  {me.id}")
        print(f"  {Colors.BOLD}Phone:{Colors.END}    {mask_phone_number(me.phone or phone)}")
        print(f"  {Colors.BOLD}Session:{Colors.END}  data/telegram.session [Local Only]")
        print(f"{Colors.GREEN}{Colors.BOLD}============================================={Colors.END}\n")
        
        await client.disconnect()
        return True

    except Exception as e:
        print_error(f"Telegram connection error: {e}")
        try:
            await client.disconnect()
        except Exception:
            pass
        return False

async def check_connection_status() -> Tuple[bool, Optional[str]]:
    """Checks whether the session is currently authenticated."""
    session_file = get_session_path()
    if not os.path.exists(session_file):
        return False, "No local session file found (data/telegram.session)."

    client = get_client()
    if not client:
        return False, "Client initialization failed (check config/config.json)."

    try:
        await client.connect()
        is_auth = await client.is_user_authorized()
        if is_auth:
            me = await client.get_me()
            info = f"Connected as {me.first_name} (@{me.username or 'NoUsername'}) [ID: {me.id}]"
            await client.disconnect()
            return True, info
        else:
            await client.disconnect()
            return False, "Session exists but is not authorized."
    except Exception as e:
        try:
            await client.disconnect()
        except Exception:
            pass
        return False, f"Connection error: {e}"

def disconnect_session() -> bool:
    """Removes the local telegram.session file securely."""
    session_file = get_session_path()
    if os.path.exists(session_file):
        try:
            os.remove(session_file)
            print_success("Telegram session removed successfully.")
            return True
        except Exception as e:
            print_error(f"Failed to remove session file: {e}")
            return False
    else:
        print_info("No active session file found.")
        return True

def main_connect():
    asyncio.run(run_connect_flow())

def main_status():
    async def _status():
        ok, msg = await check_connection_status()
        if ok:
            print_success(f"Status: {msg}")
        else:
            print_warning(f"Status: {msg}")
    asyncio.run(_status())

def main_disconnect():
    disconnect_session()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd in ("connect", "login"):
            main_connect()
        elif cmd in ("status", "connection-status"):
            main_status()
        elif cmd in ("disconnect", "logout", "remove-session"):
            main_disconnect()
        else:
            main_connect()
    else:
        main_connect()
