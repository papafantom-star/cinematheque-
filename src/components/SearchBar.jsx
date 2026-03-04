import { useRef, useEffect } from 'react'

export default function SearchBar({ query, setQuery, results, setResults, onSelect, onManualAdd }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setResults([])
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [setResults])

  return (
    <div className="flex gap-3 px-8 pt-6 max-w-xl">
      <div className="relative flex-1" ref={wrapRef}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && setResults([])}
          placeholder="Rechercher un film…"
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}
        />
        {results.length > 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
            style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 16px 40px rgba(0,0,0,0.55)' }}>
            {results.map(m => (
              <div key={m.id} onClick={() => { onSelect(m); setQuery(''); setResults([]) }}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {m.poster
                  ? <img src={m.posterThumb} alt="" className="w-9 rounded" style={{ height: '54px', objectFit: 'cover' }} />
                  : <div className="w-9 flex items-center justify-center text-xl" style={{ height: '54px' }}>🎬</div>}
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{m.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.year || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => { if (query.trim()) { onManualAdd(query); setQuery('') } }}
        className="px-4 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-85"
        style={{ background: 'var(--gold)', color: '#1a1508', fontFamily: 'DM Sans, sans-serif', border: 'none', cursor: 'pointer' }}>
        + Ajouter
      </button>
    </div>
  )
}
