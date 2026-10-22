const DEG = Math.PI / 180
const PHI1 = 20 * DEG
const PHI2 = 52 * DEG
const PHI0 = 44 * DEG
const LAMBDA0 = -96 * DEG

const n = 0.5 * (Math.sin(PHI1) + Math.sin(PHI2))
const C = Math.cos(PHI1) ** 2 + 2 * n * Math.sin(PHI1)
const rho0 = Math.sqrt(C - 2 * n * Math.sin(PHI0)) / n

export type MapFit = {
  minX: number
  maxY: number
  scale: number
  pad: number
  width: number
  height: number
}

export type ProjectedPoint = {
  x: number
  y: number
}

/** Albers equal-area, before the SVG fit. Y increases north. */
export function projectRaw(lon: number, lat: number): ProjectedPoint {
  const phi = lat * DEG
  const lambda = lon * DEG
  const rho = Math.sqrt(C - 2 * n * Math.sin(phi)) / n
  const theta = n * (lambda - LAMBDA0)
  return {
    x: rho * Math.sin(theta),
    y: rho0 - rho * Math.cos(theta),
  }
}

/** Project to the fitted SVG viewBox. Y increases down. */
export function project(lon: number, lat: number, fit: MapFit): ProjectedPoint {
  const point = projectRaw(lon, lat)
  return {
    x: (point.x - fit.minX) * fit.scale + fit.pad,
    y: (fit.maxY - point.y) * fit.scale + fit.pad,
  }
}
