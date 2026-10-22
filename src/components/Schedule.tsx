import { formatDayHeading, isUpcomingGame } from '../api'
import type { GameWeekDay } from '../types'
import { GameRow } from './GameRow'

type Props = {
  days: GameWeekDay[]
}

export function Schedule({ days }: Props) {
  const upcomingDays = days
    .map((day) => ({
      ...day,
      games: day.games.filter(isUpcomingGame),
    }))
    .filter((day) => day.games.length > 0)

  if (upcomingDays.length === 0) {
    return (
      <p className="empty-state">No upcoming NHL games in this window. Check back soon.</p>
    )
  }

  return (
    <div className="schedule">
      {upcomingDays.map((day) => (
        <section key={day.date} className="day-block">
          <header className="day-header">
            <h2>{formatDayHeading(day.date)}</h2>
            <p>
              {day.games.length} {day.games.length === 1 ? 'game' : 'games'}
            </p>
          </header>
          <div className="day-games">
            {day.games.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
