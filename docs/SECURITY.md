# Security & Privacy Model

TG-TOOLKIT is built with strict privacy guarantees and zero-tolerance for data leaks.

## Core Security Commitments

1. **Zero Secret Exposure**: API Hash, OTP codes, 2FA passwords, and MTProto session tokens are **never** logged to stdout, files, Git commits, or crash traces.
2. **Local Session Isolation**: The Telegram session file (`data/telegram.session`) is stored strictly on your local device with permissions restricted to the current user.
3. **No Private Phone Harvesting**: TG-TOOLKIT strictly respects user privacy. Username lookup cannot and will not attempt to discover hidden or private phone numbers.
4. **Masked Number Display**: Where a phone number is legitimately present in an authorized contact list, it is strictly masked according to the format:
   ```
   +CountryCode******Last6Digits  (e.g., +91******123456)
   ```
5. **No Mass Spam or Scraping**: TG-TOOLKIT strictly forbids and rejects mass unsolicited invitations, spam broadcasting, or bypassing Telegram access controls.
6. **Rate Limit Concurrency Protection**: Automatic backoff and delay pauses respect Telegram API rate limits (`FloodWaitError`).

## Running the Security Auditor

Audit your system at any time:

```bash
./tg-tool security
```
