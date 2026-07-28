import MapView from '../components/MapView'
import PlaceList from '../components/PlaceList'
import { CATEGORIES, CITY } from '../data/places'
import { formatDistance } from '../lib/geo'

const RADII = [500, 1000, 2000, 5000]
const BUDGET_CAP = 3500

function budgetLabel({ minBudget, maxBudget }) {
  const c = CITY.currency
  if (minBudget == null && maxBudget == null) return 'any'
  if (minBudget == null) return `≤ ${c}${maxBudget}`
  if (maxBudget == null) return `≥ ${c}${minBudget}`
  return `${c}${minBudget} – ${c}${maxBudget}`
}

export default function ExploreScreen({
  userLocation, radius, setRadius, filters, setFilters,
  results, selectedId, onSelect, pinMode, setPinMode, onMapClick,
}) {
  function toggleCategory(id) {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }))
  }

  return (
    <div
      className="screen screen--flush"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <div style={{
        position: 'relative', height: 250, flexShrink: 0,
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
                  type="number" min={0} max={BUDGET_CAP} step={50}
                  placeholder="any"
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
                  type="number" min={0} max={BUDGET_CAP} step={50}
                  placeholder="any"
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
            <button className="chip" onClick={() => setFilters((f) => ({ ...f, categories: [], tags: [] }))}>
              clear
            </button>
          )}
        </div>

        <div className="section">
          {results.length} result{results.length === 1 ? '' : 's'}
        </div>

        <button
          className={pinMode ? 'btn btn--gold btn--full' : 'btn btn--ghost btn--full'}
          onClick={() => setPinMode(!pinMode)}
          style={{ marginBottom: 10 }}
        >
          {pinMode ? '× cancel pin' : '+ pin a new spot on the map'}
        </button>

        <PlaceList
          results={results}
          selectedId={selectedId}
          onSelect={onSelect}
          emptyHint={`nothing within ${formatDistance(radius)} matches. widen the range or drop a filter.`}
        />
      </div>
    </div>
  )
}
