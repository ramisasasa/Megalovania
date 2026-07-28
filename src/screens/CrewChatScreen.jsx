import { useEffect, useRef, useState } from 'react'
import { OPENERS, REPLIES } from '../data/students'
import { CATEGORIES } from '../data/places'

const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))
const ICON = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.icon]))

export default function CrewChatScreen({ crew, messages, onSend, onBack, onSelectPlace, user }) {
  const [text, setText] = useState('')
  const endRef = useRef(null)

  // The first two lines are canned openers from the crew — not persisted,
  // just always shown so a fresh chat never starts empty.
  const openers = (OPENERS[crew.category] ?? OPENERS.default).map((line, i) => ({
    from: crew.students[i % crew.students.length].name,
    avatar: crew.students[i % crew.students.length].avatar,
    text: line,
  }))
  const all = [...openers, ...messages]

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [all.length])

  function submit(e) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    onSend({ from: 'me', text: body })
    setText('')
    // Scripted reply so the chat feels alive. It's a demo — nobody's home.
    const n = messages.filter((m) => m.from === 'me').length
    const member = crew.students[n % crew.students.length]
    const line = REPLIES[n % REPLIES.length]
    setTimeout(() => onSend({ from: member.name, avatar: member.avatar, text: line }), 900)
  }

  return (
    <div className="screen screen--flush chat">
      <div className="chat__head">
        <button className="back" style={{ margin: 0 }} onClick={onBack}>← back</button>
        <div className="chat__who">
          <span className="chat__faces">
            <i className="crew__act">{ICON[crew.category] ?? '✨'}</i>
            {crew.students.slice(0, 4).map((s) => <i key={s.id}>{s.avatar}</i>)}
          </span>
          <span className="chat__names">
            {crew.students.map((s) => s.name).join(', ')} &amp; you
            <em>{LABEL[crew.category] ?? crew.category} crew</em>
          </span>
        </div>
      </div>

      <button className="chat__place" onClick={() => onSelectPlace(crew.place.id)}>
        📍 {crew.place.name} — sunday? <span className="muted">tap for details</span>
      </button>

      <div className="chat__msgs">
        {all.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'msg msg--me' : 'msg'}>
            {m.from !== 'me' && <span className="msg__who">{m.avatar} {m.from}</span>}
            <span className="msg__bubble">{m.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="askbar chat__bar" onSubmit={submit}>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`message as ${user?.name ?? 'you'}…`}
        />
        <button className="askbar__go" disabled={!text.trim()}>SEND</button>
      </form>
    </div>
  )
}
