import type { NormalizedMatch } from './types';
import { SITE_URL, SITE_NAME } from './config';
import { applyOffset, TZ_OFFSETS } from './timezones';

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
}

export function homeSeo(matchCount: number): SeoMeta {
  const desc = `Pirlo TV — Ver deportes en vivo gratis. Roja Directa · Tarjeta Roja TV. Mundial 2026, Futbol, MLB, NBA, UFC en directo hoy con ${matchCount} canales.`;
  return {
    title: 'Pirlo TV — Deportes en Vivo Gratis · Roja Directa · Tarjeta Roja | PirloTV',
    description: desc,
    canonical: `${SITE_URL}/`,
    ogTitle: 'Pirlo TV — Deportes en Vivo Gratis | PirloTV',
    ogDescription: desc,
  };
}

export function matchSeo(m: NormalizedMatch): SeoMeta {
  const isWC = m.leagueSlug === 'copa-mundo-2026';
  const isUFC = m.sport === 'ufc';
  const timeEs = applyOffset(m.timeUtc, TZ_OFFSETS.es.offset);
  const timeMx = applyOffset(m.timeUtc, TZ_OFFSETS.mx.offset);
  const n = m.channels.length;

  const titleSuffix = isWC ? 'Mundial 2026 · Dónde Ver Gratis' : isUFC ? 'UFC · Ver Pelea Gratis' : `${m.league} · Dónde Ver`;
  const title = `${m.team1} vs ${m.team2} En Vivo — ${titleSuffix} | ${SITE_NAME}`;
  const desc = isWC
    ? `Ver ${m.team1} contra ${m.team2} en vivo. Mundial 2026 · ${timeEs} España / ${timeMx} CDMX. ${n} canales. Gratis en Pirlo TV.`
    : isUFC
    ? `Ver ${m.team1} vs ${m.team2} en vivo. ${m.league} · ${m.timeUtc} UTC. ${n} canales disponibles en Pirlo TV gratis.`
    : `Ver ${m.team1} vs ${m.team2} en vivo hoy en Pirlo TV. ${m.league} a las ${m.timeUtc} UTC. ${n} canales disponibles. ¿Dónde mirar? Aquí gratis.`;

  const canonical = `${SITE_URL}/partido/${m.slug}/`;
  return { title, description: desc, canonical, ogTitle: title, ogDescription: desc };
}

export function hubSeo(sport: string, sportLabel: string, matchCount: number, path: string): SeoMeta {
  const title = `${sportLabel} En Vivo Hoy — Ver ${sportLabel} Gratis | ${SITE_NAME}`;
  const desc = `Ver ${sportLabel} en vivo en Pirlo TV. ${matchCount} partidos hoy en directo gratis. Múltiples canales en español, inglés y portugués.`;
  return {
    title,
    description: desc,
    canonical: `${SITE_URL}${path}`,
    ogTitle: title,
    ogDescription: desc,
  };
}

export function mundialSeo(matchCount: number): SeoMeta {
  const desc = `Ver el Mundial 2026 en vivo gratis en Pirlo TV. ${matchCount} partidos hoy. Canales en español, inglés, portugués, alemán y francés.`;
  return {
    title: 'Mundial 2026 En Vivo Gratis — Copa del Mundo Hoy | Pirlo TV',
    description: desc,
    canonical: `${SITE_URL}/mundial-2026/`,
    ogTitle: 'Mundial 2026 En Vivo Gratis — Copa del Mundo Hoy | Pirlo TV',
    ogDescription: desc,
  };
}

export function leagueSeo(leagueName: string, leagueSlug: string, matchCount: number): SeoMeta {
  const title = `${leagueName} En Vivo — Partidos Hoy Gratis | ${SITE_NAME}`;
  const desc = `Ver ${leagueName} en vivo en Pirlo TV. ${matchCount} partidos hoy en directo gratis. Múltiples canales disponibles.`;
  return {
    title,
    description: desc,
    canonical: `${SITE_URL}/${leagueSlug}/`,
    ogTitle: title,
    ogDescription: desc,
  };
}

export function seleccionSeo(team: string, teamSlug: string, matchCount: number): SeoMeta {
  const title = `${team} En Vivo — Mundial 2026 · Ver ${team} Gratis | ${SITE_NAME}`;
  const desc = `Ver ${team} en vivo gratis en Pirlo TV. Todos los partidos de ${team} en el Mundial 2026. ${matchCount} partido(s) disponible(s).`;
  return {
    title,
    description: desc,
    canonical: `${SITE_URL}/seleccion/${teamSlug}/`,
    ogTitle: title,
    ogDescription: desc,
  };
}

export function brandSeo(pageName: string, path: string): SeoMeta {
  const titles: Record<string, string> = {
    'pirlo-tv': 'Pirlo TV En Vivo — Futbol y Deportes en Directo Gratis | PirloTV',
    'tarjeta-roja': 'Tarjeta Roja TV En Vivo — Ver Partidos Gratis | Pirlo TV',
    'roja-directa-pirlo-tv': 'Roja Directa Pirlo TV En Vivo — Partidos Gratis | PirloTV',
    'tarjeta-roja-pirlo-tv': 'Tarjeta Roja Pirlo TV En Vivo — Ver Deportes Gratis | PirloTV',
  };
  const descs: Record<string, string> = {
    'pirlo-tv': 'Pirlo TV — Ver deportes en vivo gratis. Futbol, MLB, NBA, NHL, UFC. Roja Directa · Tarjeta Roja TV. Múltiples canales sin registro.',
    'tarjeta-roja': 'Tarjeta Roja TV en vivo. Ver partidos de futbol, MLB, UFC y más en directo gratis. Pirlo TV — Roja Directa.',
    'roja-directa-pirlo-tv': 'Roja Directa Pirlo TV — ver partidos en vivo gratis. Futbol, MLB, NBA, NHL, UFC en directo. Sin registro.',
    'tarjeta-roja-pirlo-tv': 'Tarjeta Roja Pirlo TV — ver deportes en vivo gratis. Múltiples canales en español e inglés.',
  };
  const title = titles[pageName] ?? `${pageName} | ${SITE_NAME}`;
  const desc = descs[pageName] ?? '';
  return { title, description: desc, canonical: `${SITE_URL}${path}`, ogTitle: title, ogDescription: desc };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'es',
    alternateName: ['PirloTV', 'Pirlo TV En Vivo', 'Roja Directa', 'Tarjeta Roja TV', 'RojaDirecta', 'Roja Dirécta', 'Pirlo TV Mundial 2026'],
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  // Richer entity description strengthens the E-E-A-T / knowledge-entity signals
  // Bing leans on for ranking. @id ties it to the WebSite node above.
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    image: `${SITE_URL}/favicon.svg`,
    description: 'Pirlo TV — ver deportes en vivo gratis: Mundial 2026, fútbol, MLB, NBA, NHL y UFC en directo. Roja Directa y Tarjeta Roja TV.',
    alternateName: ['PirloTV', 'Roja Directa', 'Tarjeta Roja TV', 'RojaDirecta'],
    knowsLanguage: ['es', 'en', 'pt'],
    areaServed: ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'US'],
  };
}

export function sportsEventSchema(m: NormalizedMatch) {
  const isUFC = m.sport === 'ufc';
  if (isUFC) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: m.rawTitle,
      startDate: m.isoDateUtc,
      location: { '@type': 'VirtualLocation', url: `${SITE_URL}/partido/${m.slug}/` },
      description: `Ver ${m.team1} vs ${m.team2} en vivo gratis en Pirlo TV.`,
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${m.team1} vs ${m.team2}`,
    startDate: m.isoDateUtc,
    location: { '@type': 'VirtualLocation', url: `${SITE_URL}/partido/${m.slug}/` },
    organizer: { '@type': 'SportsOrganization', name: m.league },
    competitor: [
      { '@type': 'SportsTeam', name: m.team1 },
      { '@type': 'SportsTeam', name: m.team2 },
    ],
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListSchema(name: string, urls: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: urls.length,
    itemListElement: urls.map((url, i) => ({ '@type': 'ListItem', position: i + 1, url })),
  };
}
