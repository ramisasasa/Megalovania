import { useState } from 'react'
import { SansDialog } from '../components/Sans'
import { formatDistance, walkMinutes } from '../lib/geo'

const EXAMPLES = [
  'suggest me a gaming cafe nearby',
  'where can i get good pastries under ৳200',
  'quiet cafe to study near me',
  'football turf for tonight',
  'a salon for a haircut',
  'date spot under ৳800',
]

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

export default function AskScreen({ answer, thinking, onSearch, onClear, onSelect, area, recents }) {
  const [q, setQ] = useState('')

  function submit(e) {
    e.preventDefault()
    if (q.trim()) onSearch(q.trim())
  }

  function pickExample(text) {
    setQ(text)
    onSearch(text)
  }

  return (
    <div className="screen">
      <form className="askbar" onSubmit={submit}>
        <span className="soul soul--pulse" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ask me anything about around here"
        />
        <button className="askbar__go" disabled={!q.trim()}>ASK</button>
      </form>

      {thinking && (
        <div className="dialog dialog--sans" style={{ marginTop: 14 }}>
          <div className="dialog__body">
            <p className="dialog__text">
              <span className="star">*</span>
              hang on. <span className="dots"><i /><i /><i /></span>
            </p>
          </div>
        </div>
      )}

      {!thinking && answer && (
        <div style={{ marginTop: 14 }}>
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
                  {!pick.open && <span className="chip chip--closed">CLOSED</span>}
                </span>
                <span className="pick__meta">
                  {pick.price} · {formatDistance(pick.dist)} · {walkMinutes(pick.dist)} min walk
                </span>
                <span className="pick__why">{pick.why}</span>
                {pick.caveat && <span className="pick__caveat">! {pick.caveat}</span>}
              </span>
            </button>
          ))}

          {answer.picks.length > 0 && (
            <button className="btn btn--ghost btn--full" onClick={() => { onClear(); setQ('') }}>
              ask something else
            </button>
          )}
        </div>
      )}

      {!answer && !thinking && (
        <>
          <SansDialog
            text="ask however you'd say it out loud. i'll work out what you mean."
            sub="i only suggest places that actually match. no restaurants when you asked for a salon."
          />
          <div className="section">Try one</div>
          <div className="suggests">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="suggest" onClick={() => pickExample(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </>
      )}

      {recents.length > 0 && !answer && (
        <>
          <div className="section">Recent</div>
          <div className="rows">
            {recents.slice(0, 6).map((r, i) => (
              <button key={i} className="recent" onClick={() => pickExample(r)}>
                <span className="recent__icon">↺</span>
                <span className="recent__text">{r}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
