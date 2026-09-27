import type { RawApiResponse, RawMatch, RawServer, NormalizedMatch, MatchData, Channel, Sport } from './types';
import { generateSlug, matchSlug } from './slugs';
import { DATA_URL } from './config';

// Fix mojibake encoding from API (no-op when the string is already valid UTF-8)
function fixEncoding(str: string): string {
  if (!str) return str;
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

// World Cup 2026 national teams for sport/league inference
const WC_TEAMS = new Set([
  'Germany', 'Curaçao', 'Curazao', 'Netherlands', 'Japan', 'Sweden', 'Tunisia',
  'Ecuador', 'Morocco', 'Portugal', 'France', 'Spain', 'Brazil', 'Argentina',
  'Mexico', 'USA', 'Canada', 'England', 'Italy', 'Belgium', 'Croatia', 'Senegal',
  'Australia', 'Switzerland', 'Denmark', 'Poland', 'Serbia', 'South Korea',
  'Ghana', 'Cameroon', 'Uruguay', 'Colombia', 'Chile', 'Peru', 'Bolivia',
  'Venezuela', 'Paraguay', 'Costa Rica', 'Honduras', 'Jamaica', 'Haiti',
  'Panama', 'El Salvador', 'Guatemala', 'Cuba', 'Trinidad', 'Qatar', 'Saudi Arabia',
  'Iran', 'Iraq', 'Egypt', 'Algeria', 'Nigeria', 'Ivory Coast', 'Côte d\'Ivoire',
  'South Africa', 'Zambia', 'Mali', 'Guinea', 'Gabon', 'Congo', 'Slovakia',
  'Hungary', 'Turkey', 'Ukraine', 'Romania', 'Greece', 'Norway', 'Scotland',
  'Wales', 'Ireland', 'Austria', 'Czech Republic', 'Finland', 'Estonia',
  'New Zealand', 'Indonesia', 'Philippines', 'Hong Kong', 'China', 'India',
]);

function isNationalTeam(name: string): boolean {
  return WC_TEAMS.has(name);
}

// League slug map (kept for football + legacy league naming)
const LEAGUE_SLUG_MAP: Record<string, string> = {
  'FIFA World Cup 2026': 'copa-mundo-2026',
  'World Cup': 'copa-mundo-2026',
  'Ligue Des Champions': 'champions-league',
  'Champions League': 'champions-league',
  'Copa Libertadores': 'copa-libertadores',
  'Copa Sudamericana': 'copa-sudamericana',
  'Liga MX': 'liga-mx',
  'La Liga': 'laliga',
  'Copa Argentina': 'copa-argentina',
  'Ecuador Ligapro': 'liga-ecuador',
  'Concacaf Champions Cup': 'concacaf',
  'NHL': 'nhl',
  'NBA': 'nba',
  'MLB': 'mlb',
  'UFC': 'ufc',
  'MotoGP': 'motogp',
};

// Map the new source's `category` + `league` fields onto the site's sport model.
function inferSport(
  category: string,
  league: string,
  team1: string,
  team2: string,
): { sport: Sport; sportSlug: string; leagueSlug: string } {
  const cat = category.trim();
  const lg = league.trim();

  // Football (soccer) — includes the World Cup special case
  if (cat === 'Football') {
    if (isNationalTeam(team1) || isNationalTeam(team2)) {
      return { sport: 'futbol', sportSlug: 'futbol', leagueSlug: 'copa-mundo-2026' };
    }
    return { sport: 'futbol', sportSlug: 'futbol', leagueSlug: LEAGUE_SLUG_MAP[lg] ?? generateSlug(lg || 'futbol') };
  }

  if (cat === 'Basketball' && /\bNBA\b/i.test(lg)) return { sport: 'nba', sportSlug: 'nba', leagueSlug: 'nba' };
  if (cat === 'Ice Hockey' || /\bNHL\b/i.test(lg)) return { sport: 'nhl', sportSlug: 'nhl', leagueSlug: 'nhl' };
  if (cat === 'Baseball' || /\bMLB\b/i.test(lg)) return { sport: 'mlb', sportSlug: 'mlb', leagueSlug: 'mlb' };
  if ((cat === 'Combat Sports' || cat === 'MMA') && /\bUFC\b/i.test(lg)) return { sport: 'ufc', sportSlug: 'ufc', leagueSlug: 'ufc' };
  if (cat === 'Motorsport' || /\bMotoGP\b/i.test(lg)) return { sport: 'motogp', sportSlug: 'motogp', leagueSlug: 'motogp' };

  // Everything else (NFL, NBL, Boxing, MLS, Cricket, Rugby, Golf, …) → generic bucket,
  // but still get a dedicated league page generated from the real `league` name.
  return { sport: 'otro', sportSlug: 'otro', leagueSlug: LEAGUE_SLUG_MAP[lg] ?? generateSlug(lg || 'otros') };
}

// Split a headline into two competitors. New source uses " at " (US sports) and " vs. ".
function parseTitle(title: string): { team1: string; team2: string } {
  for (const sep of [' x ', ' @ ', ' at ', ' vs. ', ' vs ', ' v ']) {
    const idx = title.indexOf(sep);
    if (idx !== -1) {
      return {
        team1: title.slice(0, idx).trim(),
        team2: title.slice(idx + sep.length).trim(),
      };
    }
  }
  return { team1: title.trim(), team2: '' };
}

function parseLangCode(label: string): string {
  const l = label.toUpperCase();
  if (l.startsWith('EN')) return 'en';
  if (l === 'ES') return 'es';
  if (l.startsWith('PT') || l.startsWith('SPORTTV')) return 'pt';
  if (l.startsWith('AR')) return 'ar';
  if (l === 'DE') return 'de';
  if (l === 'FR') return 'fr';
  if (l === 'IT') return 'it';
  if (l.startsWith('NL')) return 'nl';
  if (l.startsWith('TR')) return 'tr';
  return 'en';
}

// The new source ships a full ISO `start_time`; derive the "HH:MM" UTC string
// the components/timezone helpers expect. Falls back to the feed timestamp.
function timeFromIso(startIso: string, fallbackIso: string): { timeUtc: string; isoDateUtc: string } {
  const d = startIso ? new Date(startIso) : null;
  if (d && !isNaN(d.getTime())) {
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    return { timeUtc: `${hh}:${mm}`, isoDateUtc: d.toISOString() };
  }
  const fb = new Date(fallbackIso);
  const base = isNaN(fb.getTime()) ? new Date() : fb;
  const hh = String(base.getUTCHours()).padStart(2, '0');
  const mm = String(base.getUTCMinutes()).padStart(2, '0');
  return { timeUtc: `${hh}:${mm}`, isoDateUtc: base.toISOString() };
}

function normalizeServer(raw: RawServer): Channel {
  return {
    label: raw.name,
    langCode: parseLangCode(raw.name),
    embedUrl: raw.embed_url,
    stableUrl: raw.embed_url,
    available: true,
  };
}

function normalizeMatch(raw: RawMatch, generated: string): NormalizedMatch {
  const title = fixEncoding(raw.title);
  const home = (raw.teams?.home?.name ?? '').trim();
  const away = (raw.teams?.away?.name ?? '').trim();

  let team1: string;
  let team2: string;
  if (home || away) {
    team1 = home;
    team2 = away;
  } else {
    const parsed = parseTitle(title);
    team1 = parsed.team1;
    team2 = parsed.team2;
  }
  team1 = fixEncoding(team1);
  team2 = fixEncoding(team2);

  const league = fixEncoding(raw.league) || 'Otros';
  const category = fixEncoding(raw.category);
  const { sport, sportSlug, leagueSlug } = inferSport(category, league, team1, team2);
  const { timeUtc, isoDateUtc } = timeFromIso(raw.start_time, generated);
  const slug = team2 ? matchSlug(team1, team2) : generateSlug(team1 || title);
  const channels = (raw.servers ?? []).map(normalizeServer);

  return {
    id: raw.id,
    rawTitle: title,
    team1,
    team2,
    league,
    category,
    sport,
    status: fixEncoding(raw.status),
    poster: raw.poster ?? '',
    timeUtc,
    isoDateUtc,
    embedUrl: raw.embed_url,
    pageUrl: raw.page_url ?? '',
    channels,
    streamsAvailable: channels.length,
    slug,
    leagueSlug,
    sportSlug,
  };
}

let _cache: MatchData | null = null;

export async function getMatchData(): Promise<MatchData> {
  if (_cache) return _cache;

  let raw: RawApiResponse;

  try {
    const res = await fetch(DATA_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.json() as RawApiResponse;
  } catch {
    // Fallback to local cache
    try {
      const { default: fallback } = await import('../../rereyano_data.json');
      raw = fallback as RawApiResponse;
    } catch {
      raw = { source: '', updated: new Date().toISOString(), count: 0, live: 0, upcoming: 0, matches: [] };
    }
  }

  const generated = raw.updated || new Date().toISOString();
  // "24/7 channel" entries are always-on TV streams, not head-to-head matches.
  const matches = (raw.matches ?? [])
    .filter((m) => m.league !== '24/7 channel')
    .map((m) => normalizeMatch(m, generated));

  const bySport: Record<string, NormalizedMatch[]> = {};
  const byLeague: Record<string, NormalizedMatch[]> = {};
  const byTeam: Record<string, NormalizedMatch[]> = {};

  for (const m of matches) {
    (bySport[m.sport] ??= []).push(m);
    (byLeague[m.leagueSlug] ??= []).push(m);
    if (m.team1) (byTeam[generateSlug(m.team1)] ??= []).push(m);
    if (m.team2) (byTeam[generateSlug(m.team2)] ??= []).push(m);
  }

  _cache = { generated, matches, bySport, byLeague, byTeam };
  return _cache;
}

export function getLeagueName(leagueSlug: string): string {
  const reverse = Object.entries(LEAGUE_SLUG_MAP).find(([, v]) => v === leagueSlug);
  return reverse ? reverse[0] : leagueSlug.replace(/-/g, ' ');
}
