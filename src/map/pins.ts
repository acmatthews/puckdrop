import { isUpcomingGame } from '../api'
import type { GameWeekDay, ScheduleGame } from '../types'
import { mapFit } from './land'
import { project } from './projection'
import { locateRink } from './rinks'

const MIN_SEPARATION = 26
const MAX_DRIFT = 34

export type CityPin = {
  id: string
  x: number
  y: number
  city: string
  game: ScheduleGame
  isNext: boolean
}

export function cityPins(days: GameWeekDay[]): CityPin[] {
  const games = days
    .flatMap((day) => day.games)
    .filter(isUpcomingGame)
    .sort((a, b) => a.startTimeUTC.localeCompare(b.startTimeUTC))

  const seen = new Set<string>()
  const placed: Array<CityPin & { originX: number; originY: number }> = []

  for (const game of games) {
    const key = game.neutralSite
      ? `venue:${game.venue.default.toLowerCase()}`
      : `city:${game.homeTeam.placeName.default.toLowerCase()}`
    if (seen.has(key)) continue
    const rink = locateRink(game)
    if (!rink) continue
    seen.add(key)
    const point = project(rink.lon, rink.lat, mapFit)
    placed.push({
      id: key,
      x: point.x,
      y: point.y,
      originX: point.x,
      originY: point.y,
      city: game.homeTeam.placeName.default,
      game,
      isNext: placed.length === 0,
    })
  }

  separate(placed)

  return placed.map((pin) => ({
    id: pin.id,
    x: pin.x,
    y: pin.y,
    city: pin.city,
    game: pin.game,
    isNext: pin.isNext,
  }))
}

function separate(pins: Array<CityPin & { originX: number; originY: number }>) {
  for (let pass = 0; pass < 16; pass += 1) {
    for (let i = 0; i < pins.length; i += 1) {
      for (let j = i + 1; j < pins.length; j += 1) {
        let dx = pins[j].x - pins[i].x
        let dy = pins[j].y - pins[i].y
        let distance = Math.hypot(dx, dy)
        if (distance >= MIN_SEPARATION) continue
        if (distance < 0.01) {
          const angle = i * 1.7 + j
          dx = Math.cos(angle)
          dy = Math.sin(angle)
          distance = 1
        }
        const push = (MIN_SEPARATION - distance) / 2
        const ux = dx / distance
        const uy = dy / distance
        pins[i].x -= ux * push
        pins[i].y -= uy * push
        pins[j].x += ux * push
        pins[j].y += uy * push
      }
    }

    for (const pin of pins) {
      const dx = pin.x - pin.originX
      const dy = pin.y - pin.originY
      const drift = Math.hypot(dx, dy)
      if (drift > MAX_DRIFT) {
        pin.x = pin.originX + (dx / drift) * MAX_DRIFT
        pin.y = pin.originY + (dy / drift) * MAX_DRIFT
      }
    }
  }
}
