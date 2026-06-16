#!/usr/bin/env node
// Reads current sitemap, diffs against sitemap-prev.xml, submits new URLs to IndexNow
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const SITE_URL = 'https://partidosdehoy.live';
const HOST = 'partidosdehoy.live';
const KEY = process.env.INDEXNOW_KEY;
// The verification file deployed in public/ is named after the key itself.
// IndexNow fetches keyLocation and checks its body equals `key`, so this MUST
// match the actual deployed file (af10f527eea64be0a1e94ebe3f097478.txt), not
// the generic indexnow-key.txt — otherwise Bing rejects every submission.
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;

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
  // IndexNow caps a single submission at 10,000 URLs; chunk to be safe.
  const chunks = [];
  for (let i = 0; i < newUrls.length; i += 10000) {
    chunks.push(newUrls.slice(i, i + 10000));
  }

  // Submit to both the shared IndexNow endpoint and Bing directly. Bing co-runs
  // IndexNow and also accepts direct submission, which tends to be picked up
  // faster than the shared aggregator.
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const urlList of chunks) {
    console.log(`Submitting ${urlList.length} new URL(s) to IndexNow...`);
    const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
        });
        console.log(`  ${endpoint} → ${res.status}`);
      } catch (err) {
        console.log(`  ${endpoint} → error: ${err.message}`);
      }
    }
  }
}

// Save current as prev for next run
writeFileSync(prevPath, current);
console.log('sitemap-prev.xml updated.');
