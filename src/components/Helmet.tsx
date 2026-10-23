import { HELMET_COLORS, HELMET_ROWS } from '../helmetSprite'

export function Helmet() {
  const width = HELMET_ROWS[0]?.length ?? 0

  return (
    <svg
      className="helmet"
      viewBox={`0 0 ${width} ${HELMET_ROWS.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {HELMET_ROWS.flatMap((row, y) =>
        [...row].flatMap((cell, x) => {
          const fill = HELMET_COLORS[cell]
          if (!fill) return []
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
        }),
      )}
    </svg>
  )
}
