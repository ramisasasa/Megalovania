import { useState } from 'react'
import { SansDialog } from '../components/Sans'
import { AVATARS, AREAS, validateEmail, validatePhone } from '../lib/store'

export default function EditProfileScreen({ user, onSave, onBack }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [avatar, setAvatar] = useState(user.avatar)
  const [area, setArea] = useState(user.area)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('a username is required.')
    if (name.trim().length < 3) return setError('username needs at least 3 characters.')

    const mail = validateEmail(email)
    if (!mail.ok) return setError(mail.error)

    const num = validatePhone(phone)
    if (!num.ok) return setError(num.error)

    setError('')
    onSave({ ...user, name: name.trim(), email: mail.email, phone: num.phone, avatar, area })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="screen">
      <button className="back" onClick={onBack}>← back</button>

      <SansDialog
        text={saved ? 'saved. looks good.' : 'change whatever you want. email still has to be an iub one.'}
        typing={false}
      />

      <form onSubmit={submit}>
        <div className="section">Avatar</div>
        <div className="avatars">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              className={avatar === a ? 'avatar-opt avatar-opt--on' : 'avatar-opt'}
              onClick={() => setAvatar(a)}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="section">Details</div>

        <label className="field">
          <span>Username</span>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="what people see on your reviews"
            maxLength={24}
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            placeholder="yourname@iub.edu.bd"
          />
        </label>

        <label className="field">
          <span>Phone number</span>
          <input
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError('') }}
            placeholder="01712345678 (optional)"
            inputMode="tel"
          />
        </label>

        <label className="field">
          <span>Location</span>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        {error && <p className="field__error">{error}</p>}

        <div className="btnrow">
          <button type="button" className="btn btn--ghost" onClick={onBack}>cancel</button>
          <button className="btn btn--gold">save changes</button>
        </div>
      </form>

      <div style={{ height: 10 }} />
    </div>
  )
}
