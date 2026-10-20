import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createServer } from 'vite';

async function loadFeed(payload, fail = false) {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: null } });
  const originalFetch = globalThis.fetch;
  let requestedUrl;
  globalThis.fetch = async (url) => {
    requestedUrl = url;
    if (fail) throw new Error('Feed unavailable');
    return { ok: true, json: async () => payload };
  };
  try {
    const { getMatchData } = await server.ssrLoadModule('/src/lib/data.ts');
    return { data: await getMatchData(), requestedUrl };
  } finally {
    globalThis.fetch = originalFetch;
    await server.close();
  }
}

const event = {
  id: 'fixture', title: 'Home vs Away', category: 'soccer', sport: 'Football',
  league: 'La Liga', starts_at: '2099-10-20T15:10:00Z', ends_at: '2099-10-20T17:10:00Z',
  kind: 'event', watch_url: 'https://example.com/match/', embed_url: 'https://example.com/embed/',
  sources: [
    { label: 'Spanish channel', language: 'ES', iframe_url: 'https://example.com/es' },
    { label: 'Finnish channel', language: 'FI', iframe_url: 'https://example.com/fi' },
  ],
};

test('v2 feed maps dates, teams, sports, source languages and player fallback', async () => {
  const generated_at = '2026-10-20T13:15:00Z';
  const { data, requestedUrl } = await loadFeed({ generated_at, matches: [
    event,
    { ...event, id: 'nba', category: 'nba', league: 'NBA' },
    { ...event, id: 'nhl', category: 'nhl', league: 'NHL' },
    { ...event, id: 'hockey', category: 'hockey', league: 'Finland Liiga' },
    { ...event, id: 'f1', category: 'f1', league: 'Formula 1' },
    { ...event, id: 'player', sources: [], player: { status: 'available', iframe_url: 'https://example.com/player' } },
    { ...event, id: 'ended', starts_at: '2000-01-01T12:00:00Z', ends_at: '2000-01-01T14:00:00Z' },
    { ...event, id: 'channel', kind: 'channel' },
  ] });
  assert.equal(requestedUrl, 'https://strong8ksports.top/api/matches.json');
  assert.equal(data.generated, generated_at);
  assert.equal(data.matches.length, 7);
  const match = data.matches[0];
  assert.deepEqual([match.team1, match.team2, match.timeUtc, match.isoDateUtc], ['Home', 'Away', '15:10', event.starts_at.replace('Z', '.000Z')]);
  assert.equal(match.sport, 'futbol');
  assert.equal(match.leagueSlug, 'laliga');
  assert.equal(match.status, 'upcoming');
  assert.equal(match.pageUrl, event.watch_url);
  assert.deepEqual(match.channels.map((c) => [c.langCode, c.embedUrl]), [['es', 'https://example.com/es'], ['fi', 'https://example.com/fi']]);
  assert.equal(data.bySport.nba.length, 1);
  assert.equal(data.bySport.nhl.length, 1);
  assert.equal(data.byLeague['finland-liiga'][0].sport, 'otro');
  assert.equal(data.byLeague['formula-1'][0].sport, 'otro');
  assert.equal(data.matches[5].channels[0].embedUrl, 'https://example.com/player');
  assert.equal(data.matches[6].status, 'finished');
  assert.equal(new Set(data.matches.map((m) => m.slug)).size, data.matches.length);
});

test('checked-in feed remains usable when the source is unavailable or malformed', async () => {
  const fixture = JSON.parse(await readFile(new URL('../rereyano_data.json', import.meta.url), 'utf8'));
  for (const fail of [true, false]) {
    const { data } = await loadFeed({}, fail);
    assert.equal(data.generated, fixture.generated_at);
    assert.equal(data.matches.length, fixture.matches.length);
    assert.ok(data.matches.every((m) => m.timeUtc && m.channels.length && m.embedUrl));
    assert.ok(data.bySport.futbol.length > 0);
    assert.equal(new Set(data.matches.map((m) => m.slug)).size, data.matches.length);
    assert.ok(data.byLeague['champions-league'].length > 0);
  }
});
