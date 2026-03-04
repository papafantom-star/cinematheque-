import { useState } from 'react'

export default function CritiqueEditor({ value, onSave }) {
  const [text, setText] = useState(value || '')
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await onSave(text)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
        Ma critique
      </p>
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Écris ta critique…"
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-y min-h-20 leading-relaxed"
        style={{ background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }} />
      <button onClick={handleSave}
        className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition"
        style={{ background: saved ? 'var(--green, #4caf7d)' : 'var(--gold)', color: '#1a1508', border: 'none', cursor: 'pointer' }}>
        {saved ? '✓ Sauvegardé' : 'Sauvegarder'}
      </button>
    </div>
  )
}
