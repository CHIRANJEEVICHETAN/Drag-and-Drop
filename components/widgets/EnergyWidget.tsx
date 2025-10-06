"use client"

import { BaseWidget } from "./BaseWidget"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Zap, TrendingUp, TrendingDown } from "lucide-react"

interface EnergyData {
  current: number
  unit: string
  trend: number
  cost: number
  history: Array<{ time: string; value: number }>
}

interface EnergyWidgetProps {
  id: string
  title?: string
  data?: EnergyData
}

const defaultData: EnergyData = {
  current: 245.7,
  unit: "kW",
  trend: -3.2,
  cost: 29.48,
  history: [
    { time: "00:00", value: 220 },
    { time: "04:00", value: 235 },
    { time: "08:00", value: 280 },
    { time: "12:00", value: 265 },
    { time: "16:00", value: 290 },
    { time: "20:00", value: 245 },
  ],
}

export function EnergyWidget({ id, title = "Energy Consumption", data = defaultData }: EnergyWidgetProps) {
  return (
    <BaseWidget id={id} title={title}>
      <div className="space-y-4">
        {/* Current Consumption */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.current}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{data.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {data.trend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-500" />
                )}
                <span className={`text-xs ${data.trend > 0 ? "text-red-600" : "text-green-600"}`}>
                  {data.trend > 0 ? "+" : ""}
                  {data.trend}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">${data.cost}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Today's cost</div>
          </div>
        </div>

        {/* Energy Chart */}
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value: number) => [`${value} ${data.unit}`, "Consumption"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#eab308" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
            <div className="text-xs text-slate-600 dark:text-slate-400">Peak</div>
            <div className="text-sm font-bold">290 kW</div>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
            <div className="text-xs text-slate-600 dark:text-slate-400">Avg</div>
            <div className="text-sm font-bold">255 kW</div>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
            <div className="text-xs text-slate-600 dark:text-slate-400">Min</div>
            <div className="text-sm font-bold">220 kW</div>
          </div>
        </div>
      </div>
    </BaseWidget>
  )
}
