/* eslint-disable no-unused-vars */
import { useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SortBar from './components/SortBar'
import MovieCard from './components/MovieCard'
import MovieModal from './components/MovieModal'
import ConfirmDialog from './components/ConfirmDialog'
import { useAuth } from './hooks/useAuth'
import { useMovies } from './hooks/useMovies'
import { useTMDB } from './hooks/useTMDB'

const SORT_FN = {
  recent: (a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0),
  oldest: (a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0),
  rating: (a, b) => (b.myRating || 0) - (a.myRating || 0),
  year:   (a, b) => (b.year || '0') - (a.year || '0'),
  alpha:  (a, b) => a.title.localeCompare(b.title, 'fr'),
}

const TABS = [
  { key: 'want', title: 'Films à voir' },
  { key: 'year', title: `Vus en ${new Date().getFullYear()}` },
  { key: 'prev', title: 'Années précédentes' },
]

const EMPTY_MSG = {
  want: 'Ajoutez vos films à voir…',
  year: 'Aucun film vu cette année…',
  prev: 'Aucun film des années précédentes…',
}

export default function App() {
  const {loading: authLoading, login, logout, isAdmin } = useAuth()
  const { db, loading, addMovie, removeMovie, moveMovie, updateNote, updateCritique, updateRewatch } = useMovies()
  const { query, setQuery, results, setResults } = useTMDB()

  const [activeTab, setActiveTab] = useState('want')
  const [sortState, setSortState] = useState({ want: 'recent', year: 'recent', prev: 'recent' })
  const [modal, setModal] = useState(null)       // { film, list }
  const [confirmFilm, setConfirmFilm] = useState(null) // { id, list, title }

  // ── Loader global ──────────────────────────────────────────
  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
      Chargement…
    </div>
  )

  // ── Ajouter un film depuis TMDB ────────────────────────────
  function handleSelect(film) {
    addMovie({ ...film, list: activeTab })
  }

  // ── Ajouter manuellement ───────────────────────────────────
  function handleManualAdd(title) {
    addMovie({
      id: 'm' + Date.now(), title, year: '', poster: null,
      overview: '', rating: null, myRating: null,
      critique: null, rewatch: false, list: activeTab
    })
  }

  // ── Supprimer ──────────────────────────────────────────────
  function handleRemove(film, list) {
    setConfirmFilm({ id: film.id, list, title: film.title })
  }

  async function handleConfirmDelete() {
    await removeMovie(confirmFilm.id, confirmFilm.list)
    setConfirmFilm(null)
    if (modal?.film?.id === confirmFilm.id) setModal(null)
  }

  // ── Déplacer ───────────────────────────────────────────────
  async function handleMove(toList) {
    if (!modal) return
    await moveMovie(modal.film, toList)
    setModal(null)
  }

  // ── Note ───────────────────────────────────────────────────
  async function handleNote(note) {
    if (!modal) return
    await updateNote(modal.film.id, modal.list, note)
    // Rafraîchit le film dans la modal
    setModal(prev => ({
      ...prev,
      film: { ...prev.film, myRating: note }
    }))
  }

  // ── Critique ───────────────────────────────────────────────
  async function handleCritique(text) {
    if (!modal) return
    await updateCritique(modal.film.id, modal.list, text)
    setModal(prev => ({
      ...prev,
      film: { ...prev.film, critique: text }
    }))
  }

  // ── Rewatch ────────────────────────────────────────────────
  async function handleRewatch(value) {
    if (!modal) return
    await updateRewatch(modal.film.id, modal.list, value)
    setModal(prev => ({
      ...prev,
      film: { ...prev.film, rewatch: value }
    }))
  }

  // ── Rendu ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Barre de chargement */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50"
          style={{ background: 'var(--gold)' }} />
      )}

      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        onLogin={login}
        onLogout={logout}
      />

      {/* Barre de recherche (admin seulement) */}
      {isAdmin && (
        <SearchBar
          query={query}
          setQuery={setQuery}
          results={results}
          setResults={setResults}
          onSelect={handleSelect}
          onManualAdd={handleManualAdd}
        />
      )}

      {/* Contenu des onglets */}
      <main className="px-8 py-8">
        {TABS.map(t => (
          <div key={t.key} style={{ display: activeTab === t.key ? 'block' : 'none' }}>

            {/* Titre section */}
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-2xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>
                {t.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>
                {db[t.key].length}
              </span>
            </div>

            {/* Tri */}
            <SortBar
              current={sortState[t.key]}
              onChange={key => setSortState(prev => ({ ...prev, [t.key]: key }))}
            />

            {/* Grille */}
            {db[t.key].length === 0 ? (
              <div className="text-center py-16 rounded-xl text-sm"
                style={{ border: '1px dashed rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                <div className="text-4xl mb-3">🎬</div>
                {EMPTY_MSG[t.key]}
              </div>
            ) : (
              <div className="grid gap-5"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))' }}>
                {[...db[t.key]]
                  .sort(SORT_FN[sortState[t.key]])
                  .map(film => (
                    <MovieCard
                      key={film.id}
                      film={film}
                      list={t.key}
                      isAdmin={isAdmin}
                      onClick={() => setModal({ film, list: t.key })}
                      onRemove={() => handleRemove(film, t.key)}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Modal film */}
      {modal && (
        <MovieModal
          film={modal.film}
          list={modal.list}
          isAdmin={isAdmin}
          onClose={() => setModal(null)}
          onMove={handleMove}
          onNote={handleNote}
          onCritique={handleCritique}
          onRewatch={handleRewatch}
        />
      )}

      {/* Confirmation suppression */}
      {confirmFilm && (
        <ConfirmDialog
          film={confirmFilm}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmFilm(null)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}