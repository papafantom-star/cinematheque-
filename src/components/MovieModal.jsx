import { useEffect } from 'react'
import RatingPicker from './RatingPicker'
import CritiqueEditor from './CritiqueEditor'

export default function MovieModal({ film, list, isAdmin, onClose, onMove, onNote, onCritique, onRewatch }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!film) return null

  const moveTargets = [
    { k: 'want',  l: '📌 À voir' },
    { k: 'year',  l: '✅ Cette année' },
    { k: 'prev',  l: '📅 Avant' },
  ].filter(b => b.k !== list)

  const stars = film.rating
    ? '★'.repeat(Math.min(Math.round(film.rating / 2), 5)) + '☆'.repeat(Math.max(0, 5 - Math.round(film.rating / 2)))
    : ''

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.75)', opacity: 1 }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl rounded-2xl flex gap-6 p-6 overflow-y-auto max-h-screen"
        style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)' }}
        onClick={e => e.stopPropagation()}>

        {/* Bouton fermer */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition"
          style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>✕</button>

        {/* Poster */}
        {film.poster
          ? <div className="w-36 flex-shrink-0 rounded-lg overflow-hidden self-start">
              <img src={film.poster.replace('w342', 'w500')} alt={film.title} className="w-full block" />
            </div>
          : <div className="w-36 flex-shrink-0 rounded-lg flex items-center justify-center text-5xl"
              style={{ aspectRatio: '2/3', background: 'var(--surface2)', color: 'var(--text-muted)' }}>🎬</div>
        }

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl leading-snug mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{film.title}</h2>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            {[film.year, film.rating ? film.rating + '/10' : ''].filter(Boolean).join(' · ')}
          </p>
          {stars && <p className="text-base mb-3" style={{ color: 'var(--gold)', letterSpacing: '-1px' }}>{stars}</p>}
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#b8b6ae' }}>
            {film.overview || <span style={{ color: 'var(--text-muted)' }}>Aucun résumé disponible.</span>}
          </p>

          {/* Boutons déplacement (admin) */}
          {isAdmin && (
            <div className="flex gap-2 flex-wrap mb-5">
              {moveTargets.map(b => (
                <button key={b.k} onClick={() => onMove(b.k)}
                  className="flex-1 rounded-lg py-2 text-xs transition"
                  style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text)' }}>
                  {b.l}
                </button>
              ))}
            </div>
          )}

          {/* Section note + critique */}
          {list !== 'want' && (
            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {isAdmin ? (
                <>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Ma note</p>
                  <div className="mb-4">
                    <RatingPicker value={film.myRating} onChange={note => onNote(note)} />
                  </div>

                  <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input type="checkbox" checked={!!film.rewatch} onChange={e => onRewatch(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--gold)', cursor: 'pointer' }} />
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Marquer comme <span style={{ color: 'var(--gold)' }}>⟳ Revu</span>
                    </span>
                  </label>

                  <CritiqueEditor value={film.critique} onSave={onCritique} />
                </>
              ) : (
                <>
                  {film.myRating && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>
                        {film.myRating}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/10</span>
                      </span>
                      <span className="text-lg" style={{ color: 'var(--gold)', letterSpacing: '-1px' }}>
                        {'★'.repeat(Math.min(Math.round(film.myRating / 2), 5))}
                        {'☆'.repeat(Math.max(0, 5 - Math.round(film.myRating / 2)))}
                      </span>
                    </div>
                  )}
                  {film.critique && (
                    <>
                      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Critique</p>
                      <p className="text-sm leading-relaxed italic"
                        style={{ color: '#b8b6ae', borderLeft: '2px solid var(--gold)', paddingLeft: '0.75rem' }}>
                        {film.critique}
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}