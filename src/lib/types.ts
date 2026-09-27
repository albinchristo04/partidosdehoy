export interface RawServer {
  name: string;
  embed_url: string;
}

export interface RawTeam {
  name: string;
  logo: string;
}

export interface RawMatch {
  id: string;
  title: string;
  category: string;
  league: string;
  status: string;
  start_time: string;
  poster: string;
  teams: { home: RawTeam; away: RawTeam };
  page_url: string;
  embed_url: string;
  servers: RawServer[];
}

export interface RawApiResponse {
  source: string;
  updated: string;
  playlist_updated?: string;
  count: number;
  live: number;
  upcoming: number;
  matches: RawMatch[];
}

export type Sport = 'futbol' | 'nhl' | 'nba' | 'mlb' | 'ufc' | 'motogp' | 'otro';

export interface Channel {
  label: string;
  langCode: string;
  embedUrl: string;
  stableUrl: string;
  available: boolean;
}

export interface NormalizedMatch {
  id: string;
  rawTitle: string;
  team1: string;
  team2: string;
  league: string;
  category: string;
  sport: Sport;
  status: string;
  poster: string;
  timeUtc: string;
  isoDateUtc: string;
  embedUrl: string;
  pageUrl: string;
  channels: Channel[];
  streamsAvailable: number;
  slug: string;
  leagueSlug: string;
  sportSlug: string;
}

export interface MatchData {
  generated: string;
  matches: NormalizedMatch[];
  bySport: Record<string, NormalizedMatch[]>;
  byLeague: Record<string, NormalizedMatch[]>;
  byTeam: Record<string, NormalizedMatch[]>;
}
