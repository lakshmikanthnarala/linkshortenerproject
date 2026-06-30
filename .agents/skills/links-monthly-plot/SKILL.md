---
name: links-monthly-plot
description: |
  Create a PNG bar chart showing how many links were created per month
  for the past 12 months. Trigger this skill when the user asks to
  "plot link creation by month", "links per month", or any request to
  visualize link creation counts over the last year. The skill reads
  `DATABASE_URL` from the repository `.env`, queries the `links` table,
  and outputs a PNG image `outputs/links_last_12_months.png`.
compatibility:
  - python
  - psycopg2-binary or sqlalchemy + pandas
  - matplotlib

## What this skill does

- Loads `DATABASE_URL` from the repository `.env` (root of workspace).
- Queries the `links` table for links created in the last 12 months.
- Aggregates counts per month (including months with zero counts).
- Renders a bar chart and saves it as `outputs/links_last_12_months.png`.

## Files added

- `scripts/generate_monthly_links_plot.py` - main script
- `requirements.txt` - Python dependencies

## Usage

1. Create a Python environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r .agents/skills/links-monthly-plot/requirements.txt
```

2. Ensure a `.env` file exists at the repository root with `DATABASE_URL` set.

3. Run the script from the skill folder:

```bash
python .agents/skills/links-monthly-plot/scripts/generate_monthly_links_plot.py
```

The PNG will be written to `.agents/skills/links-monthly-plot/outputs/links_last_12_months.png`.

## Test prompts

- "Create a bar chart PNG of links created per month for the last 12 months."
- "Plot monthly link creation counts for the past year and save as PNG."

## Notes

- The script expects a `created_at` column in the `links` table with a
  timestamp/datetime type. If your column is named differently, update
  the query in `generate_monthly_links_plot.py`.
