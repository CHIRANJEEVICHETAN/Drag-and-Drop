import { useCallback } from 'react'
import { useDashboardStore } from '../store/dashboardStore'
import type { Widget, WidgetLayout, UseDashboardReturn } from '../types'

export function useDashboard(): UseDashboardReturn {
  const store = useDashboardStore()

  // Utility methods
  const getWidgetById = useCallback((id: string): Widget | undefined => {
    return store.widgets.find(widget => widget.id === id)
  }, [store.widgets])

  const getWidgetsByCategory = useCallback((category: string): Widget[] => {
    return store.widgets.filter(widget => widget.category === category)
  }, [store.widgets])

  const getWidgetsByType = useCallback((type: string): Widget[] => {
    return store.widgets.filter(widget => widget.type === type)
  }, [store.widgets])

  const validateLayout = useCallback((layout: WidgetLayout[]): boolean => {
    // Basic validation: check for overlapping widgets
    for (let i = 0; i < layout.length; i++) {
      for (let j = i + 1; j < layout.length; j++) {
        const a = layout[i]
        const b = layout[j]
        
        if (
          a.x < b.x + b.w &&
          a.x + a.w > b.x &&
          a.y < b.y + b.h &&
          a.y + a.h > b.y
        ) {
          return false // Overlap detected
        }
      }
    }
    return true
  }, [])

  const exportAsJSON = useCallback((): string => {
    const data = {
      widgets: store.widgets,
      layout: store.layout,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    return JSON.stringify(data, null, 2)
  }, [store.widgets, store.layout])

  const importFromJSON = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json)
      if (data.widgets && data.layout) {
        // Validate the imported data
        if (validateLayout(data.layout)) {
          // Reset current state and import new data
          store.resetDashboard()
          
          // Add widgets one by one to ensure proper initialization
          data.widgets.forEach((widget: Widget) => {
            store.addWidget({
              type: widget.type,
              title: widget.title,
              config: widget.config,
              layout: widget.layout
            })
          })
          
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Failed to import dashboard:', error)
      return false
    }
  }, [store, validateLayout])

  return {
    ...store,
    getWidgetById,
    getWidgetsByCategory,
    getWidgetsByType,
    validateLayout,
    exportAsJSON,
    importFromJSON,
  }
}
