const SPRITE = [
  '......................',
  '.......hhhhhh.........',
  '.....HHhhhhhhh........',
  '...HHHHHhhhhhhh.......',
  '..HHHHHhhh..ehh.......',
  '.HHHHHHhhh..ehh.......',
  '.HHHHHHhhhtttt........',
  '.HHHHHHhhhh...........',
  '.HHHHHH...............',
  '.HHHHHjjjjjjjj........',
  '.HHHHjjjjjjjjjj........',
  '.HHHjjjjyyjjjjj........',
  '.HHjjjjjbbjjjjj........',
  '.H.jjjjjjjjjjj.........',
  '....jjjjjjjjj..........',
  '....ppppppppp..........',
  '....pp.....pp..........',
  '....kk.....kk.........',
  '...kk.......kk........',
].join('\n')

const COLORS: Record<string, string> = {
  H: '#e2a84a',
  h: '#f0c2a4',
  e: '#1a100c',
  t: '#3a2414',
  j: '#ff6a00',
  y: '#f2c14b',
  b: '#1d4e9c',
  p: '#1a2744',
  k: '#f6f1e6',
}

export function Mullet() {
  const rows = SPRITE.split('\n')
  const width = rows[0]?.length ?? 0

  return (
    <svg
      className="mullet"
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].flatMap((cell, x) => {
          const fill = COLORS[cell]
          if (!fill) return []
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
        }),
      )}
    </svg>
  )
}
