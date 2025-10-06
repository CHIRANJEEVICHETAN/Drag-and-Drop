"use client"

import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { useDashboardStore } from "@/store/dashboardStore"
import { getWidgetComponent, getWidgetType } from "./widgets/WidgetRegistry"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, ChevronDown } from "lucide-react"
import type { Layout } from "react-grid-layout"

const ResponsiveGridLayout = WidthProvider(Responsive)

export function DashboardCanvas() {
  const { widgets, layout, updateLayout, addWidget } = useDashboardStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [canvasHeight, setCanvasHeight] = useState(400)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Calculate canvas height based on widget positions
  useEffect(() => {
    if (layout.length > 0) {
      const maxY = Math.max(...layout.map(l => l.y + l.h))
      const calculatedHeight = Math.max(600, maxY * 60 + 500) // 60px per row + extra padding
      setCanvasHeight(calculatedHeight)
      
      // Show scroll hint if content is taller than viewport
      if (calculatedHeight > window.innerHeight) {
        setShowScrollHint(true)
        // Hide hint after 3 seconds
        setTimeout(() => setShowScrollHint(false), 3000)
      }
    } else {
      setCanvasHeight(400)
      setShowScrollHint(false)
    }
  }, [layout])

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedLayout = newLayout.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH,
      }))
      updateLayout(updatedLayout)
    },
    [updateLayout],
  )

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragStop = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Only set drag over to false if we're actually leaving the canvas area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const widgetData = JSON.parse(e.dataTransfer.getData('application/json'))
      if (widgetData && widgetData.id) {
        const widgetType = getWidgetType(widgetData.id)
        if (widgetType) {
          // Calculate drop position relative to canvas
          const canvasRect = canvasRef.current?.getBoundingClientRect()
          if (canvasRect) {
            const dropX = e.clientX - canvasRect.left
            const dropY = e.clientY - canvasRect.top
            
            // Convert pixel coordinates to grid coordinates
            const gridX = Math.floor(dropX / (canvasRect.width / 12)) // Assuming 12 columns
            const gridY = Math.floor(dropY / 60) // Assuming 60px row height
            
            const newWidget = {
              type: widgetType.id,
              title: widgetType.name,
              config: {},
              layout: {
                i: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                x: Math.max(0, Math.min(gridX, 12 - widgetType.defaultSize.w)),
                y: Math.max(0, gridY),
                w: widgetType.defaultSize.w,
                h: widgetType.defaultSize.h,
                minW: widgetType.minSize.w,
                minH: widgetType.minSize.h,
              },
            }
            
            addWidget(newWidget)
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse dropped widget data:', error)
    }
  }, [addWidget])

  const handleAddFirstWidget = () => {
    // Add a sample bar chart widget
    const widgetType = getWidgetType("bar-chart")
    if (widgetType) {
      const newWidget = {
        type: widgetType.id,
        title: widgetType.name,
        config: {},
        layout: {
          i: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: 0,
          y: 0,
          w: widgetType.defaultSize.w,
          h: widgetType.defaultSize.h,
          minW: widgetType.minSize.w,
          minH: widgetType.minSize.h,
        },
      }
      addWidget(newWidget)
    }
  }

  const handleLoadSampleTemplate = () => {
    // Add multiple sample widgets
    const sampleWidgets = [
      { type: "bar-chart", x: 0, y: 0, w: 6, h: 4 },
      { type: "line-chart", x: 6, y: 0, w: 6, h: 4 },
      { type: "oee-widget", x: 0, y: 4, w: 4, h: 5 },
      { type: "machine-status", x: 4, y: 4, w: 4, h: 3 },
      { type: "energy-widget", x: 8, y: 4, w: 4, h: 4 },
    ]

    sampleWidgets.forEach((sample, index) => {
      const widgetType = getWidgetType(sample.type)
      if (widgetType) {
        setTimeout(() => {
          const newWidget = {
            type: widgetType.id,
            title: widgetType.name,
            config: {},
            layout: {
              i: `widget-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
              x: sample.x,
              y: sample.y,
              w: sample.w,
              h: sample.h,
              minW: widgetType.minSize.w,
              minH: widgetType.minSize.h,
            },
          }
          addWidget(newWidget)
        }, index * 100) // Stagger the additions
      }
    })
  }

  const renderedWidgets = useMemo(() => {
    return widgets.map((widget) => {
      const WidgetComponent = getWidgetComponent(widget.type)
      return (
        <div key={widget.id} className="widget-container">
          <WidgetComponent id={widget.id} title={widget.title} {...widget.config} />
        </div>
      )
    })
  }, [widgets])

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

  return (
    <div
      ref={canvasRef}
      className={`w-full dashboard-grid transition-all duration-300 ${
        isDragging ? "cursor-grabbing" : ""
      } ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Scroll Hint */}
      {showScrollHint && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            <span className="text-sm">Scroll down to add more widgets</span>
          </div>
        </div>
      )}

      <div 
        className="p-4"
        style={{ minHeight: `${canvasHeight}px` }}
      >
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Welcome to your IIoT Dashboard
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Start building your analytics dashboard by dragging widgets from the sidebar. Monitor your industrial
                  operations in real-time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleAddFirstWidget}
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Widget
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 bg-transparent"
                  onClick={handleLoadSampleTemplate}
                >
                  <Sparkles className="w-4 h-4" />
                  Load Sample Template
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={breakpoints}
              cols={cols}
              rowHeight={60}
              margin={[12, 12]}
              containerPadding={[0, 0]}
              onLayoutChange={handleLayoutChange}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              isDraggable={true}
              isResizable={true}
              compactType="vertical"
              preventCollision={false}
              useCSSTransforms={true}
              transformScale={1}
            >
              {renderedWidgets}
            </ResponsiveGridLayout>
          </div>
        )}
      </div>
    </div>
  )
}
