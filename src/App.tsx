import { useEffect, useState } from 'react'
import { fetchSchedule } from './api'
import { GameMap } from './components/GameMap'
import { Helmet } from './components/Helmet'
import type { GameWeekDay } from './types'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; days: GameWeekDay[] }

export default function App() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchSchedule()
        if (!cancelled) setState({ status: 'ready', days: data.gameWeek })
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Could not load the schedule.',
          })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const days = state.status === 'ready' ? state.days : []

  return (
    <div className="app">
      <header className="topbar">
        <Helmet />
        <div className="marquee-copy">
          <p className="brand">puckdrop</p>
          <h1>Next game in each city</h1>
        </div>
      </header>

      <main className="screen">
        <GameMap days={days} />
        {state.status === 'loading' ? <p className="status-line">Loading the schedule…</p> : null}
        {state.status === 'error' ? (
          <p className="status-line error" role="alert">
            {state.message}
          </p>
        ) : null}
      </main>

      <footer className="footer">
        <p className="hint">Hover a city for the matchup. Eastern time, and yours.</p>
        <p>Schedule data from the public NHL web API. Not affiliated with the National Hockey League.</p>
      </footer>
    </div>
  )
}
