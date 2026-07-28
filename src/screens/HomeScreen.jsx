import { useState } from 'react'
import { SansDialog, greetingFor } from '../components/Sans'
import PlaceList from '../components/PlaceList'
import { CATEGORIES } from '../data/places'

const QUICK = [
  { id: 'explore', icon: '🗺️', label: 'Search', sub: 'browse the map' },
  { id: 'ask', icon: '💬', label: 'Ask Sans', sub: 'in plain english' },
  { id: 'top', icon: '🏆', label: 'Top picks', sub: 'rated & visited' },
  { id: 'saved', icon: '⭐', label: 'Saved', sub: 'your favourites' },
]

const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label.toLowerCase()]))

function crewNames(students) {
  const names = students.map((s) => s.name)
  if (names.length <= 2) return names.join(' and ')
  return `${names[0]}, ${names[1]} + ${names.length - 2} other${names.length > 3 ? 's' : ''}`
}

export default function HomeScreen({
  user, hour, recents, forYou, nearby,
  onNavigate, onAsk, onCategory, onSelectPlace,
  crews = [], onOpenChat,
}) {
  const [q, setQ] = useState('')

  function submit(e) {
    e.preventDefault()
    if (q.trim()) { onAsk(q); setQ('') }
  }

  return (
    <div className="screen">
      <SansDialog
        text={greetingFor(hour, user?.name)}
        sub={user?.interests?.length
          ? `you said you're into ${user.interests.slice(0, 3).join(', ')}. i remembered.`
          : 'tip: set your interests in your profile and i\'ll tune the suggestions.'}
      />

      <form className="askbar" onSubmit={submit}>
        <span className="soul soul--pulse" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="suggest me a gaming cafe nearby"
        />
        <button className="askbar__go" disabled={!q.trim()}>ASK</button>
      </form>

      {crews.length > 0 && (
        <>
          <div className="section">Your crew</div>
          {crews.map((c) => (
            <div key={c.category} className="crew">
              <div className="crew__faces">
                {c.students.slice(0, 3).map((s) => <span key={s.id}>{s.avatar}</span>)}
              </div>
              <p className="crew__text">
                <b>{crewNames(c.students)}</b> are into {LABEL[c.category] ?? c.category} just
                like you. wanna hit <b>{c.place.name}</b> this sunday?
              </p>
              <div className="crew__btns">
                <button className="btn btn--gold btn--sm" onClick={() => onOpenChat(c.category)}>
                  💬 group chat
                </button>
                <button className="btn btn--ghost btn--sm" onClick={() => onSelectPlace(c.place.id)}>
                  see the spot
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="section">Quick actions</div>
      <div className="tiles tiles--big">
        {QUICK.map((a) => (
          <button key={a.id} className="tile" onClick={() => onNavigate(a.id)}>
            <span className="tile__icon">{a.icon}</span>
            <span className="tile__label">{a.label}</span>
            <span className="tile__sub">{a.sub}</span>
          </button>
        ))}
      </div>

      <div className="section">What are you after</div>
      <div className="tiles">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="tile" onClick={() => onCategory(c.id)}>
            <span className="tile__icon">{c.icon}</span>
            <span className="tile__label">{c.label}</span>
          </button>
        ))}
      </div>

      {recents.length > 0 && (
        <>
          <div className="section">Recent</div>
          <div className="rows">
            {recents.slice(0, 5).map((r, i) => (
              <button key={i} className="recent" onClick={() => onAsk(r)}>
                <span className="recent__icon">↺</span>
                <span className="recent__text">{r}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {forYou.length > 0 && (
        <>
          <div className="section">For you</div>
          <PlaceList results={forYou.slice(0, 4)} onSelect={onSelectPlace} emptyHint="" />
        </>
      )}

      <div className="section">Closest to you</div>
      <PlaceList
        results={nearby.slice(0, 4)}
        onSelect={onSelectPlace}
        emptyHint="nothing in range. widen your proximity in settings."
      />

      <div style={{ height: 8 }} />
    </div>
  )
}
