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

const EASTERN_TIME_ZONE = 'America/Toronto'

export function formatGameWhen(startTimeUTC: string, timeZone = EASTERN_TIME_ZONE): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(startTimeUTC))
}

export function gameClocks(startTimeUTC: string): { eastern: string; local: string | null } {
  const eastern = formatGameWhen(startTimeUTC, EASTERN_TIME_ZONE)
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!localZone) return { eastern, local: null }

  try {
    const local = formatGameWhen(startTimeUTC, localZone)
    return { eastern, local: local === eastern ? null : local }
  } catch {
    return { eastern, local: null }
  }
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
