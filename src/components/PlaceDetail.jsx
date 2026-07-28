import { useState } from 'react'
import { formatDistance, walkMinutes, bayesianScore, isOpenAt } from '../lib/geo'
import { CITY, CATEGORIES } from '../data/places'

const WORD_LIMIT = 500
const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function ReviewForm({ onSubmit, canReview, reason }) {
  const [stars, setStars] = useState(0)
  const [body, setBody] = useState('')
  const [hover, setHover] = useState(0)
  const words = countWords(body)
  const over = words > WORD_LIMIT

  if (!canReview) return <p className="detail__locked">{reason}</p>

  function submit(e) {
    e.preventDefault()
    if (!stars || over) return
    onSubmit({ stars, body: body.trim() })
    setStars(0)
    setBody('')
  }

  return (
    <form className="rform" onSubmit={submit}>
      <div className="rform__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= (hover || stars) ? 'star star--on' : 'star'}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
        <span className="rform__hint">
          {stars ? `${stars} / 5` : 'Tap to rate'}
        </span>
      </div>

      <textarea
        rows={4}
        placeholder="What was your experience? Be specific — prices, timing, what to order, what to avoid."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="rform__foot">
        <span className={over ? 'wc wc--over' : 'wc'}>
          {words} / {WORD_LIMIT} words
        </span>
        <button className="btn btn--primary" disabled={!stars || over}>
          Post review
        </button>
      </div>
    </form>
  )
}

export default function PlaceDetail({
  place, userLocation, hour, onClose, onReview, user,
  isFavourite, onToggleFavourite,
}) {
  if (!place) return null

  const dist = place.__dist
  const stars = bayesianScore(place.reviews)
  const open = isOpenAt(place, hour)
  const nearEnough = dist <= 300

  const alreadyReviewed = place.reviews.some((r) => user && r.userEmail === user.email)

  let canReview = true
  let reason = ''
  if (!user) {
    canReview = false
    reason = 'Sign in with your IUB email to leave a review.'
  } else if (alreadyReviewed) {
    canReview = false
    reason = 'You have already reviewed this place.'
  }

  const negatives = place.reviews.filter((r) => r.stars <= 2)

  return (
    <div className="detail">
      <div className="detail__top">
        <div>
          <h2>{place.name}</h2>
          <div className="detail__cats">
            {place.category.map((c) => (
              <span key={c} className="chip chip--ghost">
                {LABEL[c]?.icon} {LABEL[c]?.label ?? c}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            className="detail__close"
            onClick={() => onToggleFavourite(place.id)}
            style={{ color: isFavourite ? 'var(--gold)' : undefined,
                     borderColor: isFavourite ? 'var(--gold)' : undefined }}
            aria-label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
            title={isFavourite ? 'Saved' : 'Save'}
          >
            {isFavourite ? '★' : '☆'}
          </button>
          <button className="detail__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
      </div>

      <div className="detail__stats">
        <div><strong>★ {stars.toFixed(1)}</strong><span>{place.reviews.length} reviews</span></div>
        <div>
          <strong>
            {place.priceMin === 0 && place.priceMax === 0
              ? 'Free'
              : `${CITY.currency}${place.priceMin}–${place.priceMax}`}
          </strong>
          <span>{place.priceNote ?? 'per person'}</span>
        </div>
        <div><strong>{formatDistance(dist)}</strong><span>{walkMinutes(dist)} min walk</span></div>
        <div>
          <strong className={open ? 'ok' : 'muted'}>{open ? 'Open' : 'Closed'}</strong>
          <span>{String(place.hours.open).padStart(2, '0')}:00–{String(place.hours.close % 24).padStart(2, '0')}:00</span>
        </div>
      </div>

      <p className="detail__blurb">{place.blurb}</p>

      {negatives.length > 0 && (
        <div className="warn">
          <strong>Worth knowing —</strong> {negatives.length} recent reviewer
          {negatives.length > 1 ? 's' : ''} rated this 2★ or below.
        </div>
      )}

      <h4 className="detail__h4">Leave a review</h4>
      {canReview && !nearEnough && (
        <p className="detail__proximity">
          You're {formatDistance(dist)} away. Reviews from people who were actually
          there carry more weight in ranking.
        </p>
      )}
      <ReviewForm onSubmit={onReview} canReview={canReview} reason={reason} />

      <h4 className="detail__h4">
        Reviews <span className="muted">({place.reviews.length})</span>
      </h4>
      <div className="reviews">
        {place.reviews.map((r, i) => (
          <div key={i} className={`review ${r.stars <= 2 ? 'review--neg' : ''}`}>
            <div className="review__head">
              <strong>{r.user}</strong>
              <span className="review__stars">{'★'.repeat(r.stars)}<span className="muted">{'★'.repeat(5 - r.stars)}</span></span>
              <span className="muted review__date">{r.date}</span>
            </div>
            <p>{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
