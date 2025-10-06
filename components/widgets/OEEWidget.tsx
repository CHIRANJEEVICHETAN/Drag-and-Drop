"use client"

import { BaseWidget } from "./BaseWidget"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, Zap, Target } from "lucide-react"

interface OEEData {
  availability: number
  performance: number
  quality: number
  oee: number
  target: number
  trend: number
}

interface OEEWidgetProps {
  id: string
  title?: string
  data?: OEEData
  showTitle?: boolean
}

const defaultData: OEEData = {
  availability: 87.5,
  performance: 92.3,
  quality: 96.8,
  oee: 78.2,
  target: 85.0,
  trend: 2.3,
}

export function OEEWidget({ id, title = "Overall Equipment Effectiveness", data = defaultData, showTitle = true }: OEEWidgetProps) {
  const getOEEStatus = (oee: number, target: number) => {
    if (oee >= target) return { color: "text-green-600 dark:text-green-400", status: "Good" }
    if (oee >= target * 0.9) return { color: "text-yellow-600 dark:text-yellow-400", status: "Warning" }
    return { color: "text-red-600 dark:text-red-400", status: "Critical" }
  }

  const status = getOEEStatus(data.oee, data.target)

  return (
    <BaseWidget id={id} title={title} showTitle={showTitle}>
      <div className="space-y-3">
        {/* OEE Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{data.oee}%</span>
            <div className="flex items-center gap-1">
              {data.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${data.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                {data.trend > 0 ? "+" : ""}
                {data.trend}%
              </span>
            </div>
          </div>
          <Badge variant="outline" className={status.color}>
            {status.status}
          </Badge>
        </div>

        {/* OEE Components */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Availability</span>
            </div>
            <span className="text-sm font-bold">{data.availability}%</span>
          </div>
          <Progress value={data.availability} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <span className="text-sm font-bold">{data.performance}%</span>
          </div>
          <Progress value={data.performance} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Quality</span>
            </div>
            <span className="text-sm font-bold">{data.quality}%</span>
          </div>
          <Progress value={data.quality} className="h-2" />
        </div>

        {/* Target */}
        <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Target OEE</span>
            <span className="font-medium">{data.target}%</span>
          </div>
        </div>
      </div>
    </BaseWidget>
  )
}
