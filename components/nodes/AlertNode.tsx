"use client"

import { memo, useState, useEffect } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { AlertTriangle, Bell, BellOff } from "lucide-react"

export const AlertNode = memo(({ data, selected }: NodeProps) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-card/90 backdrop-blur-sm border-2 min-w-[150px] transition-all duration-300 hover:shadow-xl ${
        selected ? "border-red-500 shadow-red-500/20" : "border-border hover:border-red-300"
      } ${isActive ? "animate-pulse" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm transition-all duration-300 ${
              isActive ? "shadow-red-500/50" : ""
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            {isActive ? (
              <Bell className="w-3 h-3 text-red-500 animate-bounce" />
            ) : (
              <BellOff className="w-3 h-3 text-gray-500" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{data.label}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            Alert
            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-red-500 animate-pulse" : "bg-gray-400"}`} />
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-white transition-all duration-200 hover:w-4 hover:h-4"
      />
    </div>
  )
})

AlertNode.displayName = "AlertNode"
