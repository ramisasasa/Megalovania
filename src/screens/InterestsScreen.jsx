import { useState } from 'react'
import { SansDialog } from '../components/Sans'
import { CATEGORIES } from '../data/places'

export default function InterestsScreen({ user, onSave, onBack, firstRun = false }) {
  const [picked, setPicked] = useState(user?.interests ?? [])

  function toggle(id) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  return (
    <div className="screen">
      {!firstRun && <button className="back" onClick={onBack}>← back</button>}

      <SansDialog
        text={
          firstRun
            ? "before we start — what are you into? i'll push those to the top."
            : 'pick what you actually care about. i weight these when i rank things.'
        }
        sub={picked.length ? `${picked.length} selected` : 'pick at least one.'}
        typing={false}
      />

      <div className="interests">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={picked.includes(c.id) ? 'interest interest--on' : 'interest'}
            onClick={() => toggle(c.id)}
          >
            <span className="interest__icon">{c.icon}</span>
            <span className="interest__label">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="btnrow" style={{ marginTop: 16 }}>
        {!firstRun && (
          <button className="btn btn--ghost" onClick={onBack}>cancel</button>
        )}
        <button
          className="btn btn--gold"
          disabled={picked.length === 0}
          onClick={() => onSave(picked)}
        >
          {firstRun ? "let's go" : 'save interests'}
        </button>
      </div>

      {firstRun && (
        <button className="btn btn--ghost btn--full" style={{ marginTop: 8 }} onClick={() => onSave([])}>
          skip for now
        </button>
      )}

      <div style={{ height: 10 }} />
    </div>
  )
}
