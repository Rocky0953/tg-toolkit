# TG-TOOLKIT Installation Guide

## Android (Termux) Installation

1. Install and open **Termux** on Android.
2. Update packages and install prerequisites:
   ```bash
   pkg update -y && pkg upgrade -y
   pkg install git python curl -y
   ```
3. Install Telethon MTProto library:
   ```bash
   python3 -m pip install telethon
   ```
4. Clone the repository:
   ```bash
   git clone https://github.com/Rocky0953/tg-toolkit.git
   cd tg-toolkit
   ```
5. Make the CLI launcher executable:
   ```bash
   chmod +x tg-tool
   ```
6. Run the System Doctor check:
   ```bash
   ./tg-tool doctor
   ```

## Linux / macOS Installation

1. Ensure Python 3.9+ and Git are installed.
2. Clone repository and install requirements:
   ```bash
   git clone https://github.com/Rocky0953/tg-toolkit.git
   cd tg-toolkit
   chmod +x tg-tool
   pip install telethon
   ```
3. Launch:
   ```bash
   ./tg-tool
   ```
