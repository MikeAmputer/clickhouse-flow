#!/bin/sh
set -e

host="${CLICKHOUSE_HOST:-clickhouse}"
port="${CLICKHOUSE_PORT:-8123}"
user="${CLICKHOUSE_USER:-default}"
password="${CLICKHOUSE_PASSWORD}"
database="${CLICKHOUSE_DB:-default}"
dir="${MIGRATIONS_DIR:-/migrations}"

for file in $(find "$dir" -type f -name '*.sql' | sort); do
  echo "Running $file..."
  awk 'BEGIN{RS=";"} {gsub(/\n+/, " "); gsub(/^ +| +$/, "", $0); if(length($0) > 0) print $0 ";"}' "$file" |
  while IFS= read -r stmt; do
    echo "Executing: $stmt"
    curl -sS -u "$user:$password" \
      --data-binary "$stmt" \
      "http://$host:$port/?database=$database" || exit 1
  done
done

echo "Migrations complete."