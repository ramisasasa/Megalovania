import { useState } from 'react'
import { SansDialog, greetingFor } from '../components/Sans'
import PlaceList from '../components/PlaceList'
import { CATEGORIES } from '../data/places'

// Quick actions used to sit here, but every tile duplicated a bottom-nav tab
// once Search and Ask merged — so the nav is the only way in now.

// The home screen shows a curated subset, split into places vs. activities so
// the grid stays breathable. The full 11-category list still lives in Explore.
const EXPLORE_TILES = [
  { icon: '☕', label: 'Cafés', categories: ['cafe'] },
  { icon: '🍽️', label: 'Restaurants', categories: ['restaurant'] },
  { icon: '🥐', label: 'Bakeries', categories: ['bakery'] },
]

// Sports lives here as "Football Sessions" rather than in the row above —
// booking a turf slot is something you join, not a venue you browse.
const ACTIVITY_TILES = [
  { icon: '⚽', label: 'Football Sessions', categories: ['sports'], tags: ['football', 'turf'] },
  { icon: '🎮', label: 'Gaming Sessions', categories: ['gaming'] },
  // Not a category of its own — study spots are cafés ranked by study tags.
  { icon: '📚', label: 'Study Sessions', categories: ['cafe'], tags: ['study', 'wifi', 'quiet'] },
  { icon: '🎬', label: 'Movies', categories: ['movies'] },
  { icon: '🛋️', label: 'Chill Hangouts', categories: ['hangout'] },
]

const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label.toLowerCase()]))
const ICON = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.icon]))

function crewNames(students) {
  const names = students.map((s) => s.name)
  if (names.length <= 2) return names.join(' and ')
  return `${names[0]}, ${names[1]} + ${names.length - 2} other${names.length > 3 ? 's' : ''}`
}

export default function HomeScreen({
  user, hour, recents, forYou, nearby,
  onAsk, onCategory, onSelectPlace,
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

      <div className="section">Ask or join</div>

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
          <p className="crew__lead">
            or skip the search — {crews.length === 1 ? 'this group is' : 'these groups are'} already
            going somewhere.
          </p>
          {crews.map((c) => (
            <div key={c.category} className="crew">
              <div className="crew__faces">
                <span className="crew__act" title={LABEL[c.category]}>
                  {ICON[c.category] ?? '✨'}
                </span>
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

      <div className="section">What are you interested in exploring</div>
      <div className="tiles tiles--3">
        {EXPLORE_TILES.map((t) => (
          <button key={t.label} className="tile" onClick={() => onCategory(t)}>
            <span className="tile__icon">{t.icon}</span>
            <span className="tile__label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="section">What activities are you interested in joining</div>
      <div className="tiles tiles--flow">
        {ACTIVITY_TILES.map((t) => (
          <button key={t.label} className="tile" onClick={() => onCategory(t)}>
            <span className="tile__icon">{t.icon}</span>
            <span className="tile__label">{t.label}</span>
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
