# Configuration Guide

TG-TOOLKIT uses a local `config/config.json` file to securely store your Telegram MTProto API ID, API Hash, and associated phone number.

## Obtaining Telegram API Credentials

1. Visit [my.telegram.org/apps](https://my.telegram.org/apps) in your browser.
2. Sign in using your Telegram account.
3. Click on **API development tools**.
4. Create a new application (e.g. App title: `TG-Toolkit CLI`, Short name: `tgtoolkit`).
5. Copy your **api_id** (numeric integer) and **api_hash** (32-character string).

## Setting Up Credentials

You can configure credentials interactively from the command line:

```bash
./tg-tool config
```

Or provide them in `config/config.json`:

```json
{
  "api_id": "12345678",
  "api_hash": "0123456789abcdef0123456789abcdef",
  "phone": "+1234567890",
  "session_name": "telegram",
  "data_dir": "data",
  "log_dir": "logs",
  "rate_limit_delay_seconds": 1.5,
  "safe_mode": true
}
```

## Security & Permissions

`config/config.json` is automatically secured with `chmod 600` permissions so that other applications and non-root users cannot read the file. It is permanently excluded from Git by `.gitignore`.
