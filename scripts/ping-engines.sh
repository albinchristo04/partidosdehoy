#!/bin/bash
# NOTE: Google and Bing both retired the legacy /ping?sitemap= endpoints in 2023.
# Sitemap discovery now happens via robots.txt + Webmaster Tools, and instant
# notification happens via IndexNow (see scripts/indexnow-submit.js).
# We keep a lightweight sitemap reachability check here so CI surfaces a 404
# after deploy instead of silently shipping a broken sitemap.
SITEMAP="https://partidosdehoy.live/sitemap.xml"
echo "Verifying sitemap is reachable: $SITEMAP"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP" || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "Sitemap OK (HTTP $STATUS)"
else
  echo "WARNING: sitemap returned HTTP $STATUS (deploy may still be propagating)"
fi
echo "Done."
