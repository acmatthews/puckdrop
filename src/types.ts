export type LocalizedName = {
  default: string
  fr?: string
}

export type TvBroadcast = {
  id: number
  market: string
  countryCode: string
  network: string
  sequenceNumber: number
}

export type ScheduleTeam = {
  id: number
  commonName: LocalizedName
  placeName: LocalizedName
  abbrev: string
  logo: string
  darkLogo: string
  score?: number
}

export type ScheduleGame = {
  id: number
  season: number
  gameType: number
  venue: LocalizedName
  neutralSite?: boolean
  startTimeUTC: string
  easternUTCOffset: string
  venueTimezone: string
  gameState: string
  gameScheduleState: string
  tvBroadcasts?: TvBroadcast[]
  awayTeam: ScheduleTeam
  homeTeam: ScheduleTeam
  gameCenterLink?: string
}

export type GameWeekDay = {
  date: string
  dayAbbrev: string
  numberOfGames: number
  games: ScheduleGame[]
}

export type ScheduleResponse = {
  nextStartDate: string
  previousStartDate: string
  gameWeek: GameWeekDay[]
}
