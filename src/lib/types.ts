export interface RawChannel {
  label: string;
  embed_url: string;
  stable_url: string;
  available: boolean;
}

export interface RawMatch {
  day: string;
  index: number;
  title: string;
  time: string;
  embed_url: string;
  streams_available: number;
  channels: RawChannel[];
}

export interface RawApiResponse {
  generated: string;
  total: number;
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
  day: string;
  index: number;
  rawTitle: string;
  team1: string;
  team2: string;
  league: string;
  sport: Sport;
  timeUtc: string;
  isoDateUtc: string;
  embedUrl: string;
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
