import { useState, useRef, useEffect } from 'react'
import AuthPanel from './AuthPanel'

export default function Header({ activeTab, onTabChange, isAdmin, onLogin, onLogout }) {
  const [showAuth, setShowAuth] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowAuth(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const tabs = [
    { key: 'want', label: 'À voir' },
    { key: 'year', label: 'Cette année' },
    { key: 'prev', label: 'Avant' },
  ]

  return (
  <header className="sticky top-0 z-40"
    style={{ background: 'rgba(10,10,15,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

    {/* Desktop : tout sur une ligne / Mobile : deux lignes */}
    <div className="flex flex-wrap items-center px-4 md:px-8 h-auto md:h-14 gap-2 py-2 md:py-0">

      {/* Logo + titre */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img src="logo.png" alt="logo" className="h-8 w-auto" />
        <span className="text-lg md:text-xl" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}>
          Ma <span style={{ fontStyle: 'italic', color: 'var(--text)' }}>Cinémathèque</span>
        </span>
      </div>

      {/* Onglets — poussés au centre/droite sur desktop */}
      <div className="hidden md:flex overflow-x-auto gap-1 flex-1 md:justify-end"
        style={{ scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => onTabChange(t.key)}
            className="flex-shrink-0 px-3 py-1.5 rounded-md text-xs uppercase tracking-widest transition whitespace-nowrap"
            style={{
              background: activeTab === t.key ? 'var(--gold-dim)' : 'transparent',
              color: activeTab === t.key ? 'var(--gold)' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Bouton Admin */}
      <div className="relative flex-shrink-0" ref={panelRef}>
        <button onClick={() => setShowAuth(v => !v)}
          className="px-3 py-1.5 rounded-lg text-xs transition"
          style={{
            background: 'var(--surface2)',
            border: isAdmin ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.07)',
            color: isAdmin ? 'var(--gold)' : 'var(--text-muted)',
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
          }}>
          {isAdmin ? '✅ Admin' : '🔒 Admin'}
        </button>

        {showAuth && (
          <AuthPanel isAdmin={isAdmin} onLogin={onLogin} onLogout={onLogout} onClose={() => setShowAuth(false)} />
        )}
      </div>

    </div>

    {/* Sur mobile uniquement : onglets en 2ème ligne */}
    <div className="flex md:hidden overflow-x-auto px-4 pb-2 gap-1"
      style={{ scrollbarWidth: 'none' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onTabChange(t.key)}
          className="flex-shrink-0 px-4 py-1.5 rounded-md text-xs uppercase tracking-widest transition whitespace-nowrap"
          style={{
            background: activeTab === t.key ? 'var(--gold-dim)' : 'transparent',
            color: activeTab === t.key ? 'var(--gold)' : 'var(--text-muted)',
            border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
          }}>
          {t.label}
        </button>
      ))}
    </div>

  </header>
)
}