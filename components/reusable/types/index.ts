// Core widget interfaces
export interface WidgetLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export interface Widget {
  id: string
  type: string
  title: string
  config: Record<string, any>
  layout: WidgetLayout
}

export interface WidgetType {
  id: string
  name: string
  icon: React.ComponentType<any>
  component: React.ComponentType<any>
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  category: "charts" | "iiot" | "analytics" | string
  description: string
}

// Template interfaces
export interface DashboardTemplate {
  id: string
  name: string
  widgets: Widget[]
  layout: WidgetLayout[]
  createdAt: Date
  updatedAt: Date
}

// Event interfaces
export interface WidgetEvent {
  widget: Widget
  type: 'add' | 'remove' | 'update' | 'move' | 'resize'
  timestamp: Date
  data?: any
}

export interface LayoutChangeEvent {
  layout: WidgetLayout[]
  previousLayout: WidgetLayout[]
  timestamp: Date
}

// Configuration interfaces
export interface GridConfig {
  cols: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
  breakpoints: Record<string, number>
}

export interface FeatureConfig {
  dragAndDrop: boolean
  resize: boolean
  templates: boolean
  history: boolean
  autoArrange: boolean
  search: boolean
  categories: boolean
}

export interface StyleConfig {
  theme: 'light' | 'dark' | 'auto'
  backgroundColor: string
  borderRadius: number
  shadow: string
  fontFamily: string
  spacing: number
}

// Store interfaces
export interface DashboardState {
  widgets: Widget[]
  layout: WidgetLayout[]
  templates: DashboardTemplate[]
  currentTemplate: DashboardTemplate | null
  history: { widgets: Widget[]; layout: WidgetLayout[] }[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
}

export interface DashboardActions {
  addWidget: (widget: Omit<Widget, "id">) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  updateLayout: (layout: WidgetLayout[]) => void
  saveTemplate: (name?: string) => void
  loadTemplate: (templateId: string) => void
  deleteTemplate: (templateId: string) => void
  exportDashboard: () => void
  importDashboard: (data: any) => void
  undo: () => void
  redo: () => void
  pushHistory: () => void
  resetDashboard: () => void
  autoArrange: (strategy?: "compact" | "grid" | "rows") => void
  compactLayout: () => void
  arrangeInGrid: () => void
  arrangeInRows: () => void
  initializeDashboard: (widgets: Widget[], layout: WidgetLayout[]) => void
}

// Hook return type
export interface UseDashboardReturn extends DashboardState, DashboardActions {
  // Additional utility methods
  getWidgetById: (id: string) => Widget | undefined
  getWidgetsByCategory: (category: string) => Widget[]
  getWidgetsByType: (type: string) => Widget[]
  validateLayout: (layout: WidgetLayout[]) => boolean
  exportAsJSON: () => string
  importFromJSON: (json: string) => boolean
}

// Plugin system interfaces
export interface DashboardPlugin {
  id: string
  name: string
  version: string
  initialize: (dashboard: any) => void
  destroy: () => void
  onWidgetAdd?: (widget: Widget) => void
  onWidgetRemove?: (widgetId: string) => void
  onLayoutChange?: (layout: WidgetLayout[]) => void
}

// Custom widget interfaces
export interface CustomWidgetProps {
  id: string
  title?: string
  config: Record<string, any>
  onConfigChange?: (config: Record<string, any>) => void
  onRemove?: () => void
  className?: string
}

export interface WidgetRendererProps {
  widget: Widget
  onUpdate: (updates: Partial<Widget>) => void
  onRemove: () => void
  className?: string
}

// Export all types
export type {
  WidgetLayout,
  Widget,
  WidgetType,
  DashboardTemplate,
  WidgetEvent,
  LayoutChangeEvent,
  GridConfig,
  FeatureConfig,
  StyleConfig,
  DashboardState,
  DashboardActions,
  UseDashboardReturn,
  DashboardPlugin,
  CustomWidgetProps,
  WidgetRendererProps,
}
