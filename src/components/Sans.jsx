import { useEffect, useState } from 'react'

/* ───────────────────────────────────────────────────────────────────────────
   SPRITE SLOT
   Drop a PNG in  public/  named any of the below and it's used everywhere Sans
   appears — no code change needed. Whichever loads first wins; if none exist,
   the hand-drawn pixel skull below is rendered instead.

   The comment here used to promise public/sans.png while the code only ever
   tried one hardcoded filename, so a correctly-placed sprite could sit there
   being ignored. Now it tries each in turn.

   Two slots, because the head reads better in a tight avatar and the
   full-body sprite reads better next to dialogue:
     public/sans.png       — head only (login gate, small avatars)
     public/sans-full.png  — full body (Sans's dialogue box)
   A missing full-body sprite falls back to the head, then to the drawing.
   ─────────────────────────────────────────────────────────────────────────── */
const SPRITES = {
  face: ['/sans.png', '/sans-undertale-icon-29.png', '/sans.webp'],
  full: ['/sans-full.png', '/sans-body.png', '/sans-full.webp'],
}

/** Pixel rows of the skull: [y, xStart, width] on a 24×24 grid. */
const SKULL = [
  [2, 8, 8], [3, 6, 12], [4, 5, 14], [5, 4, 16],
  [6, 3, 18], [7, 3, 18], [8, 3, 18], [9, 3, 18],
  [10, 3, 18], [11, 3, 18], [12, 3, 18],
  [13, 4, 16], [14, 4, 16], [15, 5, 14], [16, 5, 14],
  [17, 6, 12], [18, 7, 10], [19, 8, 8],
]

function PixelSkull({ glow }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" shapeRendering="crispEdges">
      {/* bone */}
      {SKULL.map(([y, x, w]) => (
        <rect key={y} x={x} y={y} width={w} height={1} fill="#ffffff" />
      ))}
      {/* subtle right-side shading so it doesn't read as a flat blob */}
      <rect x="19" y="7" width="2" height="5" fill="#c9c9c9" />
      <rect x="18" y="13" width="2" height="2" fill="#c9c9c9" />

      {/* eye sockets */}
      <rect x="6" y="7" width="4" height="5" fill="#000000" />
      <rect x="14" y="7" width="4" height="5" fill="#000000" />

      {/* left pupil — the blue one */}
      <rect x="7" y="8" width="2" height="3" fill={glow ? '#29b6f6' : '#5f5f5f'}>
        {glow && <animate attributeName="opacity" values="1;0.4;1" dur="2.8s" repeatCount="indefinite" />}
      </rect>
      {glow && (
        <rect x="6" y="7" width="4" height="5" fill="#29b6f6" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.04;0.18" dur="2.8s" repeatCount="indefinite" />
        </rect>
      )}
      {/* right pupil — just a dot */}
      <rect x="15" y="9" width="1" height="1" fill="#5f5f5f" />

      {/* nasal cavity */}
      <rect x="11" y="12" width="2" height="2" fill="#000000" />

      {/* the grin */}
      <rect x="6" y="15" width="12" height="1" fill="#000000" />
      <rect x="6" y="16" width="1" height="1" fill="#000000" />
      <rect x="17" y="16" width="1" height="1" fill="#000000" />
      {/* teeth separators */}
      <rect x="9" y="16" width="1" height="1" fill="#000000" />
      <rect x="12" y="16" width="1" height="1" fill="#000000" />
      <rect x="15" y="16" width="1" height="1" fill="#000000" />
    </svg>
  )
}

/**
 * Renders the first sprite that loads, otherwise the pixel skull. The probe
 * runs once per page load and the result is cached in module scope, so a
 * screen full of Sans faces costs one lookup, not one per instance.
 */
const resolved = {} // variant → path or null, once known
const probes = {} // variant → in-flight promise, shared by every mounted face

const loads = (src) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(null)
    img.src = src
  })

function probe(variant) {
  probes[variant] ??= SPRITES[variant]
    .reduce((chain, src) => chain.then((hit) => hit ?? loads(src)), Promise.resolve(null))
    // A project with only the head sprite still gets a sprite in the dialogue.
    .then((hit) => (hit || variant === 'face' ? hit : probe('face')))
    .then((hit) => { resolved[variant] = hit; return hit })
  return probes[variant]
}

export function SansFace({ className = '', glow = true, variant = 'face' }) {
  const [src, setSrc] = useState(resolved[variant] ?? null)

  useEffect(() => {
    let alive = true
    probe(variant).then((hit) => { if (alive && hit) setSrc(hit) })
    return () => { alive = false }
  }, [variant])

  return (
    <div className={`sansface ${variant === 'full' ? 'sansface--full' : ''} ${className}`}>
      {src
        ? <img src={src} alt="Sans" className="sansface__img" />
        : <PixelSkull glow={glow} />}
    </div>
  )
}

/** Reveals text character by character, the way a dialogue box should. */
function useTypewriter(text, speed = 16, enabled = true) {
  const [shown, setShown] = useState(enabled ? '' : text)

  useEffect(() => {
    if (!enabled) return setShown(text)
    setShown('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, enabled])

  return shown
}

export function SansDialog({ text, sub, type = 'sans', typing = true, variant = 'face', children }) {
  const shown = useTypewriter(text, 16, typing)
  const done = shown.length >= text.length

  return (
    <div className={`dialog dialog--${type}`}>
      <SansFace variant={variant} />
      <div className="dialog__body">
        <p className={`dialog__text ${done ? '' : 'typing'}`}>
          <span className="star">*</span>
          {shown}
        </p>
        {sub && done && <p className="dialog__sub">{sub}</p>}
        {done && children}
      </div>
    </div>
  )
}

/** Sans has opinions about the time of day. */
export function greetingFor(hour, name) {
  const who = name ? `, ${name.toLowerCase()}` : ''
  if (hour < 5) return `still up${who}? respect. what are we looking for.`
  if (hour < 12) return `mornin'${who}. hungry, or just avoiding class.`
  if (hour < 17) return `hey${who}. i know a few places around here.`
  if (hour < 21) return `evening${who}. good time to go somewhere.`
  return `it's late${who}. i know what's still open.`
}
