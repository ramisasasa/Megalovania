import { SansDialog } from '../components/Sans'
import { formatDistance } from '../lib/geo'
import { CITY } from '../data/places'

const RADII = [500, 1000, 2000, 5000]

export default function SettingsScreen({
  settings, setSettings, favourites, places, onSelectPlace, onRemoveFavourite,
  onBack, onReset,
}) {
  const favPlaces = favourites
    .map((id) => places.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <div className="screen">
      <button className="back" onClick={onBack}>← back</button>

      <SansDialog
        text="set your range once and i'll stop asking. anonymity's here too, if you'd rather not sign your reviews."
        typing={false}
      />

      <div className="section">Proximity</div>
      <div className="filters__label">
        <span>default search range</span>
        <span className="filters__value">{formatDistance(settings.proximity)}</span>
      </div>
      <div className="seg" style={{ marginTop: 6 }}>
        {RADII.map((r) => (
          <button
            key={r}
            className={settings.proximity === r ? 'seg__btn seg__btn--on' : 'seg__btn'}
            onClick={() => setSettings((s) => ({ ...s, proximity: r }))}
          >
            {r < 1000 ? `${r}m` : `${r / 1000}km`}
          </button>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>
        everything — home, search and Sans — starts from this range.
      </p>

      <div className="section">Privacy</div>
      <label className="toggle toggle--row">
        <input
          type="checkbox"
          checked={settings.anonymous}
          onChange={(e) => setSettings((s) => ({ ...s, anonymous: e.target.checked }))}
        />
        <span>
          <strong>post anonymously</strong>
          <em>
            {settings.anonymous
              ? 'your reviews show as "anonymous". nobody sees your name.'
              : 'your reviews are signed with your display name.'}
          </em>
        </span>
      </label>

      <label className="toggle toggle--row" style={{ marginTop: 8 }}>
        <input
          type="checkbox"
          checked={settings.openOnly}
          onChange={(e) => setSettings((s) => ({ ...s, openOnly: e.target.checked }))}
        />
        <span>
          <strong>hide closed places</strong>
          <em>only show spots that are open at the time you're searching.</em>
        </span>
      </label>

      <div className="section">Favourite spots ({favPlaces.length})</div>
      {favPlaces.length === 0 ? (
        <p className="muted" style={{ fontSize: 13 }}>
          nothing saved yet. tap ⭐ on any place to keep it here.
        </p>
      ) : (
        <div className="rows">
          {favPlaces.map((p) => (
            <div key={p.id} className="row">
              <span className="row__icon">⭐</span>
              <button
                className="row__label"
                style={{ background: 'none', border: 0, textAlign: 'left', padding: 0 }}
                onClick={() => onSelectPlace(p.id)}
              >
                {p.name}
                <em>{p.category.join(' · ')}</em>
              </button>
              <button className="btn btn--sm btn--ghost" onClick={() => onRemoveFavourite(p.id)}>
                remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="section">Location</div>
      <div className="row">
        <span className="row__icon">📍</span>
        <span className="row__label">
          area
          <em>used when GPS is unavailable</em>
        </span>
        <span className="row__value">{CITY.area}</span>
      </div>

      <div className="section">Danger zone</div>
      <button className="btn btn--danger btn--full" onClick={onReset}>
        reset everything &amp; sign out
      </button>
      <p className="muted" style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
        clears reviews, saved spots and your profile from this browser.
      </p>

      <div style={{ height: 10 }} />
    </div>
  )
}
