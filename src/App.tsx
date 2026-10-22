import { useEffect, useState } from 'react'
import { fetchSchedule } from './api'
import rinkHero from './assets/rink-hero.jpg'
import { Schedule } from './components/Schedule'
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
        if (!cancelled) {
          setState({ status: 'ready', days: data.gameWeek })
        }
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

  return (
    <div className="app">
      <header className="hero">
        <img className="hero-image" src={rinkHero} alt="" />
        <div className="hero-veil" />
        <div className="hero-content">
          <p className="brand">Puck Drop</p>
          <h1>Upcoming NHL games, lined up by the ice.</h1>
          <p className="lede">
            Live slate from the NHL schedule — tonight first, then the rest of the week.
          </p>
          <a className="cta" href="#schedule">
            See the schedule
          </a>
        </div>
      </header>

      <main id="schedule" className="main">
        <div className="section-intro">
          <h2>This week&apos;s puck drops</h2>
          <p>Times shown in Eastern (America/Toronto).</p>
        </div>

        {state.status === 'loading' ? <p className="status-line">Loading the schedule…</p> : null}
        {state.status === 'error' ? (
          <p className="status-line error" role="alert">
            {state.message}
          </p>
        ) : null}
        {state.status === 'ready' ? <Schedule days={state.days} /> : null}
      </main>

      <footer className="footer">
        <p>
          Schedule data from the public NHL web API. Not affiliated with the National Hockey
          League.
        </p>
      </footer>
    </div>
  )
}
