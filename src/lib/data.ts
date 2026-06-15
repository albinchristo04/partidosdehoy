import type { RawApiResponse, RawMatch, RawChannel, NormalizedMatch, MatchData, Channel, Sport } from './types';
import { generateSlug, matchSlug } from './slugs';
import { DATA_URL } from './config';

// Fix mojibake encoding from API
function fixEncoding(str: string): string {
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

// League slug map
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

function inferSportAndLeague(prefix: string, team1: string, team2: string): { sport: Sport; league: string; leagueSlug: string; sportSlug: string } {
  const p = prefix.trim();

  if (p.startsWith('NHL') || p === 'NHL') return { sport: 'nhl', league: 'NHL', leagueSlug: 'nhl', sportSlug: 'nhl' };
  if (p.startsWith('NBA')) return { sport: 'nba', league: 'NBA', leagueSlug: 'nba', sportSlug: 'nba' };
  if (p.startsWith('MLB')) return { sport: 'mlb', league: 'MLB', leagueSlug: 'mlb', sportSlug: 'mlb' };
  if (p.toUpperCase().startsWith('UFC')) return { sport: 'ufc', league: 'UFC', leagueSlug: 'ufc', sportSlug: 'ufc' };
  if (p.startsWith('MotoGP')) return { sport: 'motogp', league: 'MotoGP', leagueSlug: 'motogp', sportSlug: 'motogp' };
  if (p.startsWith('Ligue Des Champions') || p.startsWith('Champions League')) return { sport: 'futbol', league: 'Champions League', leagueSlug: 'champions-league', sportSlug: 'futbol' };
  if (p.startsWith('Copa Libertadores')) return { sport: 'futbol', league: 'Copa Libertadores', leagueSlug: 'copa-libertadores', sportSlug: 'futbol' };
  if (p.startsWith('Copa Sudamericana')) return { sport: 'futbol', league: 'Copa Sudamericana', leagueSlug: 'copa-sudamericana', sportSlug: 'futbol' };
  if (p.startsWith('Liga MX')) return { sport: 'futbol', league: 'Liga MX', leagueSlug: 'liga-mx', sportSlug: 'futbol' };
  if (p.startsWith('La Liga')) return { sport: 'futbol', league: 'La Liga', leagueSlug: 'laliga', sportSlug: 'futbol' };
  if (p.startsWith('Copa Argentina')) return { sport: 'futbol', league: 'Copa Argentina', leagueSlug: 'copa-argentina', sportSlug: 'futbol' };
  if (p.startsWith('Ecuador Ligapro')) return { sport: 'futbol', league: 'Ecuador Ligapro', leagueSlug: 'liga-ecuador', sportSlug: 'futbol' };
  if (p.startsWith('Concacaf')) return { sport: 'futbol', league: 'Concacaf Champions Cup', leagueSlug: 'concacaf', sportSlug: 'futbol' };

  // National teams → World Cup
  if (isNationalTeam(team1) || isNationalTeam(team2)) {
    return { sport: 'futbol', league: 'FIFA World Cup 2026', leagueSlug: 'copa-mundo-2026', sportSlug: 'futbol' };
  }

  // Fallback: generic football
  if (p.length > 0) {
    const slug = generateSlug(p);
    return { sport: 'futbol', league: p, leagueSlug: slug, sportSlug: 'futbol' };
  }

  return { sport: 'otro', league: 'Otros', leagueSlug: 'otros', sportSlug: 'otros' };
}

function parseSeparator(title: string): { team1: string; team2: string; leaguePrefix: string } {
  // Extract prefix before ':'
  let leaguePrefix = '';
  let body = title;
  const colonIdx = title.indexOf(':');
  if (colonIdx !== -1) {
    leaguePrefix = title.slice(0, colonIdx).trim();
    body = title.slice(colonIdx + 1).trim();
  }

  // Try separators in order: ' x ', ' @ ', ' v ', ' vs '
  for (const sep of [' x ', ' @ ', ' v ', ' vs ']) {
    const idx = body.indexOf(sep);
    if (idx !== -1) {
      return {
        team1: body.slice(0, idx).trim(),
        team2: body.slice(idx + sep.length).trim(),
        leaguePrefix,
      };
    }
  }

  // Fallback — no separator found
  return { team1: body, team2: '', leaguePrefix };
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

// Day names → JS day index (0=Sunday)
const DAY_MAP: Record<string, number> = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};

export function resolveIsoDate(generated: string, day: string, time: string): string {
  const base = new Date(generated);
  const baseDay = base.getUTCDay();
  const targetDay = DAY_MAP[day.toUpperCase()] ?? baseDay;
  let delta = targetDay - baseDay;
  // Future weekdays relative to generated → assume previous week
  if (delta > 0) delta -= 7;
  const matchDate = new Date(base);
  matchDate.setUTCDate(base.getUTCDate() + delta);
  const [h, m] = time.split(':');
  matchDate.setUTCHours(Number(h), Number(m), 0, 0);
  return matchDate.toISOString();
}

function normalizeChannel(raw: RawChannel): Channel {
  return {
    label: raw.label,
    langCode: parseLangCode(raw.label),
    embedUrl: raw.embed_url,
    stableUrl: raw.stable_url,
    available: raw.available,
  };
}

function normalizeMatch(raw: RawMatch, generated: string): NormalizedMatch {
  const title = fixEncoding(raw.title);
  const { team1, team2, leaguePrefix } = parseSeparator(title);
  const fixedTeam1 = fixEncoding(team1);
  const fixedTeam2 = fixEncoding(team2);
  const fixedPrefix = fixEncoding(leaguePrefix);
  const { sport, league, leagueSlug, sportSlug } = inferSportAndLeague(fixedPrefix || fixedTeam1, fixedTeam1, fixedTeam2);
  const isoDateUtc = resolveIsoDate(generated, raw.day, raw.time);
  const slug = matchSlug(fixedTeam1 || title, fixedTeam2 || 'partido');

  return {
    id: `${raw.day}-${raw.index}`,
    day: raw.day,
    index: raw.index,
    rawTitle: title,
    team1: fixedTeam1,
    team2: fixedTeam2,
    league,
    sport,
    timeUtc: raw.time,
    isoDateUtc,
    embedUrl: raw.embed_url,
    channels: raw.channels.map(normalizeChannel),
    streamsAvailable: raw.streams_available,
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
      raw = { generated: new Date().toISOString(), total: 0, matches: [] };
    }
  }

  const matches = raw.matches.map((m) => normalizeMatch(m, raw.generated));

  const bySport: Record<string, NormalizedMatch[]> = {};
  const byLeague: Record<string, NormalizedMatch[]> = {};
  const byTeam: Record<string, NormalizedMatch[]> = {};

  for (const m of matches) {
    (bySport[m.sport] ??= []).push(m);
    (byLeague[m.leagueSlug] ??= []).push(m);
    if (m.team1) (byTeam[generateSlug(m.team1)] ??= []).push(m);
    if (m.team2) (byTeam[generateSlug(m.team2)] ??= []).push(m);
  }

  _cache = { generated: raw.generated, matches, bySport, byLeague, byTeam };
  return _cache;
}

export function getLeagueName(leagueSlug: string): string {
  const reverse = Object.entries(LEAGUE_SLUG_MAP).find(([, v]) => v === leagueSlug);
  return reverse ? reverse[0] : leagueSlug.replace(/-/g, ' ');
}
