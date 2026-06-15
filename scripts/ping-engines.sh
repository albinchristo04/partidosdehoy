#!/bin/bash
echo "Pinging search engines..."
curl -s "https://www.google.com/ping?sitemap=https://partidosdehoy.live/sitemap.xml" -o /dev/null && echo "Google: OK"
curl -s "https://www.bing.com/ping?sitemap=https://partidosdehoy.live/sitemap.xml" -o /dev/null && echo "Bing: OK"
echo "Done."
