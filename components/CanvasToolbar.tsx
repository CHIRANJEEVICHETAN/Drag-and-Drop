"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  MousePointer,
  Square,
  LayoutGrid,
  Eye,
  EyeOff,
  Download,
  Upload,
} from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { useGraphStore } from "@/store/graphStore"

interface CanvasToolbarProps {
  showGrid: boolean
  onToggleGrid: () => void
  showMinimap: boolean
  onToggleMinimap: () => void
}

export function CanvasToolbar({ showGrid, onToggleGrid, showMinimap, onToggleMinimap }: CanvasToolbarProps) {
  const [selectionMode, setSelectionMode] = useState<"pointer" | "selection" | "pan">("pointer")
  const { zoomIn, zoomOut, fitView, getNodes, getEdges } = useReactFlow()
  const { nodes, edges } = useGraphStore()

  const handleZoomIn = () => {
    zoomIn({ duration: 300 })
  }

  const handleZoomOut = () => {
    zoomOut({ duration: 300 })
  }

  const handleFitView = () => {
    fitView({ duration: 500, padding: 0.1 })
  }

  const handleExport = () => {
    const data = {
      nodes: getNodes(),
      edges: getEdges(),
      timestamp: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `eagle-analytics-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (data.nodes && data.edges) {
              // This would need to be implemented in the store
              console.log("Import data:", data)
            }
          } catch (error) {
            console.error("Failed to import file:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const toolbarItems = [
    {
      group: "Selection",
      items: [
        {
          icon: MousePointer,
          label: "Select",
          active: selectionMode === "pointer",
          onClick: () => setSelectionMode("pointer"),
        },
        {
          icon: Square,
          label: "Box Select",
          active: selectionMode === "selection",
          onClick: () => setSelectionMode("selection"),
        },
        {
          icon: Move,
          label: "Pan",
          active: selectionMode === "pan",
          onClick: () => setSelectionMode("pan"),
        },
      ],
    },
    {
      group: "View",
      items: [
        {
          icon: ZoomIn,
          label: "Zoom In",
          onClick: handleZoomIn,
        },
        {
          icon: ZoomOut,
          label: "Zoom Out",
          onClick: handleZoomOut,
        },
        {
          icon: Maximize,
          label: "Fit View",
          onClick: handleFitView,
        },
      ],
    },
    {
      group: "Display",
      items: [
        {
          icon: LayoutGrid,
          label: "Toggle Grid",
          active: showGrid,
          onClick: onToggleGrid,
        },
        {
          icon: showMinimap ? EyeOff : Eye,
          label: "Toggle Minimap",
          active: showMinimap,
          onClick: onToggleMinimap,
        },
      ],
    },
    {
      group: "File",
      items: [
        {
          icon: Download,
          label: "Export",
          onClick: handleExport,
        },
        {
          icon: Upload,
          label: "Import",
          onClick: handleImport,
        },
      ],
    },
  ]

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2">
        <div className="flex items-center gap-1">
          {toolbarItems.map((group, groupIndex) => (
            <div key={group.group} className="flex items-center gap-1">
              {groupIndex > 0 && <div className="w-px h-6 bg-border mx-1" />}
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.label}
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    onClick={item.onClick}
                    className="w-8 h-8 p-0"
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-lg px-3 py-1">
          <span className="text-xs text-muted-foreground">
            {nodes.length} nodes, {edges.length} connections
          </span>
        </div>
      </div>
    </div>
  )
}
