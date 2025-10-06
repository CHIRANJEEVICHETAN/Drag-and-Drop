"use client"

import { BaseWidget } from "./BaseWidget"
import { Package, Target, Clock, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProductionData {
  current: number
  target: number
  rate: number
  shift: {
    start: string
    end: string
    produced: number
    remaining: number
  }
  efficiency: number
}

interface ProductionCounterWidgetProps {
  id: string
  title?: string
  data?: ProductionData
}

const defaultData: ProductionData = {
  current: 1247,
  target: 1500,
  rate: 87,
  shift: {
    start: "06:00",
    end: "14:00",
    produced: 1247,
    remaining: 253,
  },
  efficiency: 83.1,
}

export function ProductionCounterWidget({
  id,
  title = "Production Counter",
  data = defaultData,
}: ProductionCounterWidgetProps) {
  const completionPercentage = (data.current / data.target) * 100
  const isOnTrack = data.efficiency >= 80

  return (
    <BaseWidget id={id} title={title}>
      <div className="space-y-4">
        {/* Production Count */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-6 w-6 text-blue-500" />
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.current.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">of {data.target.toLocaleString()} units</div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-medium">{completionPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Rate</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{data.rate}</div>
            <div className="text-xs text-slate-500">units/hr</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Efficiency</span>
            </div>
            <div className={`text-lg font-bold ${isOnTrack ? "text-green-600" : "text-red-600"}`}>
              {data.efficiency}%
            </div>
            <div className="text-xs text-slate-500">{isOnTrack ? "On track" : "Behind"}</div>
          </div>
        </div>

        {/* Shift Information */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Current Shift</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-600 dark:text-slate-400">Time:</span>
              <span className="ml-1 font-medium">
                {data.shift.start} - {data.shift.end}
              </span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Remaining:</span>
              <span className="ml-1 font-medium">{data.shift.remaining} units</span>
            </div>
          </div>
        </div>
      </div>
    </BaseWidget>
  )
}
