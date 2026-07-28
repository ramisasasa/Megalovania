import { useState } from 'react'
import { SansDialog, greetingFor } from '../components/Sans'
import PlaceList from '../components/PlaceList'
import { CATEGORIES } from '../data/places'

const QUICK = [
  { id: 'explore', icon: '🗺️', label: 'Search', sub: 'browse the map' },
  { id: 'ask', icon: '💬', label: 'Ask Sans', sub: 'in plain english' },
  { id: 'saved', icon: '⭐', label: 'Saved', sub: 'your favourites' },
  { id: 'settings', icon: '⚙️', label: 'Settings', sub: 'range, privacy' },
]

export default function HomeScreen({
  user, hour, recents, forYou, nearby,
  onNavigate, onAsk, onCategory, onSelectPlace,
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
