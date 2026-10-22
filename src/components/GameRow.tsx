import { formatGameTime, gameStatusLabel } from '../api'
import type { ScheduleGame } from '../types'

type Props = {
  game: ScheduleGame
}

export function GameRow({ game }: Props) {
  const status = gameStatusLabel(game)
  const isLive = game.gameState === 'LIVE' || game.gameState === 'CRIT'
  const networks = (game.tvBroadcasts ?? [])
    .slice()
    .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
    .map((broadcast) => broadcast.network)
    .filter((network, index, list) => list.indexOf(network) === index)
    .slice(0, 3)

  return (
    <article className={`game-row${isLive ? ' is-live' : ''}`}>
      <div className="game-time">
        <span className="game-clock">{formatGameTime(game.startTimeUTC)}</span>
        <span className={`game-status${isLive ? ' live' : ''}`}>{status}</span>
      </div>

      <div className="matchup">
        <TeamSide
          logo={game.awayTeam.logo}
          place={game.awayTeam.placeName.default}
          name={game.awayTeam.commonName.default}
          abbrev={game.awayTeam.abbrev}
          role="Away"
        />
        <span className="at-mark" aria-hidden="true">
          @
        </span>
        <TeamSide
          logo={game.homeTeam.logo}
          place={game.homeTeam.placeName.default}
          name={game.homeTeam.commonName.default}
          abbrev={game.homeTeam.abbrev}
          role="Home"
        />
      </div>

      <div className="game-meta">
        <p className="venue">{game.venue.default}</p>
        {networks.length > 0 ? <p className="broadcasts">{networks.join(' · ')}</p> : null}
      </div>
    </article>
  )
}

type TeamSideProps = {
  logo: string
  place: string
  name: string
  abbrev: string
  role: string
}

function TeamSide({ logo, place, name, abbrev, role }: TeamSideProps) {
  return (
    <div className="team-side">
      <img src={logo} alt="" width={48} height={48} loading="lazy" />
      <div>
        <span className="team-role">{role}</span>
        <p className="team-place">{place}</p>
        <p className="team-name">
          {name} <span className="team-abbrev">{abbrev}</span>
        </p>
      </div>
    </div>
  )
}
