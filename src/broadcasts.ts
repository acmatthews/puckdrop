import type { ScheduleGame } from './types'

export type BroadcastCountry = 'CA' | 'US' | 'GB'

export type BroadcastChip = {
  country: BroadcastCountry
  countryName: string
  network: string
}

const ORDER: Record<BroadcastCountry, number> = { CA: 0, US: 1, GB: 2 }

const NAMES: Record<BroadcastCountry, string> = {
  CA: 'Canada',
  US: 'United States',
  GB: 'United Kingdom',
}

function countryOf(code: string): BroadcastCountry | null {
  switch (code.trim().toUpperCase()) {
    case 'CA':
    case 'CAN':
      return 'CA'
    case 'US':
    case 'USA':
      return 'US'
    case 'GB':
    case 'UK':
    case 'GBR':
      return 'GB'
    default:
      return null
  }
}

export function broadcastChips(game: ScheduleGame): BroadcastChip[] {
  const seen = new Set<string>()
  const chips: Array<BroadcastChip & { sequence: number }> = []

  for (const broadcast of game.tvBroadcasts ?? []) {
    const country = countryOf(broadcast.countryCode)
    if (!country) continue
    const network = broadcast.network.trim().replace(/\s+/g, ' ')
    if (!network) continue
    const key = `${country}:${network.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    chips.push({
      country,
      countryName: NAMES[country],
      network,
      sequence: broadcast.sequenceNumber,
    })
  }

  chips.sort((a, b) => ORDER[a.country] - ORDER[b.country] || a.sequence - b.sequence)
  return chips.map((chip) => ({
    country: chip.country,
    countryName: chip.countryName,
    network: chip.network,
  }))
}
