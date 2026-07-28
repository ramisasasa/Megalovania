import { useState } from 'react'
import { CATEGORIES, CITY } from '../data/places'

export default function AddSpotModal({ coords, onCancel, onSave }) {
  const [name, setName] = useState('')
  const [cats, setCats] = useState([])
  const [priceMin, setPriceMin] = useState(100)
  const [priceMax, setPriceMax] = useState(400)
  const [blurb, setBlurb] = useState('')
  const [error, setError] = useState('')

  function toggle(id) {
    setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  }

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Give the spot a name.')
    if (!cats.length) return setError('Pick at least one category.')
    if (priceMax < priceMin) return setError('Max price must be above the minimum.')
    onSave({
      name: name.trim(),
      category: cats,
      tags: cats,
      lat: coords.lat,
      lng: coords.lng,
      priceMin: +priceMin,
      priceMax: +priceMax,
      hours: { open: 8, close: 23 },
      blurb: blurb.trim() || 'Added by a student — no description yet.',
    })
  }

  return (
    <div className="modal" onClick={onCancel}>
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <h3>Add a spot</h3>
        <p className="modal__sub">
          Dropped at {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} — it'll show up
          for everyone nearby.
        </p>

        <form onSubmit={submit}>
          <label className="field">
            <span>Name</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="e.g. Rooftop tea stall behind Block C"
            />
          </label>

          <label className="field">
            <span>Category</span>
            <div className="chips chips--tight">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={cats.includes(c.id) ? 'chip chip--on' : 'chip'}
                  onClick={() => { toggle(c.id); setError('') }}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </label>

          <div className="field__row">
            <label className="field">
              <span>Min {CITY.currency} / person</span>
              <input type="number" min={0} step={50} value={priceMin}
                     onChange={(e) => setPriceMin(e.target.value)} />
            </label>
            <label className="field">
              <span>Max {CITY.currency} / person</span>
              <input type="number" min={0} step={50} value={priceMax}
                     onChange={(e) => { setPriceMax(e.target.value); setError('') }} />
            </label>
          </div>

          <label className="field">
            <span>What is it? <em className="muted">(optional)</em></span>
            <textarea
              rows={2}
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="One line so people know what to expect."
            />
          </label>

          {error && <p className="field__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button className="btn btn--primary">Add spot</button>
          </div>
        </form>
      </div>
    </div>
  )
}
