# TG-TOOLKIT

**TG-TOOLKIT** is a modular, privacy-first Telegram Management CLI engineered specifically for **Android Termux** and Linux environments.

[![Version](https://img.shields.io/badge/version-1.5.0--dev-blue.svg)](https://github.com/Rocky0953/tg-toolkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.9%2B-brightgreen.svg)](https://www.python.org/)
[![Telethon](https://img.shields.io/badge/telethon-1.44.0-blue.svg)](https://github.com/LonamiWebs/Telethon)

---

## ⚡ Quick Start (Termux)

```bash
# 1. Update Termux and install dependencies
pkg update -y && pkg install git python curl -y
python3 -m pip install telethon

# 2. Clone repository
git clone https://github.com/Rocky0953/tg-toolkit.git
cd tg-toolkit
chmod +x tg-tool

# 3. Setup credentials & connect
./tg-tool config
./tg-tool connect

# 4. Launch interactive CLI
./tg-tool
```

---

## 🧭 Main Menu

```
╔══════════════════════════════════════════════╗
║              TG-TOOLKIT v1.5.0-dev           ║
║           Telegram Management CLI            ║
╚══════════════════════════════════════════════╝

[1] 👤 Username Tools
[2] 📱 Contact & Privacy
[3] 👥 Group Manager
[4] 📊 Analytics
[5] 🔗 Invite Manager
[6] 📁 CSV Tools
[7] 🛡️ Security Center
[8] ⚙️ Settings
[9] 🩺 System Doctor
[U] 🔄 Check Updates
[0] 🚪 Exit
```

---

## 🛠️ CLI Commands Reference

| Command | Action |
|---|---|
| `./tg-tool config` | Configure API ID, masked API Hash, and Phone |
| `./tg-tool connect` | Authenticate MTProto session with OTP / 2FA support |
| `./tg-tool connection-status` | View active authorization status (alias: `status`) |
| `./tg-tool disconnect` | Safely remove local `data/telegram.session` |
| `./tg-tool doctor` | Run full System Doctor diagnostic suite |
| `./tg-tool username [@user]` | Inspect public profile / entity information |
| `./tg-tool contacts` | Manage and search authorized contacts |
| `./tg-tool groups` | Inspect joined groups, channels, and admin rosters |
| `./tg-tool analytics` | Generate account and dialog metrics report |
| `./tg-tool invites` | Export or inspect administrative invite links |
| `./tg-tool csv` | Validate, deduplicate, and convert CSV data |
| `./tg-tool security` | Audit permissions (`chmod 600`) and `.gitignore` safety |
| `./tg-tool update` | Check upstream GitHub repository for fast-forward updates |
| `./tg-tool version` | Show version string (`1.5.0-dev`) |
| `./tg-tool help` | Show CLI command reference |

---

## 🛡️ Security & Privacy Model

- **Masked Phone Numbers**: Where phone numbers are legitimately available in authorized contacts, they are strictly masked as `+CountryCode******Last6Digits` (e.g. `+91******123456`).
- **Zero Discovery Exploits**: TG-TOOLKIT strictly adheres to Telegram API privacy rules and does **not** attempt hidden phone discovery.
- **Local Credentials**: API Hash and session files (`data/telegram.session`) are stored locally with `chmod 600` permissions and never tracked by Git.
- **Zero Spam**: No bulk unsolicited messaging, force-invitations, or restriction-bypassing tools.

---

## 📂 Project Architecture

```
tg-toolkit/
├── tg-tool                  # Executable Bash launcher
├── config/
│   ├── config.example.json  # Configuration template
│   └── config.json          # Local credentials (ignored by Git, mode 600)
├── modules/
│   ├── telegram_connect.py  # Telethon MTProto client manager
│   ├── username_tools.py    # Phase 5: Username & profile inspector
│   ├── contacts.py          # Phase 6: Contact & privacy manager
│   ├── groups.py            # Phase 7: Group & channel manager
│   ├── analytics.py         # Phase 8: Metadata analytics engine
│   ├── invites.py           # Phase 9: Admin invite link manager
│   ├── csv_tools.py         # Phase 10: CSV utilities & converters
│   ├── security.py          # Phase 11: Security & permission auditor
│   ├── doctor.py            # Phase 12: System Doctor diagnostics
│   ├── settings.py          # Phase 13: Local config manager
│   ├── update.py            # Phase 14: GitHub updater
│   └── utils.py             # Common formatters, masking, & logging
├── data/
│   ├── input/               # Batch input files (e.g. usernames.csv)
│   └── results/             # CSV and JSON exported reports
├── logs/                    # Local audit logs
├── tests/                   # Automated unit test suite
└── docs/                    # Documentation guides
```

---

## 📜 Documentation

- [Installation Guide](docs/INSTALL.md)
- [Configuration Guide](docs/CONFIGURATION.md)
- [Security & Privacy](docs/SECURITY.md)
- [CLI Usage Guide](docs/USAGE.md)

---

## 📄 License

MIT License. Copyright (c) 2026 Rocky0953.
