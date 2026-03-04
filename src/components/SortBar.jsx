const OPTIONS = [
  { key: 'recent', label: '🕐 Récent' },
  { key: 'oldest', label: '🕐 Ancien' },
  { key: 'rating', label: '⭐ Note' },
  { key: 'year',   label: '📅 Année' },
  { key: 'alpha',  label: '🔤 A→Z' },
]

export default function SortBar({ current, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {OPTIONS.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className="px-3 py-1 rounded-full text-xs transition"
          style={{
            background: current === o.key ? 'var(--gold-dim)' : 'var(--surface)',
            border: current === o.key ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.07)',
            color: current === o.key ? 'var(--gold)' : 'var(--text-muted)',
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
          }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
