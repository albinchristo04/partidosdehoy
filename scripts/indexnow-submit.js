#!/usr/bin/env node
// Reads current sitemap, diffs against sitemap-prev.xml, submits new URLs to IndexNow
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const SITE_URL = 'https://partidosdehoy.live';
const KEY = process.env.INDEXNOW_KEY;

if (!KEY) {
  console.log('INDEXNOW_KEY not set — skipping IndexNow submission.');
  process.exit(0);
}

const sitemapPath = join(ROOT, 'dist', 'sitemap.xml');
const prevPath = join(ROOT, 'sitemap-prev.xml');

if (!existsSync(sitemapPath)) {
  console.log('No sitemap.xml found in dist/ — run npm run build first.');
  process.exit(0);
}

const current = readFileSync(sitemapPath, 'utf8');
const prev = existsSync(prevPath) ? readFileSync(prevPath, 'utf8') : '';

// Extract all URLs from current sitemap
const allUrls = [...current.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
// Extract prev URLs
const prevUrls = new Set([...prev.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));

// New URLs = in current but not in prev
const newUrls = allUrls.filter((u) => !prevUrls.has(u));

if (newUrls.length === 0) {
  console.log('No new URLs to submit.');
} else {
  console.log(`Submitting ${newUrls.length} new URL(s) to IndexNow...`);
  const body = {
    host: 'partidosdehoy.live',
    key: KEY,
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    urlList: newUrls,
  };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow response: ${res.status}`);
}

// Save current as prev for next run
writeFileSync(prevPath, current);
console.log('sitemap-prev.xml updated.');
