#!/bin/bash
set -e
players=(
  "bonds01 111188 2001"
  "judge22 592450 2022"
  "cal24 663728 2024"
)
mkdir -p tmp
for info in "${players[@]}"; do
  set -- $info
  label=$1
  id=$2
  season=$3
  curl -s "https://statsapi.mlb.com/api/v1/people/$id/stats?stats=gameLog&season=$season&group=hitting" -o tmp/$label.json
  echo "Downloaded $label"
done
node scripts/parse_logs.js
echo "Data saved to js/hr_data.json"
node scripts/build_cal_stats.js
echo "Data saved to js/cal_stats.json"
rm -r tmp
