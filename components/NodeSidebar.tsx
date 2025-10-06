"use client"

import type React from "react"

import { Database, BarChart3, AlertTriangle, FileText, Info, Keyboard } from "lucide-react"

const nodeTypes = [
  {
    type: "device",
    label: "Device Node",
    icon: Database,
    color: "from-blue-500 to-blue-600",
    description: "Data source or sensor",
  },
  {
    type: "metric",
    label: "Metric Node",
    icon: BarChart3,
    color: "from-green-500 to-green-600",
    description: "Calculate metrics",
  },
  {
    type: "alert",
    label: "Alert Node",
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
    description: "Trigger notifications",
  },
  {
    type: "report",
    label: "Report Node",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    description: "Generate reports",
  },
]

const shortcuts = [
  { key: "Ctrl+Z", action: "Undo" },
  { key: "Ctrl+Y", action: "Redo" },
  { key: "Delete", action: "Delete selected" },
  { key: "Ctrl+A", action: "Select all" },
  { key: "Space", action: "Pan mode" },
  { key: "Escape", action: "Deselect" },
]

export function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"

    const dragElement = event.currentTarget as HTMLElement
    dragElement.style.opacity = "0.5"

    setTimeout(() => {
      dragElement.style.opacity = "1"
    }, 0)
  }

  const onDragEnd = (event: React.DragEvent) => {
    const dragElement = event.currentTarget as HTMLElement
    dragElement.style.opacity = "1"
  }

  return (
    <div className="w-64 bg-card/50 backdrop-blur-sm border-r border-border p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Node Palette</h2>
        <p className="text-sm text-muted-foreground">Drag nodes to the canvas to create your workflow</p>
      </div>

      <div className="space-y-3 mb-8">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon
          return (
            <div
              key={nodeType.type}
              className="group cursor-grab active:cursor-grabbing transition-all duration-200"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
              onDragEnd={onDragEnd}
            >
              <div className="p-3 rounded-lg border border-border bg-card/80 hover:bg-card transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-95">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${nodeType.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm">{nodeType.label}</h3>
                    <p className="text-xs text-muted-foreground truncate">{nodeType.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Quick Tips</h3>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag nodes from palette to canvas</li>
            <li>• Connect nodes by dragging from handles</li>
            <li>• Click edges to delete connections</li>
            <li>• Right-click nodes for more options</li>
            <li>• Use toolbar for canvas controls</li>
            <li>• Mouse wheel to zoom, drag to pan</li>
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Keyboard className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Shortcuts</h3>
          </div>
          <div className="space-y-1">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{shortcut.action}</span>
                <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background border border-border rounded">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
