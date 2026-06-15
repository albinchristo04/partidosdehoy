import type { APIRoute } from 'astro';
import { getMatchData } from '../lib/data';
import { SITE_URL } from '../lib/config';

interface SitemapEntry {
  url: string;
  priority: string;
  changefreq: string;
}

export const GET: APIRoute = async () => {
  const data = await getMatchData();

  const staticPages: SitemapEntry[] = [
    { url: `${SITE_URL}/`, priority: '1.0', changefreq: 'hourly' },
    { url: `${SITE_URL}/pirlo-tv/`, priority: '1.0', changefreq: 'daily' },
    { url: `${SITE_URL}/mundial-2026/`, priority: '1.0', changefreq: 'hourly' },
    { url: `${SITE_URL}/copa-mundo-2026/`, priority: '1.0', changefreq: 'hourly' },
    { url: `${SITE_URL}/tarjeta-roja/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/roja-directa-pirlo-tv/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/tarjeta-roja-pirlo-tv/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/ufc/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/nhl/`, priority: '0.9', changefreq: 'daily' },
    { url: `${SITE_URL}/futbol/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/mlb/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/beisbol/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/nba/`, priority: '0.8', changefreq: 'daily' },
    { url: `${SITE_URL}/motogp/`, priority: '0.7', changefreq: 'daily' },
  ];

  // League hubs
  for (const leagueSlug of Object.keys(data.byLeague)) {
    staticPages.push({ url: `${SITE_URL}/${leagueSlug}/`, priority: '0.8', changefreq: 'daily' });
  }

  // National team pages
  const wcMatches = (data.bySport['futbol'] ?? []).filter((m) => m.leagueSlug === 'copa-mundo-2026');
  const wcTeams = new Set<string>();
  for (const m of wcMatches) {
    if (m.team1) wcTeams.add(m.team1);
    if (m.team2) wcTeams.add(m.team2);
  }
  for (const team of wcTeams) {
    const slug = team.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    staticPages.push({ url: `${SITE_URL}/seleccion/${slug}/`, priority: '0.7', changefreq: 'daily' });
  }

  // Match pages
  const matchEntries: SitemapEntry[] = data.matches.flatMap((m) => [
    { url: `${SITE_URL}/partido/${m.slug}/`, priority: '0.6', changefreq: 'hourly' },
    { url: `${SITE_URL}/ver/${m.slug}/`, priority: '0.4', changefreq: 'hourly' },
    { url: `${SITE_URL}/en-vivo/${m.slug}/`, priority: '0.4', changefreq: 'hourly' },
  ]);

  const allEntries = [...staticPages, ...matchEntries];
  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map((e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
