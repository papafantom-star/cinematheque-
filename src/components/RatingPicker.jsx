export default function RatingPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5 items-center flex-wrap">
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button key={n} onClick={() => onChange(value === n ? null : n)}
          className="w-7 h-7 rounded-lg text-xs font-medium transition"
          style={{
            border: `1px solid ${(value||0) >= n ? 'var(--gold)' : 'rgba(255,255,255,0.07)'}`,
            background: (value||0) >= n ? 'var(--gold-dim)' : 'transparent',
            color: (value||0) >= n ? 'var(--gold)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}>
          {n}
        </button>
      ))}
      {value && (
        <span className="ml-1 text-sm font-medium" style={{ color: 'var(--gold)' }}>{value}/10</span>
      )}
    </div>
  )
}
