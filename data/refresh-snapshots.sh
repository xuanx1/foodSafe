#!/usr/bin/env bash
# Refreshes the local API snapshots used by the inspection map viz.
# Run from the repo root: bash data/refresh-snapshots.sh [year]
# Defaults to the current year.

set -euo pipefail

YEAR="${1:-$(date +%Y)}"
OUT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Refreshing snapshots into $OUT_DIR for year $YEAR..."

curl -sS "https://data.kingcounty.gov/resource/f29f-zza5.json?\$limit=50000&\$where=date_extract_y(inspection_date)=${YEAR}" \
  -o "$OUT_DIR/seattle-supplemental.json"

curl -sS "https://data.cityofnewyork.us/resource/43nn-pn8j.json?\$limit=50000&\$where=date_extract_y(inspection_date)=${YEAR}" \
  -o "$OUT_DIR/nyc-supplemental.json"

# Chicago's v3 endpoint returns 403; use the classic Socrata endpoint.
curl -sS "https://data.cityofchicago.org/resource/4ijn-s7e5.json?\$limit=50000&\$where=date_extract_y(inspection_date)=${YEAR}" \
  -o "$OUT_DIR/chicago-supplemental.json"

curl -sS "https://data.sfgov.org/resource/tvy3-wexg.json?\$limit=50000&\$where=date_extract_y(inspection_date)=${YEAR}" \
  -o "$OUT_DIR/sfo-supplemental.json"

echo "Done. File sizes:"
ls -la "$OUT_DIR"/*.json
