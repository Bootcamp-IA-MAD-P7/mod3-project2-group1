import { OVERVIEW_CHART, OVERVIEW_TOTAL } from "@/mocks/dashboard"
import { Card } from "@/shared/ui/card"

const WIDTH = 560
const HEIGHT = 230
const CHART_TOP = 14
const CHART_BOTTOM = 176
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP
const BAR_WIDTH = 44
const MAX_VALUE = Math.max(
  ...OVERVIEW_CHART.map((day) => day.safe + day.toxic + day.highRisk)
)

const slot = WIDTH / OVERVIEW_CHART.length

function scaledHeight(value: number) {
  return (value / MAX_VALUE) * CHART_HEIGHT
}

function barY(value: number) {
  return CHART_BOTTOM - scaledHeight(value)
}

function barX(index: number) {
  return slot * index + (slot - BAR_WIDTH) / 2
}

const GRIDLINES = [0.25, 0.5, 0.75]

function formatValue(value: number) {
  return value.toLocaleString("en-US")
}

const LEGEND = [
  { label: "Safe", swatch: "bg-violet-200" },
  { label: "Potentially toxic", swatch: "bg-violet-400" },
  { label: "High risk", swatch: "bg-violet-700" },
]

export function ModerationOverview() {
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Moderation overview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Comments analyzed over the last 7 days
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          {OVERVIEW_TOTAL} total
        </span>
      </div>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Bar chart of comments analyzed over the last 7 days, split by safety status"
        >
          <title>
            Bar chart: comments analyzed from Monday to Sunday, split into safe,
            potentially toxic and high risk
          </title>

          {GRIDLINES.map((ratio) => {
            const y = CHART_TOP + CHART_HEIGHT * (1 - ratio)
            return (
              <line
                key={`grid-${ratio}`}
                x1="8"
                x2={WIDTH - 8}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-slate-200 dark:text-slate-700"
              />
            )
          })}
          <line
            x1="8"
            x2={WIDTH - 8}
            y1={CHART_BOTTOM}
            y2={CHART_BOTTOM}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-slate-300 dark:text-slate-600"
          />

          {OVERVIEW_CHART.map((day, index) => {
            const x = barX(index)
            const safeBottom = barY(day.safe)
            const toxicBottom = barY(day.safe + day.toxic)
            const highBottom = barY(day.safe + day.toxic + day.highRisk)
            const total = day.safe + day.toxic + day.highRisk

            return (
              <g key={day.day}>
                <rect
                  x={x}
                  y={safeBottom}
                  width={BAR_WIDTH}
                  height={CHART_BOTTOM - safeBottom}
                  rx="3"
                  className="fill-violet-200"
                >
                  <title>{`Safe: ${formatValue(day.safe)}`}</title>
                </rect>
                <rect
                  x={x}
                  y={toxicBottom}
                  width={BAR_WIDTH}
                  height={safeBottom - toxicBottom}
                  rx="3"
                  className="fill-violet-400"
                >
                  <title>{`Potentially toxic: ${formatValue(day.toxic)}`}</title>
                </rect>
                <rect
                  x={x}
                  y={highBottom}
                  width={BAR_WIDTH}
                  height={toxicBottom - highBottom}
                  rx="3"
                  className="fill-violet-700"
                >
                  <title>{`High risk: ${formatValue(day.highRisk)}`}</title>
                </rect>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  className="fill-slate-500 dark:fill-slate-400"
                >
                  {day.day}
                </text>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={CHART_BOTTOM + 22}
                  textAnchor="middle"
                  fontSize="11"
                  className="fill-slate-400 dark:fill-slate-500"
                >
                  {formatValue(total)}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          {LEGEND.map((entry) => (
            <span
              key={entry.label}
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
            >
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-sm ${entry.swatch}`}
              />
              {entry.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}