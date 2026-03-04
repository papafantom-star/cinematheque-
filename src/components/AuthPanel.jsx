import { useState } from 'react'

export default function AuthPanel({ onLogin, onLogout, isAdmin, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      await onLogin(email, password)
      onClose()
    } catch (e) {
      setError(e)
    }
    setLoading(false)
  }

  return (
    <div className="absolute top-16 right-4 z-50 w-64 rounded-2xl border p-5 shadow-2xl"
      style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.07)' }}>
      {isAdmin ? (
        <>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Connecté en admin</p>
          <button onClick={onLogout} className="w-full rounded-lg py-2 text-sm transition"
            style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px solid rgba(255,255,255,0.07)' }}>
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <p className="mb-4 text-base" style={{ fontFamily: 'Playfair Display, serif' }}>Connexion admin</p>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm mb-2 outline-none"
            style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text)' }} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-lg px-3 py-2 text-sm mb-3 outline-none"
            style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text)' }} />
          {error && <p className="text-xs mb-2" style={{ color: 'var(--accent)' }}>{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full rounded-lg py-2 text-sm font-medium transition"
            style={{ background: 'var(--gold)', color: '#1a1508' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </>
      )}
    </div>
  )
}