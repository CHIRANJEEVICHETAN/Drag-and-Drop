"use client"

import { memo, useState, useEffect } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { FileText, Download, Clock } from "lucide-react"

export const ReportNode = memo(({ data, selected }: NodeProps) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGenerating(true)
      setTimeout(() => {
        setIsGenerating(false)
        setLastGenerated(new Date())
      }, 1500)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-card/90 backdrop-blur-sm border-2 min-w-[150px] transition-all duration-300 hover:shadow-xl ${
        selected ? "border-purple-500 shadow-purple-500/20" : "border-border hover:border-purple-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            {isGenerating ? (
              <Clock className="w-3 h-3 text-blue-500 animate-spin" />
            ) : (
              <Download className="w-3 h-3 text-green-500" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{data.label}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            Report
            {isGenerating ? (
              <span className="text-blue-500">Generating...</span>
            ) : (
              <span>{lastGenerated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white transition-all duration-200 hover:w-4 hover:h-4"
      />
    </div>
  )
})

ReportNode.displayName = "ReportNode"
