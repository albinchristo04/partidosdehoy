import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/config';

export const GET: APIRoute = () => {
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain' } });
};
