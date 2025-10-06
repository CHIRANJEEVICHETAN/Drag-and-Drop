"use client"

import React, { useState, useMemo } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { Search, Filter, ChevronLeft } from "lucide-react"
import { WIDGET_TYPES } from "../widgets/WidgetRegistry"
import type { WidgetLibraryConfig } from "./DashboardBuilder"

interface WidgetSidebarProps {
  isOpen: boolean
  onToggle?: () => void
  config?: WidgetLibraryConfig
}

export function WidgetSidebar({ isOpen, onToggle, config }: WidgetSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Merge with default config
  const finalConfig = {
    categories: ['charts', 'iiot', 'analytics'],
    showSearch: true,
    showCategories: true,
    maxWidgets: 50,
    customWidgets: [],
    ...config
  }

  // Combine default and custom widgets
  const allWidgets = useMemo(() => {
    const widgets = [...WIDGET_TYPES, ...(finalConfig.customWidgets || [])]
    return widgets.slice(0, finalConfig.maxWidgets)
  }, [finalConfig.customWidgets, finalConfig.maxWidgets])

  // Filter widgets based on search and category
  const filteredWidgets = useMemo(() => {
    let filtered = allWidgets

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(widget => widget.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(widget =>
        widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        widget.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [allWidgets, selectedCategory, searchTerm])

  // Get unique categories from available widgets
  const availableCategories = useMemo(() => {
    const categories = new Set(allWidgets.map(widget => widget.category))
    return Array.from(categories)
  }, [allWidgets])

  const handleDragStart = (e: React.DragEvent, widget: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(widget))
    e.dataTransfer.effectAllowed = 'copy'
  }

  if (!isOpen) return null

  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Widget Library
          </h2>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        {finalConfig.showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Categories */}
        {finalConfig.showCategories && availableCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge
              variant={selectedCategory === "all" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600"
              onClick={() => setSelectedCategory("all")}
            >
              All ({allWidgets.length})
            </Badge>
            {availableCategories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {allWidgets.filter(w => w.category === category).length})
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Widget List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredWidgets.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No widgets found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          ) : (
            filteredWidgets.map((widget) => (
              <div
                key={widget.id}
                className="group p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 animate-fade-in cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleDragStart(e, widget)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                    <widget.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {widget.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {widget.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {widget.defaultSize.w}×{widget.defaultSize.h}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {widget.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          <p>Drag widgets to your dashboard</p>
          <p className="mt-1">
            {filteredWidgets.length} of {allWidgets.length} widgets
          </p>
        </div>
      </div>
    </div>
  )
}
