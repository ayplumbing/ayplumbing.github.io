#!/bin/sh
set -eu

# GitHub Pages needs an index.html inside each route directory so a direct
# visit to /route/ serves the site and its client-side navigation can start.
# Keep index.html at the repository root as the shared source. These folders
# are generated copies; the four legacy redirect folders are intentionally
# left alone.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$SCRIPT_DIR"

python3 <<'PY'
from html import escape
from pathlib import Path
import re

source_path = Path("index.html")
source = source_path.read_text(encoding="utf-8")

routes = {
    "basement-plumbing-services": (
        "Basement & Outdoor Plumbing Services - A & Y Plumbing",
        "Basement and outdoor plumbing services in Toronto, including sump pumps, backwater valves, laundry connections, and outdoor taps.",
    ),
    "basement-waterproofing": (
        "Basement Waterproofing - A & Y Plumbing",
        "Basement waterproofing, foundation repairs, window wells, and weeping tile services in Toronto and the GTA. Call A & Y Plumbing for an estimate.",
    ),
    "bathroom-plumbing-services": (
        "Bathroom Plumbing Services - A & Y Plumbing",
        "Bathroom plumbing repairs and installations in Toronto, including toilets, faucets, showers, and drain services.",
    ),
    "construction-and-renovations": (
        "Construction & Renovations - A & Y Plumbing",
        "Plumbing, construction, and renovation services for larger residential projects in Toronto and the GTA. Contact A & Y Plumbing for an estimate.",
    ),
    "contact-form": (
        "Contact Form - A & Y Plumbing",
        "Contact A & Y Plumbing for plumbing, drain, waterproofing, and water filtration services in Toronto and the GTA.",
    ),
    "drain-services": (
        "Drain Services - A & Y Plumbing",
        "Drain cleaning, inspection, maintenance, and repair services in Toronto and the GTA. Contact A & Y Plumbing for help.",
    ),
    "kitchen-plumbing-services": (
        "Kitchen Plumbing Services - A & Y Plumbing",
        "Kitchen plumbing repairs and installations, including faucets, dishwashers, garburators, and leak detection in Toronto and the GTA.",
    ),
    "privacy-policy": (
        "Privacy Policy - A & Y Plumbing",
        "Read the A & Y Plumbing privacy policy and learn how we handle information sent through our website.",
    ),
    "services": (
        "Plumbing Services - A & Y Plumbing",
        "Explore plumbing repairs, drain services, waterproofing, and water filtration from A & Y Plumbing in Toronto and the GTA. Call 416-835-7986.",
    ),
    "water-filters": (
        "Water Filters - A & Y Plumbing",
        "Water filtration and reverse osmosis systems for Toronto homes. A & Y Plumbing can help you choose, install, and maintain a system.",
    ),
}

title_pattern = re.compile(r"<title>.*?</title>", re.DOTALL)
description_pattern = re.compile(r'<meta name="description" content="[^"]*">')

if len(title_pattern.findall(source)) != 1:
    raise SystemExit("Expected exactly one <title> in root index.html")
if len(description_pattern.findall(source)) != 1:
    raise SystemExit('Expected exactly one description meta tag in root index.html')

for route, (title, description) in routes.items():
    target_path = Path(route) / "index.html"
    if not target_path.is_file():
        raise SystemExit(f"Missing route file: {target_path}")

    output = title_pattern.sub(f"<title>{escape(title)}</title>", source, count=1)
    output = description_pattern.sub(
        f'<meta name="description" content="{escape(description, quote=True)}">',
        output,
        count=1,
    )
    target_path.write_text(output, encoding="utf-8")
    print(f"Updated {target_path}")
PY
