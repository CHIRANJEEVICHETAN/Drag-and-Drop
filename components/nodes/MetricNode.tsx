"use client"

import { memo, useState, useEffect } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react"

export const MetricNode = memo(({ data, selected }: NodeProps) => {
  const [trend, setTrend] = useState<"up" | "down" | "neutral">("neutral")
  const [value, setValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.random() * 100
      setValue(newValue)
      setTrend(newValue > 50 ? "up" : newValue < 30 ? "down" : "neutral")
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : BarChart3

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-card/90 backdrop-blur-sm border-2 min-w-[150px] transition-all duration-300 hover:shadow-xl ${
        selected ? "border-green-500 shadow-green-500/20" : "border-border hover:border-green-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <TrendIcon
              className={`w-3 h-3 ${
                trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
              }`}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{data.label}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            Metric
            <span className="font-mono">{value.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white transition-all duration-200 hover:w-4 hover:h-4"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white transition-all duration-200 hover:w-4 hover:h-4"
      />
    </div>
  )
})

MetricNode.displayName = "MetricNode"
