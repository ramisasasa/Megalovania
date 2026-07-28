import { useState } from 'react'
import { SansDialog } from './Sans'
import { validateEmail, verifyOtp, makeUser, ALLOWED_DOMAIN } from '../lib/store'

export default function LoginGate({ onSignIn, onSkip }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submitEmail(e) {
    e.preventDefault()
    const result = validateEmail(email)
    if (!result.ok) return setError(result.error)
    setError('')
    setEmail(result.email)
    setStep('otp')
  }

  function submitOtp(e) {
    e.preventDefault()
    if (!verifyOtp(code)) return setError('six digits. any six.')
    onSignIn(makeUser(email))
  }

  return (
    <div className="gate">
      <h1 className="gate__title">MEGALOVANIA</h1>
      <p className="gate__tag">food · turf · gaming · salons — around IUB</p>

      {step === 'email' ? (
        <>
          <SansDialog
            text="hey. iub email only past this point. don't take it personally."
            typing={false}
          />
          <form onSubmit={submitEmail}>
            <label className="field">
              <span>University email</span>
              <input
                autoFocus
                type="text"
                placeholder={`yourname@${ALLOWED_DOMAIN}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
              />
            </label>
            {error && <p className="field__error">{error}</p>}
            <button className="btn btn--gold btn--full" type="submit">continue</button>
          </form>
          <p className="gate__note">
            only <code>@{ALLOWED_DOMAIN}</code> accounts during the pilot.
          </p>
        </>
      ) : (
        <>
          <SansDialog
            text={`sent a code to ${email}. check your inbox. or don't, it's a demo.`}
            typing={false}
          />
          <form onSubmit={submitOtp}>
            <label className="field">
              <span>Verification code</span>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={6}
                className="field__otp"
                placeholder="······"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
              />
            </label>
            {error && <p className="field__error">{error}</p>}
            <button className="btn btn--gold btn--full" type="submit">verify</button>
          </form>
          <button className="btn btn--ghost btn--full" style={{ marginTop: 8 }}
                  onClick={() => { setStep('email'); setError('') }}>
            ← different email
          </button>
          <p className="gate__note">demo build — any 6 digits work.</p>
        </>
      )}

      <button className="btn btn--ghost btn--full" style={{ marginTop: 10 }} onClick={onSkip}>
        browse as guest
      </button>
    </div>
  )
}
