# TeaTime Tracker — User Guide & CLI Command Reference

A comprehensive reference for the TeaTime Tracker command-line interface. Use this guide to learn how to log, search, rate, analyze, and export your tea and coffee brewing history.

## Table of Contents

- [Recording Brews (`log` / `add`)](#recording-brews-log--add)
- [Searching & Filtering History (`search` / `history`)](#searching--filtering-history-search--history)
- [Rating a Brew (`rate`)](#rating-a-brew-rate)
- [Viewing Rating Statistics (`stats`)](#viewing-rating-statistics-stats)
- [Deleting a Brew (`delete`)](#deleting-a-brew-delete)
- [Exporting to CSV (`export`)](#exporting-to-csv-export)
- [Common Flags Reference](#common-flags-reference)
- [Date Format](#date-format)
- [Rating Scale](#rating-scale)
- [CSV Export Format](#csv-export-format)

---

## Recording Brews (`log` / `add`)

Record a new tea or coffee brew to your history.

```
node index.js log <type> [rating]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `<type>` | Yes | `tea` or `coffee` |
| `[rating]` | No | Optional rating (1–5 stars). If omitted, the brew is recorded without a rating. |

**Expected Output:**

```
Recorded tea at 2025-06-15T10:30:00.000Z
Recorded coffee at 2025-06-15T10:30:00.000Z with rating 4
```

**Usage Examples:**

```bash
# Record a tea without a rating
node index.js log tea

# Record a coffee with a 4-star rating
node index.js log coffee 4

# Record a tea with a 5-star rating
node index.js add tea 5
```

---

## Searching & Filtering History (`search` / `history`)

Search and filter your brew history by date range, brew type, label text, or rating. The `search` and `history` commands are aliases and behave identically.

```
node index.js search [flags]
node index.js history [flags]
```

**Flags:**

| Flag | Description |
|------|-------------|
| `--from=<date>` / `--start-date=<date>` | Filter brews recorded on or after this date |
| `--to=<date>` / `--end-date=<date>` | Filter brews recorded on or before this date |
| `--type=<tea\|coffee>` | Filter by brew type |
| `--query=<text>` | Search brew labels (case-insensitive substring match) |
| `--rating=<1-5>` | Filter by exact rating value |
| `--min-rating=<1-5>` | Filter brews with rating at or above this value |
| `--sort=<date\|rating\|type>` | Sort results. `date` = newest first, `rating` = lowest first, `type` = alphabetical. Default: `date` (descending). |
| `--format=<csv\|text>` | Output format. `csv` exports machine-readable CSV. Default: `text`. |

**Expected Output (text format):**

```
Results:
[2025-06-15T10:30:00.000Z] tea (Rating: 5): Earl Grey
[2025-06-14T08:15:00.000Z] coffee (Rating: 4): Espresso
```

**Expected Output (no matches):**

```
No brews found matching criteria.
```

**Usage Examples:**

```bash
# Search all brews
node index.js search

# Filter by date range
node index.js search --from=2025-01-01 --to=2025-12-31

# Filter by type
node index.js history --type=tea

# Filter by minimum rating
node index.js search --min-rating=4

# Combine filters
node index.js search --type=coffee --from=2025-06-01 --min-rating=3

# Sort by rating (ascending)
node index.js history --sort=rating

# Search label text
node index.js search --query=Earl
```

---

## Rating a Brew (`rate`)

Assign or update a rating on an existing brew entry identified by its timestamp ID.

```
node index.js rate <id> <stars>
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `<id>` | Yes | The brew's timestamp identifier (as shown in search results) |
| `<stars>` | Yes | Rating from 1 to 5 (whole number) |

**Expected Output:**

```
Successfully rated brew 2025-06-15T10:30:00.000Z with 5 stars
```

**Error Output:**

```
Brew with ID 2025-06-15T10:30:00.000Z not found
```

**Usage Examples:**

```bash
# Rate a brew 5 stars
node index.js rate 2025-06-15T10:30:00.000Z 5

# Update an existing rating
node index.js rate 2025-06-15T10:30:00.000Z 3
```

---

## Viewing Rating Statistics (`stats`)

Display per-type average ratings and rating counts across your entire brew history.

```
node index.js stats
```

**Expected Output:**

```
tea: 4.50 (4 ratings)
coffee: 3.75 (8 ratings)
```

**No Ratings Output:**

```
No ratings recorded.
```

**Usage Examples:**

```bash
# View rating statistics
node index.js stats
```

---

## Deleting a Brew (`delete`)

Remove a brew entry from your history by its timestamp ID. Requires explicit confirmation.

```
node index.js delete <id> [--yes|-y]
```

**Arguments / Flags:**

| Argument / Flag | Required | Description |
|-----------------|----------|-------------|
| `<id>` | Yes | The brew's timestamp identifier |
| `--yes` or `-y` | Yes | Confirmation flag — required to prevent accidental deletion |

**Expected Output:**

```
Deleted brew 2025-06-15T10:30:00.000Z
```

**Error Output (missing confirmation):**

```
Confirmation required. Use --yes or -y to confirm deletion.
```

**Usage Examples:**

```bash
# Delete a brew with confirmation
node index.js delete 2025-06-15T10:30:00.000Z --yes

# Delete using short flag
node index.js delete 2025-06-15T10:30:00.000Z -y
```

---

## Exporting to CSV (`export`)

Export brew history to CSV format. The `export` command is a shorthand for `search --format=csv`. You can combine it with all search flags.

```
node index.js export [flags]
```

This command accepts the same flags as `search` / `history` (see [Common Flags Reference](#common-flags-reference)).

**Expected Output (CSV):**

```
timestamp,type,rating,label
2025-06-15T10:30:00.000Z,tea,5,"Earl Grey"
2025-06-14T08:15:00.000Z,coffee,4,"Espresso"
```

**Usage Examples:**

```bash
# Export all brews to CSV
node index.js export

# Export with filters
node index.js export --type=tea --from=2025-01-01 --to=2025-12-31

# Equivalent search command
node index.js search --format=csv --type=tea
```

---

## Common Flags Reference

These flags are available on the `search`, `history`, and `export` commands. Not all flags apply to every command — see each command's section for details.

| Flag | Alias | Values | Applies To |
|------|-------|--------|------------|
| `--from=<date>` | `--start-date=<date>` | ISO date (see [Date Format](#date-format)) | `search`, `history`, `export` |
| `--to=<date>` | `--end-date=<date>` | ISO date (see [Date Format](#date-format)) | `search`, `history`, `export` |
| `--type=<type>` | — | `tea` or `coffee` | `search`, `history`, `export` |
| `--rating=<n>` | — | 1–5 | `search`, `history`, `export` |
| `--min-rating=<n>` | — | 1–5 | `search`, `history`, `export` |
| `--query=<text>` | — | Any text | `search`, `history`, `export` |
| `--sort=<mode>` | — | `date`, `rating`, `type` | `search`, `history`, `export` |
| `--format=<fmt>` | — | `csv`, `text` | `search`, `history` |
| `--yes` | `-y` | (flag, no value) | `delete` |

---

## Date Format

All date values use the **YYYY-MM-DD** format (ISO 8601 date only, no time component). This is used with `--from` / `--start-date` and `--to` / `--end-date` flags.

**Examples of valid dates:**

- `2025-01-01`
- `2025-06-15`
- `2024-12-31`

**Note:** Brew timestamps (used as IDs for `rate` and `delete`) are full ISO 8601 strings including time, e.g., `2025-06-15T10:30:00.000Z`. The date-only format is for search/filter flags only.

---

## Rating Scale

Ratings use a **1–5 star** scale:

| Rating | Meaning |
|--------|---------|
| 1 ⭐ | Poor — would not brew again |
| 2 ⭐⭐ | Below average |
| 3 ⭐⭐⭐ | Average — decent brew |
| 4 ⭐⭐⭐⭐ | Good — enjoyable |
| 5 ⭐⭐⭐⭐⭐ | Excellent — top favorite |

Ratings must be **whole numbers** between 1 and 5 inclusive. Ratings are optional when logging a brew — you can add or update a rating later using the `rate` command.

---

## CSV Export Format

The CSV output format uses the following schema:

| Column | Type | Description |
|--------|------|-------------|
| `timestamp` | ISO 8601 string | Full date-time of the brew recording |
| `type` | `tea` or `coffee` | Brew type |
| `rating` | integer or empty | Rating 1–5, or blank if unrated |
| `label` | string (quoted) | Brew label, double-quoted with escaping |

**Header row:** `timestamp,type,rating,label`

**Example CSV output:**

```
timestamp,type,rating,label
2025-06-15T10:30:00.000Z,tea,5,"Earl Grey"
2025-06-14T08:15:00.000Z,coffee,4,"Espresso"
2025-06-14T09:00:00.000Z,tea,,"Green Tea"
```

Note: Label strings are enclosed in double quotes and internal double quotes are escaped with `""`.
