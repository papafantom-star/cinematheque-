import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const empty = { want: [], year: [], prev: [] }

export function useMovies() {
  const [db, setDb] = useState(empty)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMovies() }, [])

  async function fetchMovies() {
    setLoading(true)
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .order('added_at', { ascending: false })
    if (!error) {
      const next = { want: [], year: [], prev: [] }
      data.forEach(row => {
        const f = {
          id: row.id, title: row.title, year: row.year,
          poster: row.poster, overview: row.overview,
          rating: row.rating, myRating: row.my_rating,
          critique: row.critique, rewatch: row.rewatch,
          addedAt: row.added_at, list: row.list
        }
        if (next[f.list]) next[f.list].push(f)
      })
      setDb(next)
    }
    setLoading(false)
  }

  async function addMovie(film) {
    const f = { ...film, addedAt: new Date().toISOString() }
    setDb(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(l => { next[l] = next[l].filter(x => x.id !== f.id) })
      next[f.list] = [f, ...next[f.list]]
      return next
    })
    await supabase.from('films').upsert({
      id: f.id, title: f.title, year: f.year, poster: f.poster,
      overview: f.overview, rating: f.rating, my_rating: f.myRating,
      critique: f.critique, rewatch: f.rewatch || false,
      added_at: f.addedAt, list: f.list
    })
  }

  async function removeMovie(id, list) {
    setDb(prev => ({ ...prev, [list]: prev[list].filter(x => x.id !== id) }))
    await supabase.from('films').delete().eq('id', id)
  }

  async function moveMovie(film, toList) {
    const rewatch = (film.list === 'prev' && toList === 'year') || toList === 'prev'
      ? true : toList === 'want' ? false : film.rewatch
    const updated = { ...film, list: toList, rewatch, addedAt: new Date().toISOString() }
    setDb(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(l => { next[l] = next[l].filter(x => x.id !== film.id) })
      next[toList] = [updated, ...next[toList]]
      return next
    })
    await supabase.from('films').update({ list: toList, rewatch, added_at: updated.addedAt }).eq('id', film.id)
  }

  async function updateNote(id, list, note) {
    const myRating = note
    setDb(prev => ({
      ...prev,
      [list]: prev[list].map(f => f.id === id ? { ...f, myRating } : f)
    }))
    await supabase.from('films').update({ my_rating: myRating }).eq('id', id)
  }

  async function updateCritique(id, list, critique) {
    setDb(prev => ({
      ...prev,
      [list]: prev[list].map(f => f.id === id ? { ...f, critique } : f)
    }))
    await supabase.from('films').update({ critique }).eq('id', id)
  }

  async function updateRewatch(id, list, rewatch) {
    setDb(prev => ({
      ...prev,
      [list]: prev[list].map(f => f.id === id ? { ...f, rewatch } : f)
    }))
    await supabase.from('films').update({ rewatch }).eq('id', id)
  }

  return { db, loading, addMovie, removeMovie, moveMovie, updateNote, updateCritique, updateRewatch }
}