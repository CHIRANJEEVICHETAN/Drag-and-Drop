"use client"

import React, { useState, ReactNode } from "react"
import { TopBar } from "./TopBar"
import { WidgetSidebar } from "./WidgetSidebar"
import { DashboardCanvas } from "./DashboardCanvas"
import { useDashboardStore } from "../../store/dashboardStore"
import { Button } from "../../components/ui/button"
import { ChevronRight, Zap } from "lucide-react"
import type { WidgetType, Widget, WidgetLayout } from "./types"

// Main configuration interface
export interface DashboardConfig {
  // Layout settings
  gridCols?: number
  rowHeight?: number
  margin?: [number, number]
  containerPadding?: [number, number]
  
  // Features
  enableDragAndDrop?: boolean
  enableResize?: boolean
  enableTemplates?: boolean
  enableHistory?: boolean
  enableAutoArrange?: boolean
  
  // Styling
  theme?: 'light' | 'dark' | 'auto'
  backgroundColor?: string
  borderRadius?: number
  shadow?: string
  
  // Behavior
  compactType?: 'vertical' | 'horizontal' | null
  preventCollision?: boolean
  useCSSTransforms?: boolean
  
  // Callbacks
  onWidgetAdd?: (widget: Widget) => void
  onWidgetRemove?: (widgetId: string) => void
  onWidgetUpdate?: (widgetId: string, updates: Partial<Widget>) => void
  onLayoutChange?: (layout: WidgetLayout[]) => void
  onTemplateSave?: (template: any) => void
  onTemplateLoad?: (template: any) => void
}

// Widget library configuration
export interface WidgetLibraryConfig {
  categories?: string[]
  showSearch?: boolean
  showCategories?: boolean
  maxWidgets?: number
  customWidgets?: WidgetType[]
}

// Top bar configuration
export interface TopBarConfig {
  show?: boolean
  title?: string
  showTemplateActions?: boolean
  showExportImport?: boolean
  showUndoRedo?: boolean
  customActions?: ReactNode
}

// Main component props
export interface DashboardBuilderProps {
  // Core configuration
  config?: DashboardConfig
  widgetLibrary?: WidgetLibraryConfig
  topBar?: TopBarConfig
  
  // Initial state
  initialWidgets?: Widget[]
  initialLayout?: WidgetLayout[]
  
  // Custom styling
  className?: string
  style?: React.CSSProperties
  
  // Children (for custom content)
  children?: ReactNode
  
  // Event handlers
  onReady?: (dashboard: any) => void
  onError?: (error: Error) => void
}

// Default configurations
const defaultConfig: DashboardConfig = {
  gridCols: 12,
  rowHeight: 60,
  margin: [12, 12],
  containerPadding: [0, 0],
  enableDragAndDrop: true,
  enableResize: true,
  enableTemplates: true,
  enableHistory: true,
  enableAutoArrange: true,
  theme: 'auto',
  backgroundColor: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
  borderRadius: 8,
  shadow: 'shadow-lg',
  compactType: 'vertical',
  preventCollision: false,
  useCSSTransforms: true,
}

const defaultWidgetLibrary: WidgetLibraryConfig = {
  categories: ['charts', 'iiot', 'analytics'],
  showSearch: true,
  showCategories: true,
  maxWidgets: 50,
}

const defaultTopBar: TopBarConfig = {
  show: true,
  title: 'Dashboard',
  showTemplateActions: true,
  showExportImport: true,
  showUndoRedo: true,
}

export function DashboardBuilder({
  config = {},
  widgetLibrary = {},
  topBar = {},
  initialWidgets = [],
  initialLayout = [],
  className = "",
  style = {},
  children,
  onReady,
  onError,
}: DashboardBuilderProps) {
  // Merge configurations with defaults
  const finalConfig = { ...defaultConfig, ...config }
  const finalWidgetLibrary = { ...defaultWidgetLibrary, ...widgetLibrary }
  const finalTopBar = { ...defaultTopBar, ...topBar }
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentTemplate, initializeDashboard } = useDashboardStore()

  // Initialize dashboard with custom widgets if provided
  React.useEffect(() => {
    if (initialWidgets.length > 0 || initialLayout.length > 0) {
      try {
        // Initialize with custom data
        initializeDashboard(initialWidgets, initialLayout)
        onReady?.({ widgets: initialWidgets, layout: initialLayout })
      } catch (error) {
        onError?.(error as Error)
      }
    }
  }, [initialWidgets, initialLayout, initializeDashboard, onReady, onError])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Generate dynamic classes based on config
  const getBackgroundClass = () => {
    if (finalConfig.backgroundColor) {
      return finalConfig.backgroundColor
    }
    return 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
  }

  const getBorderRadiusClass = () => {
    const radius = finalConfig.borderRadius || 8
    return `rounded-${radius === 8 ? 'lg' : radius === 12 ? 'xl' : radius === 16 ? '2xl' : 'lg'}`
  }

  return (
    <div 
      className={`min-h-screen flex flex-col ${getBackgroundClass()} ${className}`}
      style={style}
    >
      {/* Custom children at the top */}
      {children}
      
      {/* Top Bar */}
      {finalTopBar.show && (
        <TopBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          templateName={currentTemplate?.name || finalTopBar.title || "Dashboard"}
          config={finalTopBar}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Widget Sidebar */}
        <WidgetSidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar}
          config={finalWidgetLibrary}
        />
        
        {/* Expand button when sidebar is closed */}
        {!sidebarOpen && (
          <div className="relative flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className={`h-full w-10 p-0 border-r border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm ${finalConfig.shadow} hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-3`}
            >
              <ChevronRight className="h-4 w-4" />
              <Zap className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400 rotate-90 whitespace-nowrap font-medium">
                Widgets
              </span>
            </Button>
          </div>
        )}
        
        {/* Main Canvas */}
        <div className="flex-1 w-full overflow-hidden">
          <DashboardCanvas 
            config={finalConfig}
            onWidgetAdd={finalConfig.onWidgetAdd}
            onWidgetRemove={finalConfig.onWidgetRemove}
            onWidgetUpdate={finalConfig.onWidgetUpdate}
            onLayoutChange={finalConfig.onLayoutChange}
          />
        </div>
      </div>
    </div>
  )
}

// Export types for external use
export type { DashboardConfig, WidgetLibraryConfig, TopBarConfig, DashboardBuilderProps }
export type { Widget, WidgetLayout, WidgetType } from "./types"
