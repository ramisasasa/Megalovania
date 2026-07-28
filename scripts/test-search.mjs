// Quick sanity harness for the query engine. `node scripts/test-search.mjs`
import { runNaturalSearch, parseQuery } from '../src/lib/search.js'
import { SEED_PLACES, CITY } from '../src/data/places.js'

const ctx = {
  userLocation: CITY.center,
  radius: 2000,
  hour: 19,
  filters: { categories: [], maxBudget: 3500, openNow: false, tags: [] },
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

console.log(`\n${'─'.repeat(60)}`)
console.log(failures === 0 ? `All ${QUERIES.length} queries passed.` : `${failures} of ${QUERIES.length} FAILED.`)
process.exit(failures === 0 ? 0 : 1)
