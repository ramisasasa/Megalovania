import { SansDialog } from '../components/Sans'
import PlaceList from '../components/PlaceList'
import { formatDistance } from '../lib/geo'

export default function RecommendedScreen({
  recommended, mostVisited, radius, onSelect, onNavigate,
}) {
  return (
    <div className="screen">
      <SansDialog
        text="the crowd's verdict. best rated first, most walked-into after."
        sub={`scoped to ${formatDistance(radius)} around you — change the range in settings.`}
        typing={false}
      />

      <div className="section">Most recommended</div>
      <PlaceList
        results={recommended}
        onSelect={onSelect}
        emptyHint={`nothing within ${formatDistance(radius)}. widen your proximity in settings.`}
      />

      <div className="section">Most visited</div>
      {mostVisited.length === 0 ? (
        <div className="empty">
          <p className="empty__title">No visits yet</p>
          <p className="empty__sub">
            every place you open counts as a visit. go poke around.
          </p>
          <button className="btn btn--gold" onClick={() => onNavigate('explore')}>
            start exploring
          </button>
        </div>
      ) : (
        <div className="list">
          {mostVisited.map(({ place, visits }) => (
            <button key={place.id} className="card" onClick={() => onSelect(place.id)}>
              <div className="card__head">
                <h3>{place.name}</h3>
                <span className="card__stars">↺ {visits}×</span>
              </div>
              <p className="card__blurb">{place.blurb}</p>
            </button>
          ))}
        </div>
      )}

      <div style={{ height: 10 }} />
    </div>
  )
}
