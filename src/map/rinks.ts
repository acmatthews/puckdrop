import type { ScheduleGame } from '../types'

export type Rink = {
  name: string
  lat: number
  lon: number
  abbrev?: string
}

const RINKS: Rink[] = [
  { name: 'Honda Center', lat: 33.8078, lon: -117.8765, abbrev: 'ANA' },
  { name: 'TD Garden', lat: 42.3662, lon: -71.0621, abbrev: 'BOS' },
  { name: 'KeyBank Center', lat: 42.875, lon: -78.8764, abbrev: 'BUF' },
  { name: 'Scotiabank Saddledome', lat: 51.0374, lon: -114.0519, abbrev: 'CGY' },
  { name: 'Lenovo Center', lat: 35.8033, lon: -78.7218, abbrev: 'CAR' },
  { name: 'PNC Arena', lat: 35.8033, lon: -78.7218 },
  { name: 'United Center', lat: 41.8807, lon: -87.6742, abbrev: 'CHI' },
  { name: 'Ball Arena', lat: 39.7487, lon: -105.0077, abbrev: 'COL' },
  { name: 'Nationwide Arena', lat: 39.9693, lon: -83.0061, abbrev: 'CBJ' },
  { name: 'American Airlines Center', lat: 32.7905, lon: -96.8103, abbrev: 'DAL' },
  { name: 'Little Caesars Arena', lat: 42.3411, lon: -83.055, abbrev: 'DET' },
  { name: 'Rogers Place', lat: 53.5469, lon: -113.4978, abbrev: 'EDM' },
  { name: 'Amerant Bank Arena', lat: 26.1584, lon: -80.3256, abbrev: 'FLA' },
  { name: 'FLA Live Arena', lat: 26.1584, lon: -80.3256 },
  { name: 'Crypto.com Arena', lat: 34.043, lon: -118.2673, abbrev: 'LAK' },
  { name: 'Grand Casino Arena', lat: 44.9448, lon: -93.101, abbrev: 'MIN' },
  { name: 'Xcel Energy Center', lat: 44.9448, lon: -93.101 },
  { name: 'Bell Centre', lat: 45.4961, lon: -73.5696, abbrev: 'MTL' },
  { name: 'Centre Bell', lat: 45.4961, lon: -73.5696 },
  { name: 'Bridgestone Arena', lat: 36.1592, lon: -86.7785, abbrev: 'NSH' },
  { name: 'Prudential Center', lat: 40.7336, lon: -74.1711, abbrev: 'NJD' },
  { name: 'UBS Arena', lat: 40.7116, lon: -73.7263, abbrev: 'NYI' },
  { name: 'Madison Square Garden', lat: 40.7505, lon: -73.9934, abbrev: 'NYR' },
  { name: 'Canadian Tire Centre', lat: 45.2969, lon: -75.9273, abbrev: 'OTT' },
  { name: 'Xfinity Mobile Arena', lat: 39.9012, lon: -75.172, abbrev: 'PHI' },
  { name: 'Wells Fargo Center', lat: 39.9012, lon: -75.172 },
  { name: 'PPG Paints Arena', lat: 40.4394, lon: -79.9893, abbrev: 'PIT' },
  { name: 'SAP Center at San Jose', lat: 37.3327, lon: -121.9012, abbrev: 'SJS' },
  { name: 'SAP Center', lat: 37.3327, lon: -121.9012 },
  { name: 'Climate Pledge Arena', lat: 47.6221, lon: -122.354, abbrev: 'SEA' },
  { name: 'Enterprise Center', lat: 38.6268, lon: -90.2026, abbrev: 'STL' },
  { name: 'Benchmark International Arena', lat: 27.9427, lon: -82.4518, abbrev: 'TBL' },
  { name: 'Amalie Arena', lat: 27.9427, lon: -82.4518 },
  { name: 'Scotiabank Arena', lat: 43.6435, lon: -79.3791, abbrev: 'TOR' },
  { name: 'Delta Center', lat: 40.7683, lon: -111.9011, abbrev: 'UTA' },
  { name: 'Rogers Arena', lat: 49.2778, lon: -123.1089, abbrev: 'VAN' },
  { name: 'T-Mobile Arena', lat: 36.1029, lon: -115.1784, abbrev: 'VGK' },
  { name: 'Canada Life Centre', lat: 49.8927, lon: -97.1436, abbrev: 'WPG' },
  { name: 'Princess Auto Stadium', lat: 49.8078, lon: -97.1431 },
  { name: 'Capital One Arena', lat: 38.8981, lon: -77.0209, abbrev: 'WSH' },
]

export function normalizePlace(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const byName = new Map(RINKS.map((rink) => [normalizePlace(rink.name), rink]))
const byAbbrev = new Map(
  RINKS.filter((rink) => rink.abbrev).map((rink) => [rink.abbrev as string, rink]),
)

export function locateRink(game: ScheduleGame): Rink | null {
  const named = byName.get(normalizePlace(game.venue.default))
  if (named) return named
  if (game.neutralSite) return null
  return byAbbrev.get(game.homeTeam.abbrev) ?? null
}
