"use client"

import { BaseWidget } from "./BaseWidget"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricItem {
  label: string
  value: string | number
  change?: number
  unit?: string
}

interface MetricsWidgetProps {
  id: string
  title?: string
  metrics?: MetricItem[]
}

const defaultMetrics: MetricItem[] = [
  { label: "Production Rate", value: 1247, change: 12.5, unit: "units/hr" },
  { label: "Quality Score", value: 98.2, change: -0.3, unit: "%" },
  { label: "Energy Usage", value: 2.4, change: 0, unit: "kWh" },
  { label: "Downtime", value: "2.1", change: -15.2, unit: "hrs" },
]

export function MetricsWidget({ id, title = "Production Metrics", metrics = defaultMetrics }: MetricsWidgetProps) {
  const getTrendIcon = (change?: number) => {
    if (!change || change === 0) return <Minus className="h-3 w-3 text-slate-400" />
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    return <TrendingDown className="h-3 w-3 text-red-500" />
  }

  const getTrendColor = (change?: number) => {
    if (!change || change === 0) return "text-slate-600 dark:text-slate-400"
    if (change > 0) return "text-green-600 dark:text-green-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <BaseWidget id={id} title={title}>
      <div className="grid grid-cols-2 gap-4 h-full">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{metric.value}</span>
                {metric.unit && <span className="text-xs text-slate-500 dark:text-slate-400">{metric.unit}</span>}
              </div>
              {metric.change !== undefined && (
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(metric.change)}`}>
                  {getTrendIcon(metric.change)}
                  <span>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </BaseWidget>
  )
}
