// Demo persistence layer. localStorage stands in for the backend — swap these
// functions for fetch() calls when there's a real API behind it.

const KEY = 'megalovania.v2'

const empty = {
  user: null,
  settings: { proximity: 2000, anonymous: false, openOnly: false },
  favourites: [],
  recents: [],
  reviews: [],
  userPlaces: [],
  visits: {},
  chats: {},
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(empty)
    const parsed = JSON.parse(raw)
    return {
      ...structuredClone(empty),
      ...parsed,
      settings: { ...empty.settings, ...(parsed.settings ?? {}) },
    }
  } catch {
    return structuredClone(empty)
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode — the demo still works in-memory */
  }
}

export function resetState() {
  localStorage.removeItem(KEY)
}

// ── Auth ────────────────────────────────────────────────────────────────────

/** Only IUB accounts get in. Change this one constant to open it up. */
export const ALLOWED_DOMAIN = 'iub.edu.bd'

export function validateEmail(email) {
  const value = email.trim().toLowerCase()
  if (!value) return { ok: false, error: 'enter your university email.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { ok: false, error: 'that is not a valid email address.' }
  }
  if (!value.endsWith(`@${ALLOWED_DOMAIN}`)) {
    return { ok: false, error: `only @${ALLOWED_DOMAIN} accounts can sign in.` }
  }
  return { ok: true, email: value }
}

export function validatePhone(phone) {
  const value = phone.trim().replace(/[\s-]/g, '')
  if (!value) return { ok: true, phone: '' } // optional
  if (!/^(?:\+?880|0)1[3-9]\d{8}$/.test(value)) {
    return { ok: false, error: 'use a valid BD number, e.g. 01712345678.' }
  }
  return { ok: true, phone: value }
}

/** Derives a display name from the email local-part: "asadik2" → "Asadik2". */
export function displayNameFor(email) {
  const local = email.split('@')[0].replace(/[._\-\d]+/g, ' ')
  const name = local
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
  return name || email.split('@')[0]
}

/**
 * Stand-in for a real OTP. Any 6 digits is accepted — the point is to show the
 * flow, not to actually verify anyone. Wire this to Supabase Auth later.
 */
export function verifyOtp(code) {
  return /^\d{6}$/.test(code.trim())
}

export const AVATARS = ['💀', '🦴', '🔥', '⭐', '🌻', '🍝', '🐟', '🤖', '👾', '🎮', '🌙', '☕']

export const AREAS = [
  'Bashundhara R/A',
  'Baridhara',
  'Gulshan 1',
  'Gulshan 2',
  'Banani',
  'Uttara',
  'Nadda',
  'Kuril',
]

export function makeUser(email) {
  return {
    name: displayNameFor(email),
    email,
    phone: '',
    avatar: '💀',
    area: 'Bashundhara R/A',
    interests: [],
    isPublic: true,
    points: 0,
    joinedAt: new Date().toISOString(),
  }
}
