import { useState } from 'react'
import { formatGameWhen, gameStatusLabel } from '../api'
import { countryPath, lakePath, mapFit } from '../map/land'
import { cityPins } from '../map/pins'
import type { GameWeekDay, ScheduleGame } from '../types'

type Props = {
  days: GameWeekDay[]
}

export function GameMap({ days }: Props) {
  const pins = cityPins(days)
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = pins.find((pin) => pin.id === activeId) ?? null

  return (
    <div
      className="stage"
      style={{ aspectRatio: `${mapFit.width} / ${mapFit.height}` }}
      onClick={() => setActiveId(null)}
    >
      <svg
        className="continent"
        viewBox={`0 0 ${mapFit.width} ${mapFit.height}`}
        role="img"
        aria-label="Map of North America"
      >
        <path className="land" d={countryPath} />
        <path className="lakes" d={lakePath} />
      </svg>
      <div className="scanlines" aria-hidden="true" />

      <div className="pins">
        {pins.map((pin) => {
          const xPct = (pin.x / mapFit.width) * 100
          const yPct = (pin.y / mapFit.height) * 100
          const open = pin.id === activeId
          const label = pinLabel(pin.city, pin.game)
          return (
            <div
              key={pin.id}
              className={`pin-anchor${open ? ' is-open' : ''}`}
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setActiveId(pin.id)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') {
                  setActiveId((current) => (current === pin.id ? null : current))
                }
              }}
            >
              <button
                type="button"
                className={`pin${pin.isNext ? ' is-next' : ''}`}
                aria-label={label}
                aria-expanded={open}
                onClick={(event) => event.stopPropagation()}
                onPointerUp={(event) => {
                  if (event.pointerType === 'mouse') return
                  setActiveId((current) => (current === pin.id ? null : pin.id))
                }}
              >
                <PinMark />
              </button>
              {open ? (
                <div className={tipClass(xPct, yPct)} role="tooltip">
                  <GameCard city={pin.city} game={pin.game} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {active ? <span className="sr-only">{pinLabel(active.city, active.game)}</span> : null}
    </div>
  )
}

function tipClass(xPct: number, yPct: number): string {
  const classes = ['tip']
  if (yPct < 24) classes.push('below')
  if (xPct < 22) classes.push('start')
  if (xPct > 78) classes.push('end')
  return classes.join(' ')
}

function pinLabel(city: string, game: ScheduleGame): string {
  const when = formatGameWhen(game.startTimeUTC)
  return `${city}: ${game.awayTeam.commonName.default} at ${game.homeTeam.commonName.default}, ${when}`
}

function PinMark() {
  return (
    <svg viewBox="0 0 8 11" shapeRendering="crispEdges" aria-hidden="true">
      <rect className="pin-body" x="2" y="0" width="4" height="1" />
      <rect className="pin-body" x="1" y="1" width="6" height="1" />
      <rect className="pin-body" x="0" y="2" width="8" height="1" />
      <rect className="pin-body" x="0" y="3" width="8" height="1" />
      <rect className="pin-body" x="1" y="4" width="6" height="1" />
      <rect className="pin-body" x="2" y="5" width="4" height="1" />
      <rect className="pin-body" x="3" y="6" width="2" height="5" />
      <rect className="pin-bulb" x="3" y="2" width="2" height="2" />
    </svg>
  )
}

function GameCard({ city, game }: { city: string; game: ScheduleGame }) {
  const status = gameStatusLabel(game)
  const live = game.gameState === 'LIVE' || game.gameState === 'CRIT'
  const networks = uniqueNetworks(game)

  return (
    <article className="card">
      <header className="card-head">
        <p className="card-city">{city}</p>
        <p className="card-venue">{game.venue.default}</p>
        <p className="card-when">{formatGameWhen(game.startTimeUTC)}</p>
        {live ? <p className="card-live">{status}</p> : null}
      </header>
      <div className="card-match">
        <TeamSide
          logo={game.awayTeam.logo}
          place={game.awayTeam.placeName.default}
          name={game.awayTeam.commonName.default}
        />
        <span className="card-at" aria-hidden="true">
          @
        </span>
        <TeamSide
          logo={game.homeTeam.logo}
          place={game.homeTeam.placeName.default}
          name={game.homeTeam.commonName.default}
        />
      </div>
      {networks.length > 0 ? <p className="card-tv">{networks.join(' · ')}</p> : null}
    </article>
  )
}

function TeamSide({ logo, place, name }: { logo: string; place: string; name: string }) {
  return (
    <div className="card-team">
      <img src={logo} alt="" width={52} height={52} />
      <p className="card-place">{place}</p>
      <p className="card-name">{name}</p>
    </div>
  )
}

function uniqueNetworks(game: ScheduleGame): string[] {
  const seen = new Set<string>()
  const networks: string[] = []
  for (const broadcast of game.tvBroadcasts ?? []) {
    if (seen.has(broadcast.network)) continue
    seen.add(broadcast.network)
    networks.push(broadcast.network)
    if (networks.length === 3) break
  }
  return networks
}
