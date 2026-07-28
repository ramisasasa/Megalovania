import { SansDialog } from '../components/Sans'
import { CATEGORIES } from '../data/places'

const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

/** Contributions → LV, because this is an Undertale skin and LV had to happen. */
function levelFor(points) {
  return Math.max(1, Math.floor(points / 50) + 1)
}

export default function ProfileScreen({
  user, reviews, userPlaces, favourites, places,
  onEdit, onInterests, onSettings, onSelectPlace, onSignIn,
}) {
  if (!user) {
    return (
      <div className="screen">
        <SansDialog text="you're browsing as a guest. sign in with your iub email if you want to leave reviews." typing={false} />
        <button className="btn btn--gold btn--full" onClick={onSignIn}>sign in</button>
      </div>
    )
  }

  const lv = levelFor(user.points)
  const toNext = 50 - (user.points % 50)
  const pct = ((user.points % 50) / 50) * 100

  return (
    <div className="screen">
      <div className="profile__head">
        <div className="profile__avatar">{user.avatar}</div>
        <div style={{ minWidth: 0 }}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p style={{ color: 'var(--dim)' }}>📍 {user.area}</p>
        </div>
      </div>

      <div className="lv">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>LV {lv}</span>
            <span className="gold">{user.points} G</span>
          </div>
          <div className="lv__bar"><div className="lv__fill" style={{ width: `${pct}%` }} /></div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 5 }}>
            {toNext} G to LV {lv + 1} — reviews earn 10, new spots earn 25
          </div>
        </div>
      </div>

      <div className="stats" style={{ marginTop: 10 }}>
        <div><strong>{reviews.length}</strong><span>reviews</span></div>
        <div><strong>{userPlaces.length}</strong><span>spots added</span></div>
        <div><strong>{favourites.length}</strong><span>saved</span></div>
      </div>

      <div className="section">Interests</div>
      {user.interests.length === 0 ? (
        <button className="btn btn--ghost btn--full" onClick={onInterests}>
          + pick what you're into
        </button>
      ) : (
        <>
          <div className="chips">
            {user.interests.map((i) => (
              <span key={i} className="chip chip--on">
                {LABEL[i]?.icon} {LABEL[i]?.label ?? i}
              </span>
            ))}
          </div>
          <button className="btn btn--ghost btn--full btn--sm" style={{ marginTop: 8 }} onClick={onInterests}>
            edit interests
          </button>
        </>
      )}

      <div className="section">Account</div>
      <div className="rows">
        <button className="row" onClick={onEdit}>
          <span className="row__icon">✏️</span>
          <span className="row__label">edit profile<em>name, email, number, avatar, location</em></span>
          <span className="row__arrow">›</span>
        </button>
        <button className="row" onClick={onInterests}>
          <span className="row__icon">🎯</span>
          <span className="row__label">interests<em>tunes what gets recommended</em></span>
          <span className="row__value">{user.interests.length}</span>
          <span className="row__arrow">›</span>
        </button>
        <button className="row" onClick={onSettings}>
          <span className="row__icon">⚙️</span>
          <span className="row__label">settings<em>proximity, privacy, favourites</em></span>
          <span className="row__arrow">›</span>
        </button>
      </div>

      <div className="section">Your reviews</div>
      {reviews.length === 0 ? (
        <p className="muted" style={{ fontSize: 13 }}>you haven't reviewed anything yet.</p>
      ) : (
        <div className="reviews">
          {reviews.map((r, i) => (
            <button
              key={i}
              className="review"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => onSelectPlace(r.placeId)}
            >
              <div className="review__head">
                <strong style={{ fontWeight: 400 }}>
                  {places.find((p) => p.id === r.placeId)?.name ?? 'unknown'}
                </strong>
                <span className="review__stars">{'★'.repeat(r.stars)}</span>
                <span className="review__date">{r.date}</span>
              </div>
              <p>{r.body}</p>
            </button>
          ))}
        </div>
      )}

      <div style={{ height: 10 }} />
    </div>
  )
}
