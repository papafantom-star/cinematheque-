export default function MovieCard({ film, list, isAdmin, onClick, onRemove }) {
  const badgeConfig = {
    want: { label: 'À voir', style: { background: 'rgba(224,92,58,0.85)', color: '#fff' } },
    year: { label: 'Vu cette année', style: { background: 'rgba(76,175,125,0.85)', color: '#fff' } },
    prev: { label: 'Avant', style: { background: 'rgba(100,100,190,0.85)', color: '#fff' } },
  }

  const badge = film.rewatch
    ? { label: '⟳ Revu', style: { background: 'rgba(201,168,76,0.85)', color: '#1a1508' } }
    : badgeConfig[list]

  return (
    <div onClick={onClick} className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: 'var(--surface)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
        animation: 'fadeIn 0.35s ease both'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 18px 45px rgba(0,0,0,0.5)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}>

      {/* Badge */}
      <span className="absolute top-1.5 left-1.5 z-10 text-xs font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
        style={badge.style}>
        {badge.label}
      </span>

      {/* Poster */}
      {film.poster
        ? <img src={film.poster} alt={film.title} className="w-full object-cover block"
            style={{ aspectRatio: '2/3', background: 'var(--surface2)' }} loading="lazy" />
        : <div className="w-full flex items-center justify-center text-5xl"
            style={{ aspectRatio: '2/3', background: 'var(--surface2)', color: 'var(--text-muted)' }}>🎬</div>
      }

      {/* Bouton supprimer (admin only) */}
      {isAdmin && (
        <button onClick={e => { e.stopPropagation(); onRemove() }}
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full items-center justify-center text-sm hidden group-hover:flex transition"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}>
          ✕
        </button>
      )}

      {/* Infos */}
      <div className="p-3">
        <div className="text-sm font-medium leading-snug mb-1 overflow-hidden"
          style={{ color: 'var(--text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {film.title}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {film.year || ''}
          {film.year && film.myRating ? ' · ' : ''}
          {film.myRating ? <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{film.myRating}/10</span> : null}
        </div>
      </div>
    </div>
  )
}