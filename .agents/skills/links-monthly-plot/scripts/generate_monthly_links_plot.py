#!/usr/bin/env python3
import os
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv
import pandas as pd
import matplotlib.pyplot as plt
from sqlalchemy import create_engine, text


def load_database_url():
    repo_root = Path(__file__).resolve().parents[3]
    env_path = repo_root / '.env'
    if not env_path.exists():
        raise FileNotFoundError(f".env not found at {env_path}")
    load_dotenv(env_path)
    db_url = os.getenv('DATABASE_URL') or os.getenv('DATABASE_URI')
    if not db_url:
        raise EnvironmentError('DATABASE_URL not set in .env')
    return db_url


def query_links(db_url):
    engine = create_engine(db_url)
    # Determine start and end dates (past 12 months, inclusive)
    today = datetime.utcnow().date()
    start_date = (today.replace(day=1) - timedelta(days=365)).replace(day=1)
    # Use SQL to aggregate counts per month
    query = text(
        """
        SELECT
          date_trunc('month', created_at) AS month,
          COUNT(*) AS cnt
        FROM links
        WHERE created_at >= :start_date
        GROUP BY 1
        ORDER BY 1
        """
    )
    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params={'start_date': start_date})
    return df


def build_monthly_series(df):
    today = datetime.utcnow().date()
    months = []
    counts = []
    # Generate last 12 months list (month start dates)
    for i in range(11, -1, -1):
        m = (today.replace(day=1) - pd.DateOffset(months=i)).date()
        months.append(m)
    month_index = pd.to_datetime(df['month']).dt.date if not df.empty else pd.Series(dtype='datetime64[ns]')
    cnts = {row['month'].date(): int(row['cnt']) for _, row in df.iterrows()} if not df.empty else {}
    for m in months:
        counts.append(cnts.get(m, 0))
    labels = [m.strftime('%Y-%m') for m in months]
    return labels, counts


def plot_and_save(labels, counts, out_path):
    plt.style.use('seaborn-darkgrid')
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.bar(labels, counts, color='#2b8cbe')
    ax.set_xlabel('Month')
    ax.set_ylabel('Links created')
    ax.set_title('Links created per month — last 12 months')
    plt.xticks(rotation=45)
    plt.tight_layout()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out_path, dpi=150)
    print(f"Saved chart to {out_path}")


def main():
    db_url = load_database_url()
    df = query_links(db_url)
    labels, counts = build_monthly_series(df)
    out_path = Path(__file__).resolve().parents[1] / 'outputs' / 'links_last_12_months.png'
    plot_and_save(labels, counts, out_path)


if __name__ == '__main__':
    main()
