import { distanceMeters, bayesianScore, isOpenAt, formatDistance } from './geo.js'

// ─────────────────────────────────────────────────────────────────────────────
// Query understanding.
//
// Runs entirely locally — no API key, no network, no way for it to fail on
// stage. If you later wire up /api/search (Claude), keep this as the fallback.
//
// Design rule: relevance is a GATE, not a tiebreaker. If we understood the
// query, only places in the matching categories are eligible — a 4.8★ kacchi
// place must never surface for "places to play fifa".
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORD_MAP = [
  {
    match: ['pastry', 'pastries', 'cake', 'dessert', 'sweet', 'sweets', 'croissant',
            'brownie', 'bakery', 'bake', 'donut', 'doughnut', 'tart', 'cupcake', 'patties'],
    tags: ['pastry', 'cake', 'dessert'], categories: ['bakery'],
  },
  {
    match: ['coffee', 'cafe', 'café', 'espresso', 'latte', 'cappuccino', 'americano', 'cha', 'tea'],
    tags: ['coffee'], categories: ['cafe'],
  },
  {
    match: ['study', 'studying', 'work', 'assignment', 'thesis', 'laptop', 'wifi', 'group work', 'revise'],
    tags: ['study', 'wifi', 'quiet'], categories: ['cafe'],
  },
  {
    match: ['burger', 'burgers', 'fries', 'sandwich', 'wrap', 'fried chicken', 'wings'],
    tags: ['burger', 'sandwich'], categories: ['fastfood'],
  },
  { match: ['pizza'], tags: ['pizza'], categories: ['fastfood'] },
  {
    match: ['kacchi', 'biryani', 'biriyani', 'bengali', 'desi', 'polao', 'tehari', 'kabab', 'khabar'],
    tags: ['kacchi', 'biryani', 'bengali', 'kabab'], categories: ['restaurant'],
  },
  { match: ['sushi', 'japanese', 'ramen'], tags: ['japanese', 'sushi'], categories: ['restaurant'] },
  { match: ['indian', 'curry', 'naan', 'butter chicken'], tags: ['indian', 'curry'], categories: ['restaurant'] },
  { match: ['peri', 'nandos', "nando's"], tags: ['chicken', 'peri peri'], categories: ['restaurant'] },
  {
    match: ['eat', 'food', 'dinner', 'lunch', 'meal', 'hungry', 'restaurant', 'dine'],
    tags: ['dinner'], categories: ['restaurant', 'fastfood'],
  },
  {
    match: ['breakfast', 'brunch', 'paratha', 'morning food'],
    tags: ['breakfast', 'paratha'], categories: ['restaurant', 'cafe'],
  },

  // ── Gaming — this is the one that was missing ────────────────────────────
  {
    match: ['fifa', 'efootball', 'pes', 'ps5', 'ps4', 'playstation', 'xbox', 'console',
            'controller', 'nintendo', 'switch'],
    tags: ['gaming', 'console', 'fifa'], categories: ['gaming'],
  },
  {
    match: ['gaming', 'game', 'games', 'gamer', 'pc', 'rig', 'esports', 'lan',
            'valorant', 'cs2', 'csgo', 'dota', 'league', 'pubg', 'fortnite', 'apex'],
    tags: ['gaming', 'pc', 'esports'], categories: ['gaming'],
  },
  {
    match: ['arcade', 'bowling', 'pool table', 'snooker', 'billiards', 'foosball'],
    tags: ['arcade', 'bowling'], categories: ['gaming'],
  },

  // ── Sport ────────────────────────────────────────────────────────────────
  {
    match: ['football', 'turf', 'futsal', 'soccer', 'five a side', '5 a side', 'seven a side', 'match'],
    tags: ['football', 'turf'], categories: ['sports'],
  },
  { match: ['cricket', 'nets', 'batting'], tags: ['cricket'], categories: ['sports'] },
  {
    match: ['badminton', 'basketball', 'court', 'gym', 'workout', 'tennis', 'indoor sport'],
    tags: ['badminton', 'basketball', 'indoor', 'gym'], categories: ['sports'],
  },

  { match: ['movie', 'cinema', 'film', 'screening', 'showtime'], tags: ['cinema', 'movie'], categories: ['movies'] },
  {
    match: ['park', 'walk', 'jog', 'jogging', 'run', 'outdoor', 'fresh air', 'lake', 'nature', 'green'],
    tags: ['walk', 'outdoor', 'jogging', 'lake'], categories: ['park'],
  },
  {
    match: ['date', 'romantic', 'anniversary', 'girlfriend', 'boyfriend', 'partner', 'special'],
    tags: ['date', 'quiet', 'view'], categories: ['date'],
  },
  {
    match: ['hangout', 'hang out', 'adda', 'chill', 'friends', 'group', 'bunch of us', 'squad'],
    tags: ['friends', 'group'], categories: ['hangout'],
  },
  { match: ['mall', 'shopping', 'shop'], tags: ['mall', 'shopping'], categories: ['hangout'] },

  // ── Grooming ─────────────────────────────────────────────────────────────
  {
    // "saloon" is the common local spelling — match it as well as "salon".
    match: ['salon', 'saloon', 'barber', 'barbershop', 'haircut', 'hair cut', 'shave',
            'beard', 'trim', 'fade', 'grooming'],
    tags: ['salon', 'haircut', 'barber'], categories: ['salon'],
  },
  {
    // Parlours live under Salon — one grooming category, not two.
    match: ['parlour', 'parlor', 'beauty', 'facial', 'threading', 'spa', 'massage',
            'manicure', 'pedicure', 'bridal', 'makeover', 'waxing'],
    tags: ['parlour', 'facial', 'spa'], categories: ['salon'],
  },
]

/**
 * Compound phrases that must win outright. "gaming cafe" contains "cafe", and
 * without this a query for a gaming lounge would drag coffee shops in with it.
 * Checked before KEYWORD_MAP; a hit here pins the category list.
 */
const PHRASE_OVERRIDES = [
  { match: ['gaming cafe', 'gaming café', 'game cafe', 'games cafe', 'pc cafe', 'cyber cafe',
            'gaming lounge', 'gaming zone', 'esports cafe', 'internet cafe'],
    tags: ['gaming', 'pc', 'esports', 'console'], categories: ['gaming'] },
  { match: ['beauty parlour', 'beauty parlor', 'beauty salon'],
    tags: ['parlour', 'facial', 'spa'], categories: ['salon'] },
  { match: ['coffee shop', 'cafe to study', 'study cafe'],
    tags: ['coffee', 'study', 'wifi', 'quiet'], categories: ['cafe'] },
  { match: ['football turf', 'turf booking'],
    tags: ['football', 'turf'], categories: ['sports'] },
]

const VIBE_MAP = [
  { match: ['quiet', 'calm', 'peaceful', 'silent', 'not loud'], tags: ['quiet'] },
  { match: ['cheap', 'budget', 'affordable', 'low cost', 'student', 'broke'], tags: ['cheap'] },
  { match: ['late', 'midnight', 'late night', 'after 11', 'open late'], tags: ['late night'] },
  { match: ['rooftop', 'view', 'skyline'], tags: ['rooftop', 'view'] },
  { match: ['ac', 'air conditioned', 'indoors', 'indoor'], tags: ['ac', 'indoor'] },
  { match: ['free', 'no cost', 'costs nothing'], tags: ['free'] },
]

/**
 * Pulls structured filters out of a plain-English question.
 *   "best places to play fifa"
 *     → { categories: ['gaming'], tags: ['gaming','console','fifa'], understood: true }
 *
 * `understood` is the important field: when it's false we must NOT fall back to
 * "top rated nearby", because that's how a restaurant ends up answering a
 * question about video games.
 */
export function parseQuery(raw) {
  const q = ` ${raw.toLowerCase().replace(/[^\w\s৳']/g, ' ')} `
  const out = { tags: [], categories: [], maxPrice: null, radius: null, openNow: false }

  const hit = (term) => q.includes(` ${term} `) || q.includes(` ${term}s `) || q.includes(term)

  // A compound phrase pins the category outright and skips the loose keywords.
  const override = PHRASE_OVERRIDES.find((e) => e.match.some((m) => q.includes(m)))
  if (override) {
    out.tags.push(...override.tags)
    out.categories.push(...override.categories)
  } else {
    for (const entry of KEYWORD_MAP) {
      if (entry.match.some(hit)) {
        out.tags.push(...entry.tags)
        out.categories.push(...entry.categories)
      }
    }
  }
  for (const entry of VIBE_MAP) {
    if (entry.match.some(hit)) out.tags.push(...entry.tags)
  }

  // "under 300", "below 500 taka", "within 1000tk", "max 250"
  const price = q.match(/(?:under|below|within|less than|max|upto|up to|budget of)\s*(?:tk|৳|bdt|taka)?\s*(\d{2,5})/)
  if (price) out.maxPrice = parseInt(price[1], 10)

  // "within 2km", "1 km around me", "500m"
  const km = q.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometer|kilometre)/)
  const m = q.match(/(\d{3,4})\s*(?:m|meter|metre)\b/)
  if (km) out.radius = parseFloat(km[1]) * 1000
  else if (m) out.radius = parseInt(m[1], 10)

  if (/open now|right now|currently open|open at this|tonight|today/.test(q)) out.openNow = true

  out.tags = [...new Set(out.tags)]
  out.categories = [...new Set(out.categories)]
  out.understood = out.categories.length > 0 || out.tags.length > 0

  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// Ranking
// ─────────────────────────────────────────────────────────────────────────────

/** Fraction of the query's tags this place matches, 0..1. */
function tagMatch(place, tags) {
  if (!tags.length) return 0.5
  const hay = new Set([...place.tags, ...place.category])
  const hits = tags.filter((t) => hay.has(t)).length
  return hits / tags.length
}

/** 1.0 fully inside budget, tapering to 0 as it goes over. */
function budgetFit(place, maxPrice) {
  if (maxPrice == null) return 0.6
  if (place.priceMin <= maxPrice) return 1
  const over = (place.priceMin - maxPrice) / maxPrice
  return Math.max(0, 1 - over)
}

/** Recent reviews should count for more than three-year-old ones. */
function recency(place) {
  if (!place.reviews.length) return 0.3
  const newest = place.reviews.map((r) => new Date(r.date).getTime()).sort((a, b) => b - a)[0]
  const days = (Date.parse('2026-07-28') - newest) / 86400000
  return Math.max(0.2, 1 - days / 365)
}

export function scorePlace(place, ctx) {
  const { userLocation, radius, filters, hour } = ctx
  const dist = distanceMeters(userLocation, place)
  const stars = bayesianScore(place.reviews)

  const distanceDecay = Math.exp(-dist / (radius || 2000))
  const normStars = (stars - 1) / 4 // 1..5 → 0..1
  const relevance = tagMatch(place, filters.tags || [])

  // Relevance carries the most weight — answering the right question beats
  // answering the wrong one well.
  const score =
    0.3 * relevance +
    0.25 * normStars +
    0.2 * distanceDecay +
    0.15 * budgetFit(place, filters.maxPrice) +
    0.1 * recency(place)

  return { place, dist, stars, score, relevance, open: isOpenAt(place, hour) }
}

/** Does this place belong to any of the requested categories? */
function inCategories(place, categories) {
  return !categories?.length || place.category.some((c) => categories.includes(c))
}

export function searchPlaces(places, ctx) {
  const { userLocation, radius, filters, hour } = ctx

  return places
    .filter((p) => {
      if (distanceMeters(userLocation, p) > radius) return false
      // Category is a hard gate, from the chips or from the parsed query.
      if (!inCategories(p, filters.categories)) return false
      if (filters.maxBudget != null && p.priceMin > filters.maxBudget) return false
      if (filters.openNow && !isOpenAt(p, hour)) return false
      return true
    })
    .map((p) => scorePlace(p, ctx))
    // Second gate: if the query carried meaning, a place that matches none of
    // it is not an answer, however well rated it is.
    .filter((r) => !filters.strictRelevance || r.relevance > 0)
    .sort((a, b) => b.score - a.score)
}

// ─────────────────────────────────────────────────────────────────────────────
// Answer generation
// ─────────────────────────────────────────────────────────────────────────────

function bestQuote(place) {
  const positive = place.reviews.filter((r) => r.stars >= 4)
  const source = positive.length ? positive : place.reviews
  const pick = source.reduce((a, b) => (b.body.length > a.body.length ? b : a), source[0])
  if (!pick) return null
  return { text: pick.body.split(/(?<=[.!?])\s/)[0], user: pick.user }
}

/** Surfaces the strongest complaint so negative reviews aren't just averaged away. */
function caveat(place) {
  const negative = place.reviews.filter((r) => r.stars <= 2)
  if (!negative.length) return null
  return negative[0].body.split(/(?<=[.!?])\s/)[0]
}

const SUBJECT_LABEL = {
  gaming: 'gaming', console: 'gaming', fifa: 'FIFA', pc: 'gaming', esports: 'gaming',
  pastry: 'pastry', cake: 'dessert', dessert: 'dessert',
  coffee: 'café', study: 'study', quiet: 'quiet',
  burger: 'burger', pizza: 'pizza', kacchi: 'kacchi', biryani: 'biryani',
  football: 'football turf', turf: 'turf', cricket: 'cricket',
  badminton: 'badminton', cinema: 'cinema', movie: 'movie',
  walk: 'park', outdoor: 'outdoor', date: 'date', friends: 'hangout',
  salon: 'salon', haircut: 'haircut', barber: 'barber',
  parlour: 'beauty parlour', facial: 'parlour', spa: 'spa',
}

function subjectFor(parsed) {
  for (const t of parsed.tags) if (SUBJECT_LABEL[t]) return SUBJECT_LABEL[t]
  return 'nearby'
}

export function buildAnswer(query, results, ctx) {
  const parsed = ctx.parsed

  // Nothing recognised — say so plainly instead of guessing.
  if (!parsed.understood) {
    return {
      unknown: true,
      headline: `I couldn't tell what you're looking for in "${query}".`,
      body: 'Try naming the thing — food, café, pastry, burger, kacchi, gaming, FIFA, turf, badminton, cinema, park, or date spot. You can add a budget too, like "under ৳500".',
      picks: [],
    }
  }

  const top = results.slice(0, 3)
  const subject = subjectFor(parsed)

  if (!top.length) {
    return {
      headline: `No ${subject} spots matched within ${formatDistance(ctx.radius)}.`,
      body: parsed.maxPrice
        ? `Nothing in range under ৳${parsed.maxPrice}. Try raising the budget or widening the radius.`
        : `Try widening the radius — there's nothing in this category nearby.`,
      picks: [],
    }
  }

  const best = top[0]
  const headline = `${top.length} ${subject} option${top.length > 1 ? 's' : ''}${
    parsed.maxPrice ? ` under ৳${parsed.maxPrice}` : ''
  } within ${formatDistance(ctx.radius)}.`

  const body =
    `${best.place.name} is your best bet — ${best.stars.toFixed(1)}★ from ` +
    `${best.place.reviews.length} review${best.place.reviews.length > 1 ? 's' : ''}, ` +
    `${formatDistance(best.dist)} away, ৳${best.place.priceMin}–${best.place.priceMax} per person.`

  const picks = top.map((r) => ({
    id: r.place.id,
    name: r.place.name,
    stars: r.stars,
    dist: r.dist,
    open: r.open,
    price: `৳${r.place.priceMin}–${r.place.priceMax}`,
    why: bestQuote(r.place)?.text ?? r.place.blurb,
    caveat: caveat(r.place),
  }))

  return { headline, body, picks }
}

/**
 * Entry point used by the UI. A natural-language query overrides the chips —
 * asking for FIFA should search gaming cafés even if "Cafés" is ticked.
 */
export function runNaturalSearch(query, places, ctx) {
  const parsed = parseQuery(query)

  if (!parsed.understood) {
    return {
      results: [],
      answer: buildAnswer(query, [], { ...ctx, parsed }),
      parsed,
      radius: ctx.radius,
    }
  }

  const radius = parsed.radius ?? ctx.radius
  const filters = {
    tags: parsed.tags,
    maxPrice: parsed.maxPrice,
    maxBudget: parsed.maxPrice ?? ctx.filters.maxBudget,
    categories: parsed.categories.length ? parsed.categories : ctx.filters.categories,
    openNow: parsed.openNow || ctx.filters.openNow,
    strictRelevance: true,
  }

  const searchCtx = { ...ctx, radius, filters, parsed }
  let results = searchPlaces(places, searchCtx)

  // If the strict pass found nothing in range, widen once before giving up —
  // better to say "nearest match is 3km away" than "nothing found".
  if (!results.length && radius < 5000) {
    const wide = { ...searchCtx, radius: 5000 }
    results = searchPlaces(places, wide)
    if (results.length) {
      return { results, answer: buildAnswer(query, results, wide), parsed, radius: 5000 }
    }
  }

  return { results, answer: buildAnswer(query, results, searchCtx), parsed, radius }
}
