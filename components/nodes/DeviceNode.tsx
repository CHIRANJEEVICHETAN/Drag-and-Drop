"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Database, Wifi, WifiOff } from "lucide-react"

export const DeviceNode = memo(({ data, selected }: NodeProps) => {
  const [isConnected, setIsConnected] = useState(true)

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-card/90 backdrop-blur-sm border-2 min-w-[150px] transition-all duration-300 hover:shadow-xl ${
        selected ? "border-blue-500 shadow-blue-500/20" : "border-border hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            {isConnected ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{data.label}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            Device
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white transition-all duration-200 hover:w-4 hover:h-4"
      />
    </div>
  )
})

DeviceNode.displayName = "DeviceNode"
