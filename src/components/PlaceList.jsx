import { formatDistance, walkMinutes } from '../lib/geo'
import { CITY } from '../data/places'

export default function PlaceList({ results, selectedId, onSelect, emptyHint }) {
  if (!results.length) {
    return (
      <div className="empty">
        <p className="empty__title">Nothing in range</p>
        <p className="empty__sub">{emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="list">
      {results.map(({ place, dist, stars, open }) => (
        <button
          key={place.id}
          className={`card ${place.id === selectedId ? 'card--on' : ''}`}
          onClick={() => onSelect(place.id)}
        >
          <div className="card__head">
            <h3>
              {place.name}
              {place.userAdded && <span className="chip chip--new">Community</span>}
            </h3>
            <span className="card__stars">★ {stars.toFixed(1)}</span>
          </div>

          <p className="card__blurb">{place.blurb}</p>

          <div className="card__meta">
            <span>{formatDistance(dist)} · {walkMinutes(dist)} min</span>
            <span>
              {place.priceMin === 0 && place.priceMax === 0
                ? 'Free'
                : `${CITY.currency}${place.priceMin}–${place.priceMax}`}
            </span>
            <span className={open ? 'ok' : 'muted'}>{open ? 'Open now' : 'Closed'}</span>
            <span className="muted">{place.reviews.length} reviews</span>
          </div>
        </button>
      ))}
    </div>
  )
}
