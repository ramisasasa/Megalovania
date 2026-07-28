# Nearby

**Find food, turf, cafés and hangout spots around campus — filtered by what you can actually afford.**

Built for IUB students in Bashundhara R/A. Ask a plain-English question, get real
places within your radius and your budget, ranked using reviews from people who
actually went.

---

## The problem

Google Maps tells you a bakery exists. It doesn't tell you which one has good
pastries under ৳200, whether it's still open, or that the croissants are gone by
noon. Students end up asking in group chats every single time.

## What it does

**1. Ask in plain English**
> *"where can I get good pastries under ৳200?"*

The query is parsed into structured filters — item, category, price ceiling,
radius, vibe — then matched against the local dataset. You get a ranked answer
with a reason for each pick, pulled from real review text, plus the caveat if
recent reviewers complained.

**2. Search by distance and budget**
Radius selector (500 m / 1 km / 2 km / 5 km), a budget slider in taka per person,
category filters, and an open-now toggle. The map circle updates with the radius
so the filter is visible, not hidden.

**3. Add spots and review them**
Drop a pin anywhere on the map to add a place other students can find. Rate out
of 5 and describe your experience in up to 500 words.

**4. IUB-only sign in**
Only `@iub.edu.bd` accounts can sign in and contribute. Browsing works without an
account; reviewing does not.

**5. Recommended tab**
Most Recommended and Most Visited, scoped to your current radius.

---

## Things we got right that are easy to get wrong

**Negative reviews actually matter.** Ranking uses a Bayesian average, so a place
with one 5★ review doesn't outrank a place with forty 4.6★ reviews:

```
score = (C · global_mean + Σ stars) / (C + n_reviews)
```

Two-star reviews get surfaced in the answer as a caveat and flagged on the place
detail page, rather than being averaged into invisibility.

**Ranking is multi-factor,** not just distance:

```
0.35 · rating  +  0.25 · distance decay  +  0.20 · budget fit
              +  0.10 · recency  +  0.10 · tag match
```

**Location degrades gracefully.** Location is required by the product, but a
denied browser prompt falls back to the IUB campus centroid instead of showing an
empty screen.

**The AI search can't hallucinate a place.** It only ever ranks and explains
entries that came out of the dataset.

---

## Running it

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. No API keys, no database, no billing account.

```bash
npm run build      # production build into dist/
```

## Stack

- **React 19 + Vite** — client-side, deploys as a static site
- **Leaflet + OpenStreetMap** (CARTO dark tiles) — no Maps API key, no usage caps
- **localStorage** — stands in for the backend; `src/lib/store.js` is the seam to
  replace with real API calls
- **No API key required** — query parsing is a local rule-based engine in
  `src/lib/search.js`

## Layout

```
src/
  data/places.js        seed dataset — 34 places around Bashundhara R/A
  lib/geo.js            haversine, Bayesian rating, opening hours
  lib/search.js         query parser, ranking, answer generation
  lib/store.js          persistence + IUB email validation
  components/           map, filters, search, list, detail, add-spot, login
```

## Demo build — known scope

- Any 6-digit code passes OTP verification (the flow is real, the check is not)
- Data is seeded and local; coordinates are approximate to the block
- Reviews persist in `localStorage`, so they're per-browser
- Google Places is deliberately not wired up — their terms don't allow storing
  place data long-term, and OSM does

## Next

Real auth (Supabase), Postgres + PostGIS for radius queries at scale, Claude API
for the query parsing, and **group hangout mode** — "4 people, ৳600 each, 3 hours"
returns a full itinerary rather than a single place.
