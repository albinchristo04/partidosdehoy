# Pirlo TV — Full Build & SEO Plan v4 (partidosdehoy.live)

> **Context:** Independent Pirlo TV-branded sports streaming site.
> Pirlo TV is the highest-ceiling keyword in the niche at 5M monthly searches.
> Data from the old `.top` domain proved `pirlo tv` ranked at pos 73 and still drove 213 clicks — a dedicated Pirlo TV domain makes it the primary brand, not a footnote.
> **v4 changes:** API source updated to `wc.ppvtv.top/api/matches.json` with a completely different structure. All data layer, types, player architecture, and channel logic rewritten to match. Keywords expanded to cover FIFA World Cup 2026, UFC, and new language channel clusters now proven in the API.
> Target: beat 14,400 clicks/month by month 2.

---

## What the Previous Domain Taught Us (GSC Data — Month 1)

| Finding | Data Signal | Action on partidosdehoy.live |
|---------|------------|------------------------|
| "Pirlo TV" at pos 73 still drove 213 clicks | Users scrolled 7 pages and clicked anyway — massive suppressed demand | `partidosdehoy.live` IS the Pirlo TV brand site, not just a page on it |
| "Tarjeta roja" is a second brand we accidentally rank for | 600+ clicks from tarjeta-roja-* variants with zero targeting | Dedicated `/tarjeta-roja/` hub + title tags updated |
| MLB/beisbol is the #1 sport by query density | 4 of top 20 queries are MLB-related, pos 3.8 on head term | MLB gets its own section with team pages from day 1 |
| "Dónde mirar X contra Y" — impressions but no clicks | 606 impressions at pos 6, only 10 clicks (1.65% CTR) | FAQ schema + featured snippet targeting on all match pages |
| Spain (4,273) + Mexico (2,635) = 48% of all traffic | Clear geographic concentration | Liga MX and La Liga hubs built from day 1 |
| Accent/typo variants rank at pos 15–18 with 500+ impr | "roja dirécta", "rojadirécta mlb" etc | All variants baked into meta, schema, and page copy |
| "Roja directa pirlo" — 752 impressions, pos 11, 9.8% CTR | Triple brand combo underserved | Dedicated brand-combo page `/roja-directa-pirlo-tv/` |

---

## Domain & Stack

**Domain:** `partidosdehoy.live`
**Stack:** Astro (static site generator) + Cloudflare Pages
**Language:** Spanish only
**Content:** 100% programmatic (zero manual)
**Data Source:** `https://wc.ppvtv.top/api/matches.json`
**Fallback:** Local `rereyano_data.json` if API fetch fails
**Rebuild:** Every 3 hours via GitHub Actions cron
**Relationship to other domains:** Completely independent. No cross-linking. No shared footprint. Different Cloudflare account if possible.

---

## API Structure (v4 — wc.ppvtv.top)

> **Breaking change from v3.** The old source used separate team/league/sport fields and a `bolaloca.my` player URL. The new source is structured completely differently. All parsing logic must use the new shape.

### Response Shape

```json
{
  "generated": "2026-06-15T06:16:49.639665+00:00",
  "total": 20,
  "matches": [ /* array of match objects */ ]
}
```

### Match Object

```json
{
  "day": "SUNDAY",
  "index": 0,
  "title": "Germany x Curaçao",
  "time": "18:00",
  "embed_url": "https://wc.ppvtv.top/embed/SUNDAY/0",
  "streams_available": 14,
  "channels": [
    {
      "label": "EN·1",
      "embed_url": "https://wc.ppvtv.top/embed/SUNDAY/0?ch=0",
      "stable_url": "https://wc.ppvtv.top/embed/hd1",
      "available": true
    }
  ]
}
```

### Key Structural Differences vs Old API

| Aspect | Old API (v3) | New API (v4) |
|--------|-------------|-------------|
| Match ID | Dedicated `id` field | Composite: `day` + `index` |
| Teams | Separate `home` / `away` fields | Single `title` string |
| Title separator | N/A | `" x "` (WC), `" @ "` (NHL/MLB), `" v "` (UFC) |
| League | Dedicated `league` field | Prefix in title: `"NHL: ..."` or inferred |
| Sport | Dedicated `sport` field | Must be inferred from title/league prefix |
| Date | Full ISO datetime | Weekday name only: `"SUNDAY"` — anchored via `generated` |
| Time | Full UTC timestamp | Time string only: `"18:00"` UTC |
| Player URL | `bolaloca.my/player/{server}/{channel}` | Full `embed_url` per channel — iframe directly |
| Channels | `lang` code + numeric `channel_id` | `label` + `embed_url` + `stable_url` + `available` |
| Server concept | 4 servers per channel | No server — each channel entry IS a stream; `stable_url` is fallback |
| Language codes | `es`, `gb`, `fr` etc. | Human labels: `"EN·1"`, `"AR/ES"`, `"SPORTTV5"`, `"PT·1"` |

### Title Parsing Rules

| Format | Example | Separator | League source |
|--------|---------|-----------|--------------|
| WC/national teams | `"Germany x Curaçao"` | ` x ` | Inferred from national team list |
| League-prefixed | `"NHL: Vegas Golden Knights @ Carolina Hurricanes"` | ` @ ` | Prefix before `:` |
| UFC/MMA events | `"UFC Freedom 250: Ilia Topuria v Justin Gaethje"` | ` v ` | Prefix before `:` |

**Known encoding issue:** API returns mojibake for non-ASCII characters. `"CuraÃ§ao"` = `"Curaçao"`, `"CÃ´te"` = `"Côte"`. Fix with `decodeURIComponent(escape(str))` before any parsing.

### Channel Label → Language Mapping

| Label pattern | Language | `langCode` |
|--------------|----------|-----------|
| `EN`, `EN·1`, `EN·2`, `EN·3` | English | `en` |
| `ES` | Spanish | `es` |
| `PT·1`, `PT·2` | Portuguese | `pt` |
| `AR`, `AR/ES` | Arabic / Arabic+Spanish | `ar` |
| `DE` | German | `de` |
| `FR` | French | `fr` |
| `IT` | Italian | `it` |
| `NL/EN` | Dutch/English | `nl` |
| `TR/EN` | Turkish/English | `tr` |
| `SPORTTV1`–`SPORTTV5` | Sport TV (PT broadcast) | `tv` |

---

## Keyword Strategy

> **v4 expansion:** Added FIFA World Cup 2026 as an entirely new Tier 1 cluster (the biggest sporting event on earth is currently live in the data). Added UFC/MMA cluster, NHL Stanley Cup cluster, PT/AR/TR channel language clusters, and national team search patterns driven by the new API's actual content.

### Tier 1 — Head Terms (500K–5M monthly searches)

**Brand cluster**
- `pirlo tv` (5M) — **THE primary keyword, this domain owns it**
- `pirlotv` (~2M) — co-primary, zero-space variant
- `pirlo tv en vivo` — branded streaming intent
- `pirlo tv futbol en vivo` — sport-specific Pirlo TV intent
- `roja directa en vivo`, `la roja directa` (500K each)
- `tarjeta roja tv` — proven in previous domain data
- `futbol en vivo`, `futbol tv`, `futbol en la tv` (500K each)

**World Cup 2026 cluster — NEW, Tier 1 priority**
- `mundial 2026` — explosive volume, currently live tournament
- `copa del mundo 2026 en vivo`
- `world cup 2026 en vivo`
- `mundial en vivo hoy`
- `ver mundial 2026 gratis`
- `mundial 2026 pirlo tv`

### Tier 2 — Mid Terms (50K–500K monthly searches)

**Pirlo TV brand combos**
- `pirlo tv hoy`, `pirlo tv gratis`, `pirlo tv online`
- `pirlo tv mlb`, `pirlo tv nba`, `pirlo tv nhl`
- `pirlo tv futbol`, `pirlo tv liga mx`, `pirlo tv champions league`
- `pirlo tv roja directa`, `roja directa pirlo tv`
- `roja directa hd`, `futbol en vivo hoy`
- `tarjeta roja en vivo`, `tarjeta roja pirlo tv`
- `roja directa pirlo` — 752 impressions/mo on previous domain, barely targeted
- `copa libertadores hoy`, `liga campeones`, `directa futbol`
- `pirlo tv mundial 2026` — NEW
- `pirlo tv ufc` — NEW
- `pirlo tv nhl stanley cup` — NEW

**World Cup 2026 mid-terms — NEW**
- `mundial 2026 partidos de hoy`
- `resultados mundial 2026`
- `tabla de posiciones mundial 2026`
- `grupos mundial 2026`
- `cuartos de final mundial 2026`
- `semifinal mundial 2026 en vivo`
- `final mundial 2026 en vivo`
- `alemania en vivo mundial`
- `holanda en vivo mundial`
- `francia en vivo mundial`
- `brasil en vivo mundial`
- `argentina en vivo mundial`
- `mexico en vivo mundial`
- `españa en vivo mundial`

**UFC/MMA — NEW**
- `ufc en vivo`, `ufc en vivo hoy`
- `ufc pirlo tv`, `ver ufc gratis`
- `roja directa ufc`
- `ufc 250 en vivo` (event-specific, program dynamically)
- `topuria vs gaethje en vivo` (fight-specific from API titles)

**NHL — expanded**
- `nhl en vivo hoy`, `nhl playoffs en vivo`
- `stanley cup en vivo`, `stanley cup 2026 en vivo`
- `pirlo tv nhl`, `roja directa nhl`
- `golden knights en vivo`, `hurricanes en vivo`
- `ver hockey en vivo gratis`

### Tier 3 — Long-tail (5K–50K monthly searches)

**Match-specific patterns (programmatic — one page per match)**
- `{team1} vs {team2} en vivo` — every match pair
- `ver {team1} contra {team2} gratis`
- `dónde mirar {team1} contra {team2}` — featured snippet target on every match page
- `{team1} vs {team2} pirlo tv`
- `{team1} vs {team2} roja directa`
- `a qué hora juega {team1} hoy`
- `{team1} en vivo mundial 2026` — NEW, national teams

**National team pages — NEW (driven by API data)**
- `alemania en vivo`, `holanda en vivo`, `suecia en vivo`
- `japón en vivo`, `túnez en vivo`, `ecuador en vivo`
- `costa de marfil en vivo`, `curazao en vivo`
- `{country} pirlo tv`, `{country} roja directa`

**Channel language cluster — NEW (from API label data)**
- `ver partido en árabe` — AR/AR·ES channels
- `partido en portugués gratis` — PT·1/PT·2/SPORTTV channels
- `ver mundial en alemán` — DE channel
- `ver mundial en francés` — FR channel
- `sporttv mundial en vivo` — SPORTTV5 channel brand

**MLB team pages (proven)**
- `pirlo tv yankees`, `roja directa yankees`, `yankees en vivo gratis`
- `pirlo tv dodgers`, `roja directa dodgers`, `dodgers en vivo`
- `pirlo tv padres`, `pirlo tv red sox`, `pirlo tv astros`
- `dónde mirar pittsburgh pirates` (606 impr on previous domain)
- `dónde mirar arizona diamondbacks` (175 impr on previous domain)
- `roja directa [team] mlb` — all 30 MLB teams

**Copa/league long-tails**
- `copa libertadores en vivo hoy`
- `copa sudamericana en vivo`
- `champions league en vivo gratis`
- `roja directa champions league`
- `liga mx en vivo hoy`
- `america en vivo hoy`, `chivas en vivo hoy`, `cruz azul en vivo`

### Trending / Event-driven (program dynamically per API title)

- FIFA World Cup 2026 matchday terms — all 64 matches, all 32 teams
- UFC event-specific: `{fighter1} vs {fighter2} en vivo`
- NHL Stanley Cup: `{team1} vs {team2} stanley cup en vivo`
- Copa Libertadores matchday terms
- Copa Sudamericana matchday terms
- Champions League group/knockout terms
- Liga MX jornada terms (America, Chivas, Cruz Azul)
- La Liga matchday terms (Real Madrid, Atletico, Barcelona)
- Accent variant cluster: `roja dirécta`, `roja dirécta tv`, `roja dirécta mlb`, `roja dirécta mundial`

---

## Page Types & URL Structure

### 1. Home Page (`/`)

**Target keywords:** `pirlo tv`, `pirlotv`, `pirlo tv en vivo`, `roja directa en vivo`, `futbol en vivo`, `tarjeta roja tv`, `mundial 2026 en vivo`, `mundial en vivo hoy`

**Content:**
- Hero: "Pirlo TV — Ver Deportes en Vivo Gratis | Roja Directa · Tarjeta Roja"
- **NEW:** World Cup 2026 banner pinned at top when WC matches exist in API response
- Today's matches grouped by league with countdown timers
- Priority sections: **Mundial 2026 (top when live)**, Futbol, MLB, NBA/NHL, UFC below
- "Actualizado: {datetime}" freshness timestamp
- Internal links to all hubs, league pages, today's match pages
- `WebSite` schema with `SearchAction`

---

### 2. Sport Hub Pages

| URL | Target Keywords | Priority |
|-----|----------------|----------|
| `/futbol/` | `pirlo tv futbol en vivo`, `futbol tv`, `futbol en vivo hoy` | High |
| `/mundial-2026/` | `mundial 2026 en vivo`, `copa del mundo 2026`, `mundial pirlo tv` | **#1 NEW Priority** |
| `/beisbol/` | `pirlo tv mlb`, `roja directa mlb`, `tarjeta roja mlb`, `beisbol en vivo` | High |
| `/mlb/` | `pirlo tv mlb`, `mlb en vivo`, `ver mlb gratis`, `mlb libre en vivo` | High |
| `/nba/` | `pirlo tv nba`, `roja directa nba`, `nba en vivo` | High |
| `/nhl/` | `pirlo tv nhl`, `nhl en vivo`, `stanley cup en vivo`, `roja directa hockey` | **Elevated — Stanley Cup live** |
| `/ufc/` | `ufc en vivo`, `pirlo tv ufc`, `ver ufc gratis`, `roja directa ufc` | **NEW** |
| `/baloncesto/` | `baloncesto en vivo` | Medium |
| `/motogp/` | `pirlo tv motogp`, `roja directa motogp` | Medium |

> `/mlb/` and `/beisbol/` remain separate. `/mlb/` targets English-language MLB search intent from US Hispanics. `/beisbol/` targets Spanish-language search intent from Latin America.
>
> `/mundial-2026/` is the single highest-opportunity new page. FIFA World Cup 2026 is live in the API right now. Build this page first.

---

### 3. League Hub Pages

| URL | API Title Match | Target Keywords | Priority |
|-----|----------------|----------------|----------|
| `/copa-mundo-2026/` | `FIFA World Cup 2026` (inferred) | `mundial 2026`, `copa mundo en vivo`, `partidos del mundial hoy` | **#1 NEW** |
| `/champions-league/` | `Ligue Des Champions` | `pirlo tv champions`, `champions en vivo`, `liga campeones` | High |
| `/copa-libertadores/` | `Copa Libertadores` | `copa libertadores en vivo hoy` | High |
| `/copa-sudamericana/` | `Copa Sudamericana` | `copa sudamericana en vivo` | High |
| `/liga-mx/` | `Liga MX` | `pirlo tv liga mx`, `liga mx en vivo`, `america en vivo hoy` | High |
| `/laliga/` | `La Liga` | `pirlo tv laliga`, `laliga en vivo`, `real madrid en vivo` | High |
| `/nhl/` | `NHL` (prefix) | `nhl en vivo`, `stanley cup 2026 en vivo`, `pirlo tv nhl` | High |
| `/ufc/` | `UFC` (prefix) | `ufc en vivo hoy`, `ufc pirlo tv`, `roja directa ufc` | **NEW** |
| `/copa-argentina/` | `Copa Argentina` | `copa argentina en vivo` | Medium |
| `/liga-ecuador/` | `Ecuador Ligapro` | `liga ecuador en vivo` | Medium |
| `/concacaf/` | `Concacaf Champions Cup` | `concacaf en vivo` | Medium |

---

### 4. National Team Pages — NEW

Driven entirely by the new API's WC 2026 content. Every national team appearing in the API gets a `/seleccion/{slug}/` page.

| URL | Team | Target Keywords |
|-----|------|----------------|
| `/seleccion/alemania/` | Germany | `alemania en vivo`, `alemania mundial 2026`, `ver alemania gratis` |
| `/seleccion/holanda/` | Netherlands | `holanda en vivo`, `holanda mundial 2026`, `países bajos en vivo` |
| `/seleccion/japon/` | Japan | `japón en vivo mundial`, `japón vs [rival]` |
| `/seleccion/suecia/` | Sweden | `suecia en vivo mundial`, `suecia pirlo tv` |
| `/seleccion/tunez/` | Tunisia | `túnez en vivo`, `túnez mundial 2026` |
| `/seleccion/ecuador/` | Ecuador | `ecuador en vivo`, `ecuador mundial 2026`, `ecuador pirlo tv` |
| `/seleccion/costa-de-marfil/` | Côte d'Ivoire | `costa de marfil en vivo`, `ivory coast mundial` |
| `/seleccion/curazao/` | Curaçao | `curazao en vivo`, `curazao vs alemania` |
| `/seleccion/[team]/` | All others | `{team} en vivo mundial`, `{team} pirlo tv` |

All 32 WC teams get pages. Generate dynamically from `byTeam` lookup if team is identified as national team.

---

### 5. Brand-Specific Pages

These pages capture branded search demand proven in GSC data.

#### `/pirlo-tv/`
**Target keywords:** `pirlo tv`, `pirlotv`, `pirlo tv futbol en vivo`, `pirlo tv en vivo`, `pirlo tv online`, `pirlo tv gratis`, `pirlo tv mundial 2026`

**Content:**
- H1: "Pirlo TV — Futbol y Deportes en Vivo Gratis"
- Full match listing for today including WC matches
- Channel selector using `channel.label` as button text, `channel.embedUrl` as iframe src
- Intro paragraph: "Pirlo TV es el mejor lugar para ver partidos en vivo gratis. Aquí puedes ver fútbol, béisbol, baloncesto, NHL, UFC y más deportes en directo con múltiples canales en español, inglés, portugués, alemán, francés e italiano."

#### `/tarjeta-roja/`
**Target keywords:** `tarjeta roja tv`, `tarjeta roja en vivo`, `tarjeta roja pirlo`, `tarjeta roja mlb`, `tarjeta roja directa`, `tarjeta roja mundial 2026`

**Content:**
- H1: "Tarjeta Roja TV en Vivo — Ver Partidos Gratis"
- Full match listing (same as home, different template)
- No canonical redirect — this is a real page targeting real brand searches
- Schema: `WebPage` + `ItemList`

#### `/roja-directa-pirlo-tv/`
**Target keywords:** `roja directa pirlo tv`, `pirlo tv roja directa`, `roja directa pirlo`, `rojadirecta pirlo tv`

**Content:**
- H1: "Roja Directa Pirlo TV — Ver Partidos en Vivo"
- 752 impressions/month at pos 11 with zero targeting on old domain. Focused page here pushes to pos 3–5.
- Match listing + player

#### `/tarjeta-roja-pirlo-tv/`
**Target keywords:** `tarjeta roja pirlo`, `tarjeta roja pirlo tv`, `pirlo tarjeta roja`

**Content:**
- Three-way brand overlap cluster — 215+ impressions/month on previous domain at pos 16 with no targeting

---

### 6. MLB Team Pages

Each team gets a dedicated page under `/equipo/`:

| URL | Team | Target Keywords |
|-----|------|----------------|
| `/equipo/new-york-yankees/` | Yankees | `pirlo tv yankees`, `roja directa yankees`, `yankees en vivo gratis` |
| `/equipo/los-angeles-dodgers/` | Dodgers | `pirlo tv dodgers`, `roja directa dodgers`, `dodgers en vivo` |
| `/equipo/san-diego-padres/` | Padres | `pirlo tv padres`, `roja directa padres`, `padres vs [rival] donde ver` |
| `/equipo/boston-red-sox/` | Red Sox | `pirlo tv red sox`, `red sox en vivo` |
| `/equipo/houston-astros/` | Astros | `pirlo tv astros`, `roja directa astros`, `astros en vivo` |
| `/equipo/pittsburgh-pirates/` | Pirates | `dónde mirar pittsburgh pirates` (606 impr proven) |
| `/equipo/arizona-diamondbacks/` | Diamondbacks | `dónde mirar arizona diamondbacks` (175 impr proven) |

---

### 7. Match Pages (`/partido/{slug}/`)

**Slug generation from new API:**
- Parse `title` → extract `team1`, `team2`
- `slug` = `{generateSlug(team1)}-vs-{generateSlug(team2)}`
- Examples: `germany-vs-curazao`, `vegas-golden-knights-vs-carolina-hurricanes`, `ilia-topuria-vs-justin-gaethje`

**"Dónde mirar" FAQ block on every match page:**

```html
<section class="faq">
  <h2>Preguntas frecuentes</h2>
  <dl>
    <dt>¿Dónde mirar {team1} contra {team2}?</dt>
    <dd>Puedes ver {team1} vs {team2} en vivo gratis en Pirlo TV (partidosdehoy.live).
        El partido comienza a las {time_es} hora España ({time_mx} CDMX). Disponible en {n} canales.</dd>
    <dt>¿A qué hora juega {team1} hoy?</dt>
    <dd>{team1} juega a las {time_es} (España) · {time_mx} (México) · {time_co} (Colombia) contra {team2} por {league}.</dd>
    <dt>¿En qué canal se transmite {team1} vs {team2}?</dt>
    <dd>El partido está disponible en {channel_count} canales: {channel_label_list}. Ver en vivo gratis en Pirlo TV.</dd>
    <dt>¿Hay canales en español para ver {team1} vs {team2}?</dt>
    <dd>{spanish_channel_answer} — Disponible en Pirlo TV gratis.</dd>
  </dl>
</section>
```

> Fourth FAQ question is new in v4 — targets the language-specific channel queries now visible in API data (ES, AR/ES channels). Only renders if `channels.some(c => c.langCode === 'es' || c.langCode === 'ar')`.

**Timezone row:**
```
18:00 UTC · 20:00 Madrid · 14:00 CDMX · 15:00 Bogotá · 16:00 Buenos Aires
```

---

### 8. Alternate URL Pages (`/ver/` and `/en-vivo/`)

- `/ver/{slug}/` → canonical to `/partido/{slug}/` — targets "ver X en vivo gratis"
- `/en-vivo/{slug}/` → canonical to `/partido/{slug}/` — targets "X en vivo" cluster

Three URL patterns × all matches = massive long-tail surface area. No extra development cost.

---

### 9. Static Utility Pages

| URL | Purpose |
|-----|---------|
| `/404.astro` | "Este partido ya terminó" + today's matches |
| `/sitemap.xml` | Auto-generated, full crawl coverage |
| `/feed.xml` | RSS — freshness signal for Google |
| `/robots.txt` | Full crawl allowed |
| `/manifest.json` | PWA manifest |
| `/indexnow-key.txt` | IndexNow verification |

---

## Player Architecture (v4 — Rewritten)

> **Breaking change from v3.** The old `bolaloca.my/player/{server}/{channel}` URL is gone. Channels now carry their own `embed_url` and `stable_url` directly. No server selector needed — each channel IS a stream.

### New Embed Flow

```
channel.embed_url  →  primary iframe src
channel.stable_url →  fallback iframe src (shown if primary fails)
```

### Channel Button UI

Buttons are grouped by language code extracted from `channel.label`:

```
[EN·1] [EN·2] [EN·3]   ← English group
[ES]                    ← Spanish
[AR] [AR/ES]            ← Arabic / bilingual
[DE] [FR] [IT]          ← European languages
[NL/EN] [TR/EN]         ← Bilingual
[PT·1] [PT·2] [SPORTTV5] ← Portuguese / Sport TV
```

On click, swap `iframe.src` to `channel.embedUrl`. If `available === false`, grey out the button.

### Match Page Layout (v4)

```
┌──────────────────────────────────────────────────┐
│ Breadcrumb: Inicio > Futbol > Mundial 2026       │
│                                                  │
│ H1: Germany vs Curaçao en Vivo — Mundial 2026    │
│ FIFA World Cup 2026 · 15 Jun 2026 · 18:00 UTC   │
│                                                  │
│ ┌──────────────────────────────────────────┐     │
│ │          IFRAME PLAYER (16:9)            │     │
│ │  src = channel.embedUrl                  │     │
│ └──────────────────────────────────────────┘     │
│                                                  │
│ [EN·1] [EN·2] [EN·3] [ES] [AR] [DE] [FR] [IT]   │
│ [AR/ES] [NL/EN] [TR/EN] [PT·1] [PT·2] [SPORT5]  │
│                                                  │
│ 18:00 UTC · 20:00 Madrid · 14:00 CDMX            │
│ · 15:00 Bogotá · 16:00 Buenos Aires              │
│                                                  │
│ ── Preguntas frecuentes ──                       │
│ ¿Dónde mirar Germany contra Curaçao?             │
│ ¿A qué hora juega Germany hoy?                   │
│ ¿En qué canal se transmite este partido?         │
│ ¿Hay canales en español para este partido?       │
│                                                  │
│ ── Más Partidos Hoy ──                           │
│ • Netherlands vs Japan · 21:00                   │
│ • Vegas Golden Knights vs Carolina · 01:00       │
└──────────────────────────────────────────────────┘
```

---

## SEO Architecture

### Title Tags

| Page Type | Pattern |
|-----------|---------|
| Home | `Pirlo TV — Deportes en Vivo Gratis · Roja Directa · Tarjeta Roja \| PirloTV` |
| /pirlo-tv/ | `Pirlo TV En Vivo — Futbol y Deportes en Directo Gratis \| PirloTV` |
| /tarjeta-roja/ | `Tarjeta Roja TV En Vivo — Ver Partidos Gratis \| Pirlo TV` |
| /roja-directa-pirlo-tv/ | `Roja Directa Pirlo TV En Vivo — Partidos Gratis \| PirloTV` |
| /mundial-2026/ | `Mundial 2026 En Vivo Gratis — Copa del Mundo Hoy \| Pirlo TV` |
| /copa-mundo-2026/ | `Partidos del Mundial 2026 Hoy — Ver Gratis en Directo \| Pirlo TV` |
| /ufc/ | `UFC En Vivo Hoy — Ver Peleas Gratis · Pirlo TV UFC \| PirloTV` |
| /nhl/ | `NHL En Vivo — Stanley Cup 2026 en Directo Gratis \| Pirlo TV` |
| /seleccion/{team}/ | `{Team} En Vivo — Mundial 2026 · Ver {Team} Gratis \| Pirlo TV` |
| Sport Hub | `{Sport} En Vivo Hoy — Ver {Sport} Gratis \| Pirlo TV` |
| /mlb/ | `MLB En Vivo — Beisbol en Directo Gratis · Pirlo TV MLB \| PirloTV` |
| /liga-mx/ | `Liga MX En Vivo Hoy — Ver America, Chivas, Cruz Azul \| Pirlo TV` |
| /laliga/ | `La Liga En Vivo — Ver Real Madrid, Barcelona, Atletico \| Pirlo TV` |
| League Hub | `{League} En Vivo — Partidos Hoy Gratis \| Pirlo TV` |
| Match | `{Team1} vs {Team2} En Vivo — {League} · Dónde Ver \| Pirlo TV` |
| WC Match | `{Team1} vs {Team2} En Vivo — Mundial 2026 · Dónde Ver Gratis \| Pirlo TV` |
| UFC Match | `{Fighter1} vs {Fighter2} En Vivo — UFC · Ver Pelea Gratis \| Pirlo TV` |
| Team/Player | `{Team} En Vivo — Proximos Partidos · Pirlo TV \| PirloTV` |

### Meta Descriptions

| Page | Pattern |
|------|---------|
| Home | "Pirlo TV — Ver deportes en vivo gratis. Roja Directa · Tarjeta Roja TV. Mundial 2026, Futbol, MLB, NBA, UFC en directo hoy con {n} canales." |
| /mundial-2026/ | "Ver el Mundial 2026 en vivo gratis en Pirlo TV. {n} partidos hoy. Canales en español, inglés, portugués, alemán y francés." |
| /ufc/ | "Ver UFC en vivo gratis en Pirlo TV. {n} peleas disponibles hoy. Canales en inglés y español. Sin registro." |
| /nhl/ | "NHL Stanley Cup 2026 en vivo gratis en Pirlo TV. {n} partidos hoy. Ver hockey en directo con múltiples canales." |
| /seleccion/{team}/ | "Ver {team} en vivo gratis en Pirlo TV. Todos los partidos de {team} en el Mundial 2026. Múltiples canales disponibles." |
| Match | "Ver {team1} vs {team2} en vivo hoy en Pirlo TV. {league} — {date} a las {time}. {n} canales disponibles. ¿Dónde mirar? Aquí gratis." |
| WC Match | "Ver {team1} contra {team2} en vivo. Mundial 2026 · {date} · {time_es} España / {time_mx} CDMX. {n} canales. Gratis en Pirlo TV." |
| UFC Match | "Ver {fighter1} vs {fighter2} en vivo. {event} · {date} · {time}. {n} canales disponibles en Pirlo TV gratis." |
| Hub | "Ver {league} en vivo en Pirlo TV. {n} partidos hoy en directo gratis. Múltiples canales en español, inglés y portugués." |

### Heading Strategy
- One H1 per page — primary keyword exact match
- H2 for "Partidos de Hoy", "Preguntas Frecuentes", "Más Partidos", "Partidos del Mundial"
- H3 for individual match cards and FAQ questions
- FAQ `<dt>` elements styled as H3 equivalent for visual hierarchy

### Accent & Typo Variant Strategy

Proven variants with 500+ impressions/month on previous domain with zero targeting:
- `roja dirécta` (accent on e)
- `roja dirécta tv`, `roja dirécta mlb`, `roja dirécta beisbol`
- `roja dirécta mundial` — NEW variant to add
- `pirlotv` (no space — high volume), `pirlo.tv` (dot variant)

**Fix:** Include in `<meta name="keywords">`, in programmatic SEO text blocks, and in schema `alternateName`:

```json
{
  "@type": "WebSite",
  "name": "Pirlo TV",
  "alternateName": [
    "PirloTV", "Pirlo TV En Vivo", "Roja Directa", "Tarjeta Roja TV",
    "RojaDirecta", "Roja Dirécta", "Pirlo TV Mundial 2026"
  ]
}
```

---

## Schema.org (JSON-LD)

### All Pages
- `BreadcrumbList`
- `WebSite` with `SearchAction` (home only)
- `Organization` with `alternateName` array

### Match Pages — SportsEvent

```json
{
  "@type": "SportsEvent",
  "name": "{team1} vs {team2}",
  "startDate": "{isoDateUtc}",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://partidosdehoy.live/partido/{slug}/"
  },
  "organizer": { "@type": "SportsOrganization", "name": "{league}" },
  "competitor": [
    { "@type": "SportsTeam", "name": "{team1}" },
    { "@type": "SportsTeam", "name": "{team2}" }
  ]
}
```

> Note: `startDate` is derived from `generated` + `day` + `time`. See `resolveIsoDate()` in `data.ts`.

### UFC Match Pages — Use `Event` not `SportsEvent`

```json
{
  "@type": "Event",
  "name": "{rawTitle}",
  "startDate": "{isoDateUtc}",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://partidosdehoy.live/partido/{slug}/"
  },
  "description": "Ver {fighter1} vs {fighter2} en vivo gratis en Pirlo TV."
}
```

### Match Pages — FAQPage (targets featured snippets)

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde mirar {team1} contra {team2}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ver {team1} vs {team2} en vivo gratis en Pirlo TV (partidosdehoy.live). El partido comienza a las {time_es} hora España ({time_mx} CDMX). Disponible en {n} canales."
      }
    },
    {
      "@type": "Question",
      "name": "¿A qué hora juega {team1} hoy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{team1} juega a las {time_es} hora España ({time_mx} hora México, {time_co} hora Colombia) contra {team2} por {league}."
      }
    },
    {
      "@type": "Question",
      "name": "¿En qué canal se transmite {team1} vs {team2}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El partido está disponible en {channel_count} canales: {channel_label_list}. Ver gratis en Pirlo TV."
      }
    },
    {
      "@type": "Question",
      "name": "¿Hay canales en español para ver {team1} vs {team2}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, el partido está disponible en {spanish_channels}. Ver en español gratis en Pirlo TV."
      }
    }
  ]
}
```

### Hub Pages — FAQPage

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Dónde ver {league/sport} en vivo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ver {league} en vivo gratis en Pirlo TV (partidosdehoy.live). Hoy hay {n} partidos disponibles: {match1}, {match2}..."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué partidos hay hoy de {sport}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hoy hay {n} partidos de {sport}: {match_list_sentence}. Todos disponibles en directo gratis en Pirlo TV."
      }
    }
  ]
}
```

### Hub Pages — ItemList

```json
{
  "@type": "ItemList",
  "name": "Partidos de {league} en vivo — Pirlo TV",
  "numberOfItems": "{n}",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://partidosdehoy.live/partido/{slug}/" }
  ]
}
```

---

## Data Flow & Build Pipeline

### Build-time Data Processing

1. Fetch JSON from `https://wc.ppvtv.top/api/matches.json`
2. Fallback to local `rereyano_data.json` if fetch fails
3. Fix mojibake encoding on all string fields (`decodeURIComponent(escape(str))`)
4. Parse each match title:
   - Extract `leaguePrefix` from text before `:`
   - Detect separator: ` x ` / ` @ ` / ` v ` / ` vs `
   - Split into `team1` and `team2`
5. Infer `league` from prefix or from national team lookup table
6. Infer `sport` from league name / title patterns
7. Resolve `isoDateUtc` from `generated` + `day` weekday + `time` string
8. Generate slugs: `{team1-slug}-vs-{team2-slug}`
9. Map `channels[]` — extract `langCode` from `label`, keep `embedUrl` + `stableUrl`
10. Build lookup tables: `bySport`, `byLeague`, `byTeam`
11. Pass to Astro pages via `getStaticPaths()`
12. On finish: ping Google + Bing sitemaps, POST new URLs to IndexNow

### Sport Inference Map

| API Title Pattern | Sport | Sport Slug | League Slug |
|------------------|-------|-----------|-------------|
| National team names (32 WC teams) | `futbol` | `/futbol/` | `/copa-mundo-2026/` |
| `Ligue Des Champions` prefix | `futbol` | `/futbol/` | `/champions-league/` |
| `Copa Argentina` prefix | `futbol` | `/futbol/` | `/copa-argentina/` |
| `Ecuador Ligapro` prefix | `futbol` | `/futbol/` | `/liga-ecuador/` |
| `Concacaf Champions Cup` prefix | `futbol` | `/futbol/` | `/concacaf/` |
| `Liga MX` prefix | `futbol` | `/futbol/` | `/liga-mx/` |
| `La Liga` prefix | `futbol` | `/futbol/` | `/laliga/` |
| `Copa Libertadores` prefix | `futbol` | `/futbol/` | `/copa-libertadores/` |
| `Copa Sudamericana` prefix | `futbol` | `/futbol/` | `/copa-sudamericana/` |
| `NHL:` prefix | `nhl` | `/nhl/` | `/nhl/` |
| `NBA:` prefix | `nba` | `/nba/` | `/nba/` |
| `MLB:` prefix | `mlb` | `/mlb/` | `/mlb/` |
| `UFC` in prefix | `ufc` | `/ufc/` | `/ufc/` |
| `MotoGP` in prefix | `motogp` | `/motogp/` | `/motogp/` |

### Date Anchoring Logic

```
generated = "2026-06-15T06:16:49Z"  (Sunday)
match.day  = "SUNDAY"
match.time = "18:00"

→ currentUTCDay = 0 (Sunday)
→ targetDay     = 0 (SUNDAY)
→ deltaDays     = 0 - 0 = 0
→ matchDate     = 2026-06-15 + 0 days
→ isoDateUtc    = "2026-06-15T18:00:00Z"

If match.day = "MONDAY" and generated is Sunday:
→ deltaDays = 1 - 0 = 1  (future this week → subtract 7 → -6)
→ matchDate = 2026-06-09  (last Monday)
```

> "Future" weekdays relative to `generated` are assumed to be the *previous* occurrence of that day, not next week. This prevents phantom future matches appearing during the 3-hour build window.

### Multi-Timezone Function (`src/lib/timezones.ts`)

```typescript
const TZ_OFFSETS = {
  utc:   { label: 'UTC',          offset: 0  },
  es:    { label: 'Madrid',       offset: +2 },
  mx:    { label: 'CDMX',         offset: -5 },
  co:    { label: 'Bogotá',       offset: -5 },
  ar:    { label: 'Buenos Aires', offset: -3 },
  cl:    { label: 'Santiago',     offset: -3 },
  pe:    { label: 'Lima',         offset: -5 },
  ve:    { label: 'Caracas',      offset: -4 },
  us_et: { label: 'ET',           offset: -4 },
  pt:    { label: 'Lisboa',       offset: +1 },  // NEW — PT channels in API
  de:    { label: 'Berlín',       offset: +2 },  // NEW — DE channel in API
};
```

> Lisboa and Berlín added in v4 because the API now has PT·1/PT·2 and DE channels, so those user segments are confirmed present.

### Slug Generation Rules

- Teams/fighters: lowercase, remove accents, replace spaces/dots with hyphens
  - `Germany` → `germany`
  - `Côte d'Ivoire` → `cote-d-ivoire`
  - `Ilia Topuria` → `ilia-topuria`
  - `Vegas Golden Knights` → `vegas-golden-knights`
- Leagues: manual slug dictionary (see `LEAGUE_SLUG_MAP` in `data.ts`)
- Matches: `{team1-slug}-vs-{team2-slug}`
- National team pages: `/seleccion/{team-slug}/`
- Brand pages: hardcoded slugs

### Channel Language Labels (v4)

| Label | Display Name | Group |
|-------|-------------|-------|
| `EN·1`, `EN·2`, `EN·3` | Inglés 1/2/3 | English |
| `EN` | Inglés | English |
| `ES` | Español | Spanish |
| `AR` | Árabe | Arabic |
| `AR/ES` | Árabe / Español | Arabic bilingual |
| `DE` | Alemán | German |
| `FR` | Francés | French |
| `IT` | Italiano | Italian |
| `NL/EN` | Holandés / Inglés | Dutch bilingual |
| `TR/EN` | Turco / Inglés | Turkish bilingual |
| `PT·1`, `PT·2` | Portugués 1/2 | Portuguese |
| `SPORTTV1`–`SPORTTV5` | Sport TV | Sport TV (PT) |

### Configuration Constants (`src/lib/config.ts`)

```typescript
export const DATA_URL      = 'https://wc.ppvtv.top/api/matches.json';
export const SITE_URL      = 'https://partidosdehoy.live';
export const SITE_NAME     = 'Pirlo TV';
export const SITE_TAGLINE  = 'Pirlo TV — Roja Directa · Tarjeta Roja TV';
export const INDEXNOW_KEY  = process.env.INDEXNOW_KEY;
export const REBUILD_INTERVAL_HOURS = 3;
// v4: no PLAYER_BASE_URL — embed URLs come directly from channel.embedUrl
```

---

## Programmatic SEO Text Templates

### Home Page Hero

```
Pirlo TV — Ver {n} partidos en vivo hoy gratis. Roja Directa En Vivo y Tarjeta Roja TV en un solo lugar.
Mundial 2026, Fútbol, MLB, NBA, NHL, UFC y más deportes en directo con múltiples canales
en español, inglés, portugués, alemán, francés e italiano.
```

### Sport Hub — Mundial 2026 (NEW)

```
Mundial 2026 en vivo hoy en Pirlo TV. {n} partidos disponibles: {match1} a las {time1},
{match2} a las {time2}{, y {n-2} partidos más}. Ver la Copa del Mundo 2026 en directo gratis
con {channel_count} canales en español (ES, AR/ES), inglés (EN·1, EN·2, EN·3), portugués (PT·1, PT·2),
alemán (DE), francés (FR) e italiano (IT). Pirlo TV Mundial 2026 — Actualizado: {build_datetime}.
```

### Sport Hub — Futbol

```
Hoy hay {n} partidos de fútbol en vivo en Pirlo TV. Ver {match1} por {league1} a las {time1},
{match2} por {league2} a las {time2}{, y {n-2} partidos más}. Todos los partidos de fútbol
en directo gratis con canales en español, inglés, francés e italiano.
Pirlo TV Fútbol — Actualizado: {build_datetime}.
```

### Sport Hub — MLB/Beisbol

```
Hoy hay {n} partidos de béisbol MLB en vivo en Pirlo TV. Ver {match1} a las {time1} ET ({time1_mx} CDMX),
{match2} a las {time2} ET. Pirlo TV MLB · Roja Directa MLB · Tarjeta Roja MLB —
todos los partidos de la Major League Baseball en directo gratis.
```

### Sport Hub — UFC (NEW)

```
UFC en vivo hoy en Pirlo TV. {n} peleas disponibles: {match1} a las {time1}.
Ver la UFC en directo gratis con canales en inglés y español. Sin registro.
Pirlo TV UFC · Roja Directa UFC — Actualizado: {build_datetime}.
```

### Sport Hub — NHL Stanley Cup (expanded)

```
NHL Stanley Cup 2026 en vivo hoy en Pirlo TV. {n} partidos disponibles.
Ver {match1} a las {time1}. Hockey en directo gratis sin registro.
Pirlo TV NHL · Roja Directa Hockey — Actualizado: {build_datetime}.
```

### League Hub — Champions League

```
Champions League en vivo hoy en Pirlo TV. {n} partidos disponibles: {match1} a las {time1},
{match2} a las {time2}. Ver la UEFA Champions League (Liga de Campeones) en directo gratis
en Pirlo TV con canales en {languages}. Actualizado {build_datetime}.
```

### League Hub — Liga MX

```
Liga MX en vivo hoy en Pirlo TV. {n} partidos disponibles. Ver {match1} a las {time1} hora México,
{match2} a las {time2}. América, Chivas, Cruz Azul, Pumas en directo gratis.
Pirlo TV Liga MX — transmisiones disponibles con {channel_count} canales.
```

### Match Page

```
Ver {team1} vs {team2} en vivo por {league} en Pirlo TV. El partido comienza a las {time_utc} UTC
({time_es} hora España · {time_mx} hora México · {time_co} hora Colombia) del {date}.
Disponible en {channel_count} canales: {channel_label_list}.
Idiomas disponibles: {language_list}. Transmisión gratis sin registro en Pirlo TV.
```

### National Team Page (NEW)

```
{Team} en vivo en el Mundial 2026 en Pirlo TV. Ver todos los partidos de {team}
en la Copa del Mundo 2026 en directo gratis. Múltiples canales disponibles en español,
inglés y portugués. Pirlo TV — Roja Directa {team} — Tarjeta Roja {team}.
```

---

## Internal Linking Architecture

### Links Added on Every Page
- Nav: **Pirlo TV (Inicio)** · Mundial 2026 · Fútbol · MLB · NHL · NBA · UFC · MotoGP · Tarjeta Roja · Roja Directa
- Footer: all sport hubs + top league hubs + `/tarjeta-roja/` + `/pirlo-tv/` + `/roja-directa-pirlo-tv/` + `/mundial-2026/`
- Breadcrumb: `Inicio > {Sport} > {League} > {Match}`

### Match Page Links
- League hub → Sport hub → Home
- Both team pages (or national team pages for WC matches)
- `/tarjeta-roja/` mentioned in body text
- `/pirlo-tv/` mentioned as primary
- "Más Partidos Hoy" section: 4–6 related match links

### Brand Page Links
- Linked from nav (always visible)
- Linked from every match page body text
- Linked from home hero section
- Cross-linked to each other and to `/roja-directa-pirlo-tv/`

---

## Technical SEO

### Canonical URLs
- `/partido/{slug}/` → self-canonical
- `/ver/{slug}/` → canonical to `/partido/{slug}/`
- `/en-vivo/{slug}/` → canonical to `/partido/{slug}/`
- `/tarjeta-roja/` → self-canonical
- `/pirlo-tv/` → self-canonical
- `/seleccion/{slug}/` → self-canonical
- `/mundial-2026/` → self-canonical

### Robots.txt

```
User-agent: *
Allow: /

Sitemap: https://partidosdehoy.live/sitemap.xml
```

### Sitemap Priorities

| Page Type | Priority | Changefreq |
|-----------|----------|-----------|
| Home | 1.0 | hourly |
| /pirlo-tv/ | 1.0 | daily |
| /mundial-2026/ | 1.0 | hourly |
| /copa-mundo-2026/ | 1.0 | hourly |
| /tarjeta-roja/ | 0.9 | daily |
| /roja-directa-pirlo-tv/ | 0.9 | daily |
| /ufc/ | 0.9 | daily |
| /nhl/ | 0.9 | daily |
| Sport hubs | 0.8 | daily |
| League hubs | 0.8 | daily |
| /seleccion/{team}/ | 0.7 | daily |
| Match pages | 0.6 | hourly |
| Team pages | 0.5 | daily |
| /ver/ pages | 0.4 | hourly |
| /en-vivo/ pages | 0.4 | hourly |

### Performance
- Zero JS by default (Astro)
- One vanilla JS script for channel tab switcher (~2KB, deferred)
- Inline critical CSS
- No images (pure CSS/text design)
- Preconnect hints on match pages:
  ```html
  <link rel="preconnect" href="https://wc.ppvtv.top">
  <link rel="dns-prefetch" href="https://wc.ppvtv.top">
  ```
- Target: 95+ Lighthouse

### Open Graph + Twitter Card
All pages. Match pages use dynamic OG description with team names, league, and time. OG `site_name` = "Pirlo TV". WC match pages include "Mundial 2026" in OG title.

---

## Search Engine Indexing

### After Every Deploy

```bash
# Sitemap pings
curl "https://www.google.com/ping?sitemap=https://partidosdehoy.live/sitemap.xml"
curl "https://www.bing.com/ping?sitemap=https://partidosdehoy.live/sitemap.xml"

# IndexNow — submit new/changed match URLs
node scripts/indexnow-submit.js
```

### IndexNow Payload

```json
{
  "host": "partidosdehoy.live",
  "key": "<indexnow-key>",
  "keyLocation": "https://partidosdehoy.live/indexnow-key.txt",
  "urlList": [
    "https://partidosdehoy.live/partido/germany-vs-curazao/",
    "https://partidosdehoy.live/ver/germany-vs-curazao/",
    "https://partidosdehoy.live/en-vivo/germany-vs-curazao/"
  ]
}
```

Script diffs current sitemap against previous (`sitemap-prev.xml` artifact) to detect new URLs only.

---

## RSS Feed (`/feed.xml`)

Matches as `<item>` entries. Freshness signal — updated every 3 hours.

```xml
<item>
  <title>Germany vs Curaçao en Vivo — Mundial 2026 · Pirlo TV</title>
  <link>https://partidosdehoy.live/partido/germany-vs-curazao/</link>
  <pubDate>{isoDateUtc in RFC 2822}</pubDate>
  <description>Ver Germany vs Curaçao en vivo hoy en Pirlo TV. FIFA World Cup 2026 en directo gratis. {n} canales disponibles.</description>
</item>
```

Feed autodiscovery in `<head>`:

```html
<link rel="alternate" type="application/rss+xml" title="Pirlo TV — Partidos en Vivo" href="/feed.xml">
```

---

## Custom 404 Page

Message: "Este partido ya terminó — pero hay más en vivo ahora en Pirlo TV"
Content: Today's active matches list, links to all sport hubs (including `/mundial-2026/`), home
Purpose: Catches expired match URLs (yesterday's games), retains SEO equity via internal links.

---

## Cloudflare Configuration

### `public/_headers`

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=10800

/sitemap.xml
  Cache-Control: public, max-age=3600

/feed.xml
  Cache-Control: public, max-age=3600

/pirlo-tv/
  Cache-Control: public, max-age=10800

/tarjeta-roja/
  Cache-Control: public, max-age=10800

/mundial-2026/
  Cache-Control: public, max-age=10800

/copa-mundo-2026/
  Cache-Control: public, max-age=10800
```

### Dashboard Settings
- Brotli compression: enabled
- HTML/CSS/JS minification: enabled
- HTTP/3: enabled
- Early Hints: enabled
- IndexNow integration: enabled (secondary signal)

---

## GitHub Actions Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Build and Deploy

on:
  schedule:
    - cron: '0 */3 * * *'
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}

      - name: Deploy to Cloudflare Pages
        run: npx wrangler pages deploy dist/ --project-name=pirlotv-top
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}

      - name: Ping search engines
        run: bash scripts/ping-engines.sh

      - name: Submit IndexNow
        run: node scripts/indexnow-submit.js
        env:
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
```

---

## Project Structure

```
pirlotv-top/
├── src/
│   ├── layouts/
│   │   └── Base.astro
│   ├── components/
│   │   ├── MatchCard.astro
│   │   ├── Player.astro              # v4: uses channel.embedUrl directly
│   │   ├── ChannelSelector.astro     # v4: NEW — replaces old server selector
│   │   ├── Breadcrumb.astro
│   │   ├── MatchList.astro
│   │   ├── FaqBlock.astro
│   │   ├── TimezoneRow.astro
│   │   ├── SeoText.astro
│   │   ├── Nav.astro                 # v4: Mundial 2026 added to nav
│   │   └── Footer.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── futbol.astro
│   │   ├── mundial-2026.astro        # NEW
│   │   ├── nba.astro
│   │   ├── nhl.astro
│   │   ├── mlb.astro
│   │   ├── beisbol.astro
│   │   ├── ufc.astro                 # NEW
│   │   ├── motogp.astro
│   │   ├── pirlo-tv.astro
│   │   ├── tarjeta-roja.astro
│   │   ├── roja-directa-pirlo-tv.astro
│   │   ├── tarjeta-roja-pirlo-tv.astro
│   │   ├── [league].astro
│   │   ├── partido/
│   │   │   └── [slug].astro
│   │   ├── ver/
│   │   │   └── [slug].astro
│   │   ├── en-vivo/
│   │   │   └── [slug].astro
│   │   ├── equipo/
│   │   │   └── [slug].astro
│   │   ├── seleccion/                # NEW
│   │   │   └── [slug].astro
│   │   ├── 404.astro
│   │   ├── sitemap.xml.ts
│   │   ├── feed.xml.ts
│   │   └── robots.txt.ts
│   ├── lib/
│   │   ├── config.ts
│   │   ├── data.ts                   # v4: full rewrite — see Data Layer section
│   │   ├── slugs.ts
│   │   ├── seo.ts
│   │   ├── faq.ts
│   │   ├── timezones.ts              # v4: Lisboa + Berlín added
│   │   ├── indexnow.ts
│   │   └── types.ts                  # v4: full rewrite — see Types section
│   └── styles/
│       └── global.css
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   ├── indexnow-key.txt
│   └── _headers
├── scripts/
│   ├── ping-engines.sh
│   └── indexnow-submit.js
├── rereyano_data.json                # API fallback cache
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## TypeScript Types (`src/lib/types.ts`)

```typescript
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
```

---

## PWA Manifest

```json
{
  "name": "Pirlo TV",
  "short_name": "PirloTV",
  "description": "Pirlo TV — Roja Directa · Tarjeta Roja TV — Ver deportes en vivo gratis. Mundial 2026, Fútbol, MLB, NBA, NHL, UFC.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#e63946",
  "lang": "es",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## What partidosdehoy.live Does Differently vs Previous Domain

| Feature | Previous .top | partidosdehoy.live v4 |
|---------|--------------|----------------------|
| Primary brand | RojaDirectaEnVivo | **Pirlo TV** |
| Domain keyword match | Generic | Exact match — `pirlo tv` = 5M searches/mo |
| Pirlo TV page | Secondary page | Home identity + dedicated deep page |
| Tarjeta Roja page | No | Yes — `/tarjeta-roja/` |
| Brand combo pages | No | Yes — 2 pages |
| MLB team pages | No | Yes — 7 teams |
| Liga MX hub | No | Yes |
| La Liga hub | No | Yes |
| FIFA World Cup 2026 hub | No | **Yes — `/mundial-2026/` (NEW)** |
| National team pages | No | **Yes — `/seleccion/{team}/` × 32 teams (NEW)** |
| UFC hub | No | **Yes — `/ufc/` (NEW)** |
| NHL Stanley Cup hub | Basic | **Elevated priority (NEW)** |
| FAQ schema on match pages | No | Yes — FAQPage JSON-LD |
| "¿Hay canales en español?" FAQ | No | **Yes — v4 (NEW)** |
| "Dónde mirar" FAQ text | No | Yes — on every match |
| Multi-timezone display | No | Yes — 9 timezones (added Lisboa, Berlín) |
| Alternate match URLs | /ver/ only | /ver/ + /en-vivo/ |
| Nav includes brand pages | No | Yes — Pirlo TV first |
| Title tags include Pirlo TV | No | Yes — all pages |
| alternateName in schema | No | Yes — 7 variants |
| Accent typo variants in copy | No | Yes |
| "pirlotv" (no space) targeted | No | Yes — Tier 1 |
| Channel selector UI | Server 1–4 buttons | Language-labeled channel buttons (v4) |
| Embed URL | bolaloca.my/player/{server}/{ch} | Direct channel.embedUrl from API (v4) |
| Stable fallback URL | No | Yes — channel.stableUrl (v4) |
| Sitemap priority for /pirlo-tv/ | 0.9 | 1.0 (co-primary with home) |
| Sitemap priority for /mundial-2026/ | N/A | **1.0 (co-primary, NEW)** |

---

## Realistic Traffic Projection

Based on previous domain's month-1 performance (14,400 clicks), Pirlo TV keyword advantage (5M monthly searches), and the new FIFA World Cup 2026 opportunity now live in the API:

| Month | Projected Clicks | Driver |
|-------|-----------------|--------|
| Month 1 | 15,000–25,000 | Pirlo TV brand + Mundial 2026 WC search explosion (64 matches, 32 team pages) |
| Month 2 | 30,000–50,000 | WC knockout stage + Pirlo TV sport combos + brand pages indexed + UFC/NHL |
| Month 3 | 50,000–80,000 | FAQ schema featured snippets, national team pages ranking, brand combo pages |
| Month 6 | 90,000–150,000 | Full keyword cluster + post-WC domain authority carrying into Copa Libertadores/Champions |

> These projections assume zero backlink building. The World Cup 2026 live content is a 4-week window of extremely high search volume — indexing speed matters. Submit to IndexNow on every build during the tournament.
