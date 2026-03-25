/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'

const TMDB_KEY = 'c8165e84c9231df28515e0ef5e0b10a9'
const IMG_BASE = 'https://image.tmdb.org/t/p/'

export function useTMDB() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => search(query), 380)
    return () => clearTimeout(timer.current)
  }, [query])

  async function search(q) {
  setSearching(true)
  try {
    // Si l'utilisateur tape "id:12598" on cherche directement par ID
    if (q.startsWith('id:')) {
      const id = q.replace('id:', '').trim()
      const r = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=fr-FR`
      )
      if (!r.ok) throw new Error('Film introuvable')
      const m = await r.json()
      setResults([{
        id: 't' + m.id,
        title: m.title,
        year: (m.release_date || '').slice(0, 4),
        poster: m.poster_path ? IMG_BASE + 'w342' + m.poster_path : null,
        posterThumb: m.poster_path ? IMG_BASE + 'w92' + m.poster_path : null,
        overview: m.overview || '',
        rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : null,
        myRating: null, critique: null, rewatch: false
      }])
    } else {
      // Recherche normale par titre
      const r = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&language=fr-FR`
      )
      if (!r.ok) throw new Error('Erreur TMDB')
      const d = await r.json()
      const mapped = (d.results || []).slice(0, 6).map(m => ({
        id: 't' + m.id,
        title: m.title,
        year: (m.release_date || '').slice(0, 4),
        poster: m.poster_path ? IMG_BASE + 'w342' + m.poster_path : null,
        posterThumb: m.poster_path ? IMG_BASE + 'w92' + m.poster_path : null,
        overview: m.overview || '',
        rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : null,
        myRating: null, critique: null, rewatch: false
      }))
      setResults(mapped)
    }
  } catch (e) {
    console.error('Erreur recherche TMDB :', e)
    setResults([])
  }
  setSearching(false)
}}