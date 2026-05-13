# TeaTime Tracker

A command-line tool for tracking your tea and coffee brewing habits. Log each brew, rate your favorites, search through history, and analyze your consumption patterns — all from the terminal.

## Features

| Command | Description |
|---------|-------------|
| `log` / `add` | Record a new tea or coffee brew |
| `search` / `history` | Search and filter your brew history by date range, type, or rating |
| `rate` | Rate a previously recorded brew (1–5 stars) |
| `stats` | View average ratings and rating counts per brew type |
| `delete` | Remove a brew entry from your history |
| `export` | Export brew history to CSV format |

Additional commands:

- `summary` — View a daily summary of brews
- `verify` — Check data integrity and validate all stored ratings

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)

## Installation

```bash
npm install
```

## Quick Start

Log a new brew:

```bash
node index.js log tea
node index.js log coffee
```

Search your history:

```bash
node index.js search --type=tea --from=2024-01-01 --to=2024-12-31
```

Rate a brew:

```bash
node index.js rate <id> <1-5>
```

## Contributing

This project follows a **TDD workflow** — all changes must include failing tests that pass after implementation, validated through GitHub Actions CI.

The repository enforces **branch protection** on `main`: all contributions must be made via pull requests with passing CI checks. No direct pushes to `main` are allowed.

## License

MIT
