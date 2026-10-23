import { mapFit } from './land'
import { project } from './projection'

/** Western, eastern, northern, and southern NHL cities, plus pin padding. */
const EDGE_RINKS = [
  { lon: -123.1089, lat: 49.2778 },
  { lon: -118.2673, lat: 34.043 },
  { lon: -71.0621, lat: 42.3662 },
  { lon: -113.4978, lat: 53.5469 },
  { lon: -80.3256, lat: 26.1584 },
  { lon: -122.354, lat: 47.6221 },
]

const PAD_X = 40
const PAD_TOP = 64
const PAD_BOTTOM = 32

export type MapFrame = {
  x: number
  y: number
  w: number
  h: number
}

const content = contentBox()

function contentBox(): MapFrame {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const rink of EDGE_RINKS) {
    const point = project(rink.lon, rink.lat, mapFit)
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }
  const x = clamp(minX - PAD_X, 0, mapFit.width)
  const y = clamp(minY - PAD_TOP, 0, mapFit.height)
  const right = clamp(maxX + PAD_X, 0, mapFit.width)
  const bottom = clamp(maxY + PAD_BOTTOM, 0, mapFit.height)
  return { x, y, w: right - x, h: bottom - y }
}

/**
 * View of the map that fills a container of the given aspect as far as it can
 * without cropping a host city off the screen.
 */
export function visibleMapFrame(containerWidth: number, containerHeight: number): MapFrame {
  const mapW = mapFit.width
  const mapH = mapFit.height
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { x: 0, y: 0, w: mapW, h: mapH }
  }

  const aspect = containerWidth / containerHeight
  let viewW = Math.max(content.w, content.h * aspect)
  let viewH = viewW / aspect
  const fitted = Math.min(mapW / viewW, mapH / viewH)
  if (fitted < 1) {
    viewW *= fitted
    viewH *= fitted
  }
  if (viewW < content.w || viewH < content.h) {
    viewW = Math.min(mapW, Math.max(content.w, viewW))
    viewH = Math.min(mapH, Math.max(content.h, viewH))
  }

  const centerX = content.x + content.w / 2
  const centerY = content.y + content.h / 2
  const x = clamp(centerX - viewW / 2, 0, mapW - viewW)
  const y = clamp(centerY - viewH / 2, 0, mapH - viewH)
  return { x, y, w: viewW, h: viewH }
}

export function framePixelSize(
  frame: MapFrame,
  containerWidth: number,
  containerHeight: number,
): { width: number; height: number } {
  const frameAspect = frame.w / frame.h
  const containerAspect = containerWidth / containerHeight
  if (containerAspect > frameAspect) {
    const height = containerHeight
    return { width: height * frameAspect, height }
  }
  const width = containerWidth
  return { width, height: width / frameAspect }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
