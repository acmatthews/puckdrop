import { useEffect, useRef, useState } from 'react'
import { gameClocks, gameStatusLabel } from '../api'
import { broadcastRows } from '../broadcasts'
import { Flag } from './Flags'
import { framePixelSize, visibleMapFrame, type MapFrame } from '../map/frame'
import { countryPath, lakePath, mapFit } from '../map/land'
import { cityPins } from '../map/pins'
import type { GameWeekDay, ScheduleGame } from '../types'

type Props = {
  days: GameWeekDay[]
}

export function GameMap({ days }: Props) {
  const pins = cityPins(days)
  const stageRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<{ frame: MapFrame; width: number; height: number } | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = pins.find((pin) => pin.id === activeId) ?? null
  const frame = layout?.frame ?? { x: 0, y: 0, w: mapFit.width, h: mapFit.height }

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const next = visibleMapFrame(rect.width, rect.height)
      const size = framePixelSize(next, rect.width, rect.height)
      setLayout({ frame: next, width: size.width, height: size.height })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="stage" ref={stageRef} onClick={() => setActiveId(null)}>
      <div
        className="map-fit"
        style={layout ? { width: layout.width, height: layout.height } : { width: '100%', height: '100%' }}
      >
      <svg
        className="continent"
        viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`}
        role="img"
        aria-label="Map of North America"
      >
        <path className="land" d={countryPath} />
        <path className="lakes" d={lakePath} />
      </svg>
      <div className="scanlines" aria-hidden="true" />

      <div className="pins">
        {pins.map((pin) => {
          const xPct = ((pin.x - frame.x) / frame.w) * 100
          const yPct = ((pin.y - frame.y) / frame.h) * 100
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
  const clocks = gameClocks(game.startTimeUTC)
  const when = clocks.local ? `${clocks.eastern}; your time ${clocks.local}` : clocks.eastern
  const broadcasts = broadcastRows(game)
    .map((row) => `${row.countryName} ${row.network}`)
    .join('; ')
  return `${city}: ${game.awayTeam.commonName.default} at ${game.homeTeam.commonName.default}, ${when}. On ${broadcasts}.`
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
  const broadcasts = broadcastRows(game)
  const clocks = gameClocks(game.startTimeUTC)

  return (
    <article className="card">
      <header className="card-head">
        <p className="card-city">{city}</p>
        <p className="card-venue">{game.venue.default}</p>
        <p className="card-when">{clocks.eastern}</p>
        {clocks.local ? <p className="card-when card-when-local">Your time · {clocks.local}</p> : null}
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
      <ul className="broadcasts">
        {broadcasts.map((row) => (
          <li key={row.country}>
            <Flag country={row.country} />
            <span className={row.network === 'N/A' ? 'broadcast-network is-na' : 'broadcast-network'}>
              - {row.network}
            </span>
          </li>
        ))}
      </ul>
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

