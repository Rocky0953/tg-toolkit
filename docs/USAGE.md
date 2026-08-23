# TG-TOOLKIT Command & Module Usage Guide

## Interactive Main Menu

Launch the visual interactive menu in Termux or your shell:

```bash
./tg-tool
```

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

## CLI Commands Reference

| Command | Action |
|---|---|
| `./tg-tool config` | Configure API ID, masked API Hash, and Phone |
| `./tg-tool connect` | Interactive Telegram login with OTP / 2FA support |
| `./tg-tool status` | View active authorization status and account details |
| `./tg-tool disconnect` | Safely remove local `data/telegram.session` |
| `./tg-tool doctor` | Run full System Doctor diagnostic suite |
| `./tg-tool username @durov` | Look up public entity information for a username |
| `./tg-tool contacts` | Manage and search authorized contacts |
| `./tg-tool groups` | Inspect joined groups, channels, and admin rosters |
| `./tg-tool analytics` | Generate account and dialog metrics report |
| `./tg-tool invites` | Export or inspect administrative invite links |
| `./tg-tool csv` | Validate, deduplicate, and convert CSV data |
| `./tg-tool security` | Audit permissions, `.gitignore`, and credential protection |
| `./tg-tool update` | Check upstream GitHub repository for fast-forward updates |
| `./tg-tool version` | Show version string (`1.5.0-dev`) |
| `./tg-tool help` | Show CLI argument reference |
