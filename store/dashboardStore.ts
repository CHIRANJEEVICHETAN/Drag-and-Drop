import { create } from "zustand"
import { persist } from "zustand/middleware"

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

export interface DashboardTemplate {
  id: string
  name: string
  widgets: Widget[]
  layout: WidgetLayout[]
  createdAt: Date
  updatedAt: Date
}

interface DashboardState {
  widgets: Widget[]
  layout: WidgetLayout[]
  templates: DashboardTemplate[]
  currentTemplate: DashboardTemplate | null
  history: { widgets: Widget[]; layout: WidgetLayout[] }[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
}

interface DashboardActions {
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

const findOptimalPosition = (
  existingLayouts: WidgetLayout[],
  width: number,
  height: number,
  cols = 12,
): { x: number; y: number } => {
  // Try to find the topmost, leftmost position that fits
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x <= cols - width; x++) {
      const wouldCollide = existingLayouts.some((layout) => {
        return !(
          x >= layout.x + layout.w ||
          x + width <= layout.x ||
          y >= layout.y + layout.h ||
          y + height <= layout.y
        )
      })

      if (!wouldCollide) {
        return { x, y }
      }
    }
  }

  // Fallback: place at the bottom
  const maxY = Math.max(0, ...existingLayouts.map((l) => l.y + l.h))
  return { x: 0, y: maxY }
}

const compactLayoutVertically = (layouts: WidgetLayout[]): WidgetLayout[] => {
  const sorted = [...layouts].sort((a, b) => a.y - b.y || a.x - b.x)
  const compacted: WidgetLayout[] = []

  sorted.forEach((layout) => {
    const { x, y } = findOptimalPosition(compacted, layout.w, layout.h)
    compacted.push({
      ...layout,
      x,
      y,
    })
  })

  return compacted
}

const arrangeInGridPattern = (layouts: WidgetLayout[], cols = 12): WidgetLayout[] => {
  const arranged: WidgetLayout[] = []
  let currentX = 0
  let currentY = 0
  let rowHeight = 0

  layouts.forEach((layout) => {
    // Check if widget fits in current row
    if (currentX + layout.w > cols) {
      // Move to next row
      currentX = 0
      currentY += rowHeight
      rowHeight = 0
    }

    arranged.push({
      ...layout,
      x: currentX,
      y: currentY,
    })

    currentX += layout.w
    rowHeight = Math.max(rowHeight, layout.h)
  })

  return arranged
}

const arrangeInRowsPattern = (layouts: WidgetLayout[], cols = 12): WidgetLayout[] => {
  const arranged: WidgetLayout[] = []
  let currentY = 0

  layouts.forEach((layout) => {
    arranged.push({
      ...layout,
      x: 0,
      y: currentY,
      w: cols, // Full width
    })

    currentY += layout.h
  })

  return arranged
}

const initialState: DashboardState = {
  widgets: [],
  layout: [],
  templates: [],
  currentTemplate: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
}

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addWidget: (widget) => {
        const id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newWidget = { ...widget, id }

        set((state) => {
          const newState = {
            widgets: [...state.widgets, newWidget],
            layout: [...state.layout, newWidget.layout],
          }
          return newState
        })
        get().pushHistory()
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          layout: state.layout.filter((l) => l.i !== id),
        }))
        get().pushHistory()
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }))
        get().pushHistory()
      },

      updateLayout: (layout) => {
        set({ layout })
        // Don't push history for layout changes to avoid too many history entries
      },

      autoArrange: (strategy = "compact") => {
        const state = get()
        let newLayout: WidgetLayout[]

        switch (strategy) {
          case "grid":
            newLayout = arrangeInGridPattern(state.layout)
            break
          case "rows":
            newLayout = arrangeInRowsPattern(state.layout)
            break
          case "compact":
          default:
            newLayout = compactLayoutVertically(state.layout)
            break
        }

        set({ layout: newLayout })
        get().pushHistory()
      },

      compactLayout: () => {
        get().autoArrange("compact")
      },

      arrangeInGrid: () => {
        get().autoArrange("grid")
      },

      arrangeInRows: () => {
        get().autoArrange("rows")
      },

      saveTemplate: (name) => {
        const state = get()
        const templateName = name || `Dashboard ${new Date().toLocaleDateString()}`
        const template: DashboardTemplate = {
          id: `template-${Date.now()}`,
          name: templateName,
          widgets: state.widgets,
          layout: state.layout,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          templates: [...state.templates, template],
          currentTemplate: template,
        }))
      },

      loadTemplate: (templateId) => {
        const state = get()
        const template = state.templates.find((t) => t.id === templateId)
        if (template) {
          set({
            widgets: template.widgets,
            layout: template.layout,
            currentTemplate: template,
          })
          get().pushHistory()
        }
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== templateId),
        }))
      },

      exportDashboard: () => {
        const state = get()
        const data = {
          widgets: state.widgets,
          layout: state.layout,
          exportedAt: new Date().toISOString(),
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `dashboard-${new Date().toISOString().split("T")[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      },

      importDashboard: (data) => {
        if (data.widgets && data.layout) {
          set({
            widgets: data.widgets,
            layout: data.layout,
          })
          get().pushHistory()
        }
      },

      pushHistory: () => {
        const state = get()
        const newHistoryEntry = {
          widgets: [...state.widgets],
          layout: [...state.layout],
        }

        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push(newHistoryEntry)

        // Keep only last 50 history entries
        if (newHistory.length > 50) {
          newHistory.shift()
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
          canUndo: newHistory.length > 1,
          canRedo: false,
        })
      },

      undo: () => {
        const state = get()
        if (state.historyIndex > 0) {
          const prevIndex = state.historyIndex - 1
          const prevState = state.history[prevIndex]

          set({
            widgets: prevState.widgets,
            layout: prevState.layout,
            historyIndex: prevIndex,
            canUndo: prevIndex > 0,
            canRedo: true,
          })
        }
      },

      redo: () => {
        const state = get()
        if (state.historyIndex < state.history.length - 1) {
          const nextIndex = state.historyIndex + 1
          const nextState = state.history[nextIndex]

          set({
            widgets: nextState.widgets,
            layout: nextState.layout,
            historyIndex: nextIndex,
            canUndo: true,
            canRedo: nextIndex < state.history.length - 1,
          })
        }
      },

      resetDashboard: () => {
        set({
          widgets: [],
          layout: [],
          currentTemplate: null,
        })
        get().pushHistory()
      },

      initializeDashboard: (widgets: Widget[], layout: WidgetLayout[]) => {
        set({
          widgets: widgets.map(widget => ({
            ...widget,
            id: widget.id || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          })),
          layout: layout.map(layoutItem => ({
            ...layoutItem,
            i: layoutItem.i || `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          })),
          currentTemplate: null,
        })
        get().pushHistory()
      },
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({
        templates: state.templates,
        currentTemplate: state.currentTemplate,
      }),
    },
  ),
)
