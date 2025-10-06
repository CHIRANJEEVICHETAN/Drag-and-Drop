"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BaseWidget } from "./BaseWidget"

const sampleData = [
  { name: "Page A", pv: 2400, uv: 1400 },
  { name: "Page B", pv: 1398, uv: 2210 },
  { name: "Page C", pv: 9800, uv: 2290 },
  { name: "Page D", pv: 3908, uv: 2000 },
  { name: "Page E", pv: 4800, uv: 1890 },
  { name: "Page F", pv: 3800, uv: 2390 },
  { name: "Page G", pv: 4300, uv: 3490 },
]

interface BarChartWidgetProps {
  id: string
  title?: string
  data?: any[]
  config?: {
    dataKey1?: string
    dataKey2?: string
    color1?: string
    color2?: string
  }
}

export function BarChartWidget({
  id,
  title = "Bar Chart",
  data = sampleData,
  config = {
    dataKey1: "pv",
    dataKey2: "uv",
    color1: "#3b82f6",
    color2: "#10b981",
  },
}: BarChartWidgetProps) {
  return (
    <BaseWidget id={id} title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
          <YAxis tick={{ fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Bar dataKey={config.dataKey1} fill={config.color1} radius={[2, 2, 0, 0]} />
          <Bar dataKey={config.dataKey2} fill={config.color2} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </BaseWidget>
  )
}
