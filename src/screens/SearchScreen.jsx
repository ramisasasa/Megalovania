import { useState } from 'react'
import MapView from '../components/MapView'
import PlaceList from '../components/PlaceList'
import { SansDialog } from '../components/Sans'
import { CATEGORIES, CITY } from '../data/places'
import { formatDistance, walkMinutes } from '../lib/geo'

// One screen for both ways of finding a place: ask Sans in plain english, or
// drive the filters yourself. They were separate tabs answering the same
// question, and the map already renders whichever result set is live.

const RADII = [500, 1000, 2000, 5000]
const BUDGET_CAP = 3500

const EXAMPLES = [
  'gaming cafe nearby',
  'pastries under ৳200',
  'quiet cafe to study',
  'football turf tonight',
  'date spot under ৳800',
]

function budgetLabel({ minBudget, maxBudget }) {
  const c = CITY.currency
  if (minBudget == null && maxBudget == null) return 'any'
  if (minBudget == null) return `≤ ${c}${maxBudget}`
  if (maxBudget == null) return `≥ ${c}${minBudget}`
  return `${c}${minBudget} – ${c}${maxBudget}`
}

/** Rewrites the ranked answer in Sans's voice — lowercase, flat, unbothered. */
function sansLine(answer, area) {
  if (!answer) return null
  if (answer.unknown) {
    return "i got nothing. name the thing — food, pastry, gaming, turf, salon, parlour, cinema, park. a budget helps too."
  }
  if (!answer.picks.length) {
    return `nothing matched around ${area.toLowerCase()}. widen the range or raise the budget.`
  }
  const [best] = answer.picks
  return `"${best.name}" is your pick. ${best.stars.toFixed(1)} stars, ${formatDistance(best.dist)} out, ${best.price} a head.`
}

export default function SearchScreen({
  userLocation, radius, setRadius, filters, setFilters,
  results, selectedId, onSelect, pinMode, setPinMode, onMapClick,
  answer, thinking, onSearch, onClear, area, recents,
}) {
  const [q, setQ] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (q.trim()) onSearch(q.trim())
  }

  function runExample(text) {
    setQ(text)
    onSearch(text)
  }

  function clearAnswer() {
    onClear()
    setQ('')
  }

  function toggleCategory(id) {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }))
  }

  const activeCount =
    filters.categories.length +
    (filters.minBudget != null || filters.maxBudget != null ? 1 : 0) +
    (filters.openNow ? 1 : 0)

  return (
    <div
      className="screen screen--flush"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <div style={{
        position: 'relative', height: 220, flexShrink: 0,
        overflow: 'hidden', borderBottom: '2px solid #fff',
      }}>
        <MapView
          center={userLocation}
          radius={radius}
          results={results}
          selectedId={selectedId}
          onSelect={onSelect}
          pinMode={pinMode}
          onMapClick={onMapClick}
        />
      </div>

      <div style={{ padding: 14, overflowY: 'auto', flex: 1 }}>
        <form className="askbar" onSubmit={submit}>
          <span className="soul soul--pulse" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ask, or use the filters below"
          />
          <button className="askbar__go" disabled={!q.trim()}>ASK</button>
        </form>

        {thinking && (
          <div className="dialog dialog--sans" style={{ marginTop: 12 }}>
            <div className="dialog__body">
              <p className="dialog__text">
                <span className="star">*</span>
                hang on. <span className="dots"><i /><i /><i /></span>
              </p>
            </div>
          </div>
        )}

        {!thinking && answer && (
          <div style={{ marginTop: 12 }}>
            <SansDialog
              text={sansLine(answer, area)}
              sub={answer.unknown ? undefined : answer.headline}
              type={answer.unknown ? 'warn' : 'sans'}
            />

            {answer.picks.map((pick, i) => (
              <button key={pick.id} className="pick" onClick={() => onSelect(pick.id)}>
                <span className="pick__rank">{i + 1}</span>
                <span className="pick__main">
                  <span className="pick__title">
                    {pick.name}
                    <span className="pick__stars">★ {pick.stars.toFixed(1)}</span>
                    {!pick.open && (
                      <span className="chip chip--closed">
                        {pick.opensAt ? `OPENS ${pick.opensAt.toUpperCase()}` : 'CLOSED'}
                      </span>
                    )}
                  </span>
                  <span className="pick__meta">
                    {pick.price}
                    {pick.typical != null && ` (≈৳${pick.typical} typical)`}
                    {' · '}{formatDistance(pick.dist)} · {walkMinutes(pick.dist)} min walk
                  </span>
                  <span className="pick__why">{pick.why}</span>
                  {pick.caveat && <span className="pick__caveat">! {pick.caveat}</span>}
                </span>
              </button>
            ))}

            <button className="btn btn--ghost btn--full" onClick={clearAnswer}>
              clear · back to browsing
            </button>
          </div>
        )}

        {!answer && !thinking && (
          <div className="suggests" style={{ marginTop: 10 }}>
            {EXAMPLES.map((ex) => (
              <button key={ex} className="suggest" onClick={() => runExample(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}

        {recents.length > 0 && !answer && !thinking && (
          <div className="rows" style={{ marginTop: 4 }}>
            {recents.slice(0, 3).map((r, i) => (
              <button key={i} className="recent" onClick={() => runExample(r)}>
                <span className="recent__icon">↺</span>
                <span className="recent__text">{r}</span>
              </button>
            ))}
          </div>
        )}

        <button
          className="disclose"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
        >
          <span>{showFilters ? '▾' : '▸'} Filters</span>
          {activeCount > 0 && <span className="disclose__count">{activeCount} on</span>}
        </button>

        {showFilters && (
          <>
            <div className="filters">
              <div>
                <div className="filters__label">
                  <span>Proximity</span>
                  <span className="filters__value">{formatDistance(radius)}</span>
                </div>
                <div className="seg" style={{ marginTop: 6 }}>
                  {RADII.map((r) => (
                    <button
                      key={r}
                      className={radius === r ? 'seg__btn seg__btn--on' : 'seg__btn'}
                      onClick={() => setRadius(r)}
                    >
                      {r < 1000 ? `${r}m` : `${r / 1000}km`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="filters__label">
                  <span>Budget per person</span>
                  <span className="filters__value">{budgetLabel(filters)}</span>
                </div>
                <input
                  type="range" min={0} max={BUDGET_CAP} step={100}
                  value={filters.maxBudget ?? BUDGET_CAP}
                  onChange={(e) => {
                    const v = +e.target.value
                    setFilters((f) => ({ ...f, maxBudget: v >= BUDGET_CAP ? null : v }))
                  }}
                  className="slider"
                />
                <div className="range">
                  <label className="range__field">
                    <span>min {CITY.currency}</span>
                    <input
                      type="number" min={0} max={BUDGET_CAP} step={50} placeholder="any"
                      value={filters.minBudget ?? ''}
                      onChange={(e) => setFilters((f) => ({
                        ...f, minBudget: e.target.value === '' ? null : +e.target.value,
                      }))}
                    />
                  </label>
                  <span className="range__dash">–</span>
                  <label className="range__field">
                    <span>max {CITY.currency}</span>
                    <input
                      type="number" min={0} max={BUDGET_CAP} step={50} placeholder="any"
                      value={filters.maxBudget ?? ''}
                      onChange={(e) => setFilters((f) => ({
                        ...f, maxBudget: e.target.value === '' ? null : +e.target.value,
                      }))}
                    />
                  </label>
                  {(filters.minBudget != null || filters.maxBudget != null) && (
                    <button
                      className="range__clear"
                      onClick={() => setFilters((f) => ({ ...f, minBudget: null, maxBudget: null }))}
                    >
                      clear
                    </button>
                  )}
                </div>
              </div>

              <label className="toggle">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => setFilters((f) => ({ ...f, openNow: e.target.checked }))}
                />
                <span>open right now only</span>
              </label>
            </div>

            <div className="section">Categories</div>
            <div className="chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={filters.categories.includes(c.id) ? 'chip chip--on' : 'chip'}
                  onClick={() => toggleCategory(c.id)}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
              {filters.categories.length > 0 && (
                <button
                  className="chip"
                  onClick={() => setFilters((f) => ({ ...f, categories: [], tags: [] }))}
                >
                  clear
                </button>
              )}
            </div>

            <button
              className={pinMode ? 'btn btn--gold btn--full' : 'btn btn--ghost btn--full'}
              onClick={() => setPinMode(!pinMode)}
              style={{ marginTop: 10 }}
            >
              {pinMode ? '× cancel pin' : '+ pin a new spot on the map'}
            </button>
          </>
        )}

        <div className="section">
          {answer && !answer.unknown ? 'All matches' : 'Nearby'} ·{' '}
          {results.length} result{results.length === 1 ? '' : 's'}
        </div>

        <PlaceList
          results={results}
          selectedId={selectedId}
          onSelect={onSelect}
          emptyHint={`nothing within ${formatDistance(radius)} matches. widen the range or drop a filter.`}
        />

        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
