import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/config';

export const GET: APIRoute = () => {
  // Bing reads robots.txt more literally than Google: it honors per-agent
  // blocks, Crawl-delay, and a host-level Sitemap line. We declare Bingbot and
  // its mobile variant explicitly so Bing applies a gentle crawl rate instead of
  // a conservative default, and repeat the Sitemap line under each agent so it
  // is discovered regardless of how Bing groups the records.
  const content = [
    'User-agent: Bingbot',
    'Allow: /',
    'Crawl-delay: 1',
    '',
    'User-agent: bingbot',
    'Allow: /',
    'Crawl-delay: 1',
    '',
    'User-agent: msnbot',
    'Allow: /',
    '',
    'User-agent: AdIdxBot',
    'Allow: /',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL.replace(/^https?:\/\//, '')}`,
    '',
  ].join('\n');
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
