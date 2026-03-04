export default function ConfirmDialog({ film, onConfirm, onCancel }) {
  if (!film) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onCancel}>
      <div className="w-full max-w-xs rounded-2xl p-6 text-center"
        style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)' }}
        onClick={e => e.stopPropagation()}>
        <p className="text-lg mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Supprimer ce film ?
        </p>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          "{film.title}" sera définitivement supprimé de ta liste.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-lg py-2.5 text-sm transition"
            style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-lg py-2.5 text-sm font-medium transition"
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}