// Quick sanity harness for the query engine. `node scripts/test-search.mjs`
import { runNaturalSearch, parseQuery } from '../src/lib/search.js'
import { typicalPrice, isOpenAt } from '../src/lib/geo.js'
import { SEED_PLACES, CITY } from '../src/data/places.js'

const ctx = {
  userLocation: CITY.center,
  radius: 2000,
  hour: 19,
  filters: { categories: [], minBudget: null, maxBudget: null, openNow: false, tags: [] },
}

const QUERIES = [
  ['suggest me a gaming cafe nearby', 'gaming'],
  ['best places to play fifa', 'gaming'],
  ['where can I get good pastries under ৳200', 'bakery'],
  ['quiet cafe to study near me', 'cafe'],
  ['football turf for tonight', 'sports'],
  ['a salon for a haircut', 'salon'],
  ['saloon near me', 'salon'],
  ['beauty parlour for a facial', 'salon'],
  ['cheap burger within 1km', 'fastfood'],
  ['date spot under 800', 'date'],
  ['badminton court', 'sports'],
  ['asdkjh qwerty nonsense', null],
]

let failures = 0

for (const [q, expected] of QUERIES) {
  const parsed = parseQuery(q)
  const { results, answer } = runNaturalSearch(q, SEED_PLACES, ctx)
  const top = results[0]
  const ok = expected === null
    ? !parsed.understood
    : top && top.place.category.includes(expected)

  if (!ok) failures += 1

  console.log(`\n${ok ? 'PASS' : 'FAIL'}  "${q}"`)
  console.log(`      cats=[${parsed.categories}] price=${parsed.maxPrice} understood=${parsed.understood}`)
  console.log(`      → ${answer.headline}`)
  results.slice(0, 3).forEach((r, i) =>
    console.log(`      ${i + 1}. ${r.place.name}  [${r.place.category.join('/')}]  ${r.stars.toFixed(1)}★  rel=${r.relevance.toFixed(2)}`)
  )
  if (!results.length) console.log('      (no results)')
}

// ── Budget honesty ──────────────────────────────────────────────────────────
// The bug this guards: "under ৳800" used to return ৳800–1100 places because the
// gate compared priceMin. Every result must be affordable on typical spend.
console.log(`\n${'─'.repeat(60)}\nBUDGET\n`)

for (const [q, cap] of [['date spot under 800', 800], ['pastries under ৳200', 200], ['cheap burger under 300', 300]]) {
  const { results } = runNaturalSearch(q, SEED_PLACES, ctx)
  const over = results.filter((r) => typicalPrice(r.place) > cap)
  const ok = over.length === 0
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  "${q}" — ${results.length} results, all typical spend ≤ ৳${cap}`)
  over.forEach((r) =>
    console.log(`        OVER: ${r.place.name} ৳${r.place.priceMin}–${r.place.priceMax} (typical ৳${typicalPrice(r.place)})`)
  )
}

// ── Openness ranking ────────────────────────────────────────────────────────
// At 3am almost everything is shut; whatever opens soonest should lead, and an
// open place must never rank below a closed one with otherwise equal standing.
console.log(`\n${'─'.repeat(60)}\nOPEN / CLOSED\n`)

for (const hour of [11, 15, 22, 3]) {
  const { results } = runNaturalSearch('somewhere to eat', SEED_PLACES, { ...ctx, hour })
  const flags = results.map((r) => isOpenAt(r.place, hour))
  const firstClosed = flags.indexOf(false)
  const openAfterClosed = firstClosed !== -1 && flags.slice(firstClosed).includes(true)
  const ok = !openAfterClosed
  if (!ok) failures += 1
  const openN = flags.filter(Boolean).length
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(hour).padStart(2, '0')}:00 — ${openN}/${results.length} open, open places ranked first`)
}

console.log(`\n${'─'.repeat(60)}`)
console.log(failures === 0 ? 'All checks passed.' : `${failures} check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
