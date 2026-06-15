import type { APIRoute } from 'astro';
import { getMatchData } from '../lib/data';
import { SITE_URL, SITE_NAME } from '../lib/config';

export const GET: APIRoute = async () => {
  const data = await getMatchData();
  const now = new Date().toUTCString();

  const items = data.matches.map((m) => {
    const title = `${m.team1} vs ${m.team2} en Vivo${m.leagueSlug === 'copa-mundo-2026' ? ' — Mundial 2026 · Pirlo TV' : ` — ${m.league} · Pirlo TV`}`;
    const link = `${SITE_URL}/partido/${m.slug}/`;
    const pubDate = new Date(m.isoDateUtc).toUTCString();
    const desc = `Ver ${m.team1} vs ${m.team2} en vivo hoy en Pirlo TV. ${m.league} en directo gratis. ${m.channels.length} canales disponibles.`;
    return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Partidos en Vivo</title>
    <link>${SITE_URL}/</link>
    <description>Ver deportes en vivo gratis. Mundial 2026, Fútbol, MLB, NBA, NHL, UFC en directo.</description>
    <language>es</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
