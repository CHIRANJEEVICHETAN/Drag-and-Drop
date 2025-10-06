"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, Plus, Zap, ChevronRight, X, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react"
import { WIDGET_TYPES, type WidgetType } from "./widgets/WidgetRegistry"
import { useDashboardStore } from "@/store/dashboardStore"

interface WidgetSidebarProps {
  isOpen: boolean
  onToggle?: () => void
}

export function WidgetSidebar({ isOpen, onToggle }: WidgetSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAnimating, setIsAnimating] = useState(false)
  const { addWidget, widgets } = useDashboardStore()

  const categories = [
    { id: "all", name: "All", count: WIDGET_TYPES.length },
    { id: "charts", name: "Charts", count: WIDGET_TYPES.filter((w) => w.category === "charts").length },
    { id: "iiot", name: "IIoT", count: WIDGET_TYPES.filter((w) => w.category === "iiot").length },
    { id: "analytics", name: "Analytics", count: WIDGET_TYPES.filter((w) => w.category === "analytics").length },
  ]

  const filteredWidgets = WIDGET_TYPES.filter((widget) => {
    const matchesSearch =
      widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddWidget = (widgetType: WidgetType) => {
    setIsAnimating(true)

    // Find next available position
    const existingPositions = widgets.map((w) => ({ x: w.layout.x, y: w.layout.y }))
    let x = 0
    let y = 0

    // Simple positioning logic - find first available spot
    while (existingPositions.some((pos) => pos.x === x && pos.y === y)) {
      x += widgetType.defaultSize.w
      if (x >= 12) {
        x = 0
        y += widgetType.defaultSize.h
      }
    }

    const newWidget = {
      type: widgetType.id,
      title: widgetType.name,
      config: {},
      layout: {
        i: `widget-${Date.now()}`,
        x,
        y,
        w: widgetType.defaultSize.w,
        h: widgetType.defaultSize.h,
        minW: widgetType.minSize.w,
        minH: widgetType.minSize.h,
      },
    }

    setTimeout(() => {
      addWidget(newWidget)
      setIsAnimating(false)
    }, 150)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        const searchInput = document.getElementById("widget-search")
        searchInput?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <TooltipProvider>
      <div className="relative">
        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <div className="w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-lg">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Widget Library</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Zap className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick add widgets</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="widget-search"
                  placeholder="Search widgets... (Ctrl+/)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer capitalize transition-all duration-200 hover:scale-105"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredWidgets.map((widget, index) => (
                <div
                  key={widget.id}
                  className="group p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 animate-fade-in cursor-grab active:cursor-grabbing"
                  style={{ animationDelay: `${index * 50}ms` }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(widget))
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onDragEnd={() => {
                    // Reset cursor
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors duration-200">
                        <widget.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {widget.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {widget.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {widget.category}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {widget.defaultSize.w}×{widget.defaultSize.h}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            onClick={() => handleAddWidget(widget)}
                            disabled={isAnimating}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to add {widget.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                </div>
              ))}

              {filteredWidgets.length === 0 && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">No widgets found</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>Click to add widgets</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  <span>Drag to add widgets</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded">/</kbd>
                  <span>to search</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
