import type { MonthlySolvedTrend } from "@/data/mock/analytics"

export interface SvgLineChartProps {
  data: MonthlySolvedTrend[]
}

export function SvgLineChart({ data }: SvgLineChartProps) {
  // Dimensions
  const width = 500
  const height = 180
  const paddingX = 40
  const paddingY = 25

  const maxVal = 40 // solves y-axis scale max
  const minVal = 0

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / (data.length - 1)
    const y = height - paddingY - ((d.solved - minVal) * (height - paddingY * 2)) / (maxVal - minVal)
    return { x, y, value: d.solved, label: d.month }
  })

  // Construct SVG path string
  const pathD = points.reduce((acc, p, index) => {
    return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, "")

  // Horizontal grid lines
  const gridLines = [10, 20, 30, 40]

  return (
    <div className="w-full overflow-x-auto select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-w-[380px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal grid lines */}
        {gridLines.map(val => {
          const y = height - paddingY - ((val - minVal) * (height - paddingY * 2)) / (maxVal - minVal)
          return (
            <g key={val} className="opacity-10">
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#A1A1AA"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 3}
                fill="#FFFFFF"
                fontSize="9"
                textAnchor="end"
                className="font-bold opacity-60"
              >
                {val}
              </text>
            </g>
          )
        })}

        {/* Path line */}
        <path
          d={pathD}
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, index) => (
          <g key={index} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#09090B"
              stroke="#60A5FA"
              strokeWidth="2"
              className="transition-all hover:r-5 cursor-pointer"
            />
            {/* Value pop-overs */}
            <text
              x={p.x}
              y={p.y - 10}
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              className="opacity-90 bg-black"
            >
              {p.value}
            </text>

            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 6}
              fill="#A1A1AA"
              fontSize="9.5"
              fontWeight="semibold"
              textAnchor="middle"
              className="opacity-70"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
