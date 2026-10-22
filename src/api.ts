import type { ScheduleGame, ScheduleResponse } from './types'

const FINISHED_STATES = new Set(['OFF', 'FINAL'])

export async function fetchSchedule(): Promise<ScheduleResponse> {
  const response = await fetch('/nhl/v1/schedule/now')
  if (!response.ok) {
    throw new Error(`Schedule request failed (${response.status})`)
  }
  return response.json() as Promise<ScheduleResponse>
}

export function isUpcomingGame(game: ScheduleGame): boolean {
  return !FINISHED_STATES.has(game.gameState)
}

export function formatGameTime(startTimeUTC: string, timeZone = 'America/Toronto'): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(startTimeUTC))
}

export function formatDayHeading(date: string, timeZone = 'America/Toronto'): string {
  const parsed = new Date(`${date}T12:00:00`)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(parsed)
}

export function gameStatusLabel(game: ScheduleGame): string {
  switch (game.gameState) {
    case 'LIVE':
    case 'CRIT':
      return 'Live'
    case 'PRE':
      return 'Warmup'
    case 'FUT':
      return 'Upcoming'
    default:
      return game.gameState
  }
}
