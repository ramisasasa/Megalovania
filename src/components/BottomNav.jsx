const TABS = [
  { id: 'home', icon: '🏠', label: 'HOME' },
  { id: 'explore', icon: '🗺️', label: 'SEARCH' },
  { id: 'ask', icon: '💬', label: 'ASK' },
  { id: 'saved', icon: '⭐', label: 'SAVED' },
  { id: 'profile', icon: '💀', label: 'PROFILE' },
]

export default function BottomNav({ tab, onChange }) {
  return (
    <nav className="bottomnav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`navbtn ${tab === t.id ? 'navbtn--on' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="navbtn__icon">{t.icon}</span>
          <span className="navbtn__label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
