import React from 'react'
import { DashboardBuilder } from '../DashboardBuilder'
import type { DashboardConfig, WidgetLibraryConfig, TopBarConfig } from '../DashboardBuilder'

// Example 1: Basic Dashboard
export function BasicDashboard() {
  return (
    <DashboardBuilder
      topBar={{ title: 'My First Dashboard' }}
      onWidgetAdd={(widget) => console.log('Widget added:', widget)}
      onLayoutChange={(layout) => console.log('Layout changed:', layout)}
    />
  )
}

// Example 2: Customized Dashboard
export function CustomizedDashboard() {
  const config: DashboardConfig = {
    gridCols: 16,                    // 16-column grid
    rowHeight: 80,                   // Taller rows
    margin: [16, 16],               // Larger margins
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    borderRadius: 16,                // Rounded corners
    shadow: 'shadow-2xl',            // Enhanced shadows
    enableAutoArrange: true,         // Auto-arrange widgets
  }

  const widgetLibrary: WidgetLibraryConfig = {
    categories: ['charts', 'metrics'], // Only show specific categories
    showSearch: true,
    maxWidgets: 25,                   // Limit widget count
  }

  const topBar: TopBarConfig = {
    title: 'Analytics Dashboard',
    showTemplateActions: true,        // Enable templates
    showExportImport: true,           // Enable export/import
    showUndoRedo: true,               // Enable undo/redo
  }

  return (
    <DashboardBuilder
      config={config}
      widgetLibrary={widgetLibrary}
      topBar={topBar}
      onWidgetAdd={(widget) => {
        console.log('New widget added:', widget)
        // You could send analytics here
        analytics.track('widget_added', { type: widget.type })
      }}
      onLayoutChange={(layout) => {
        console.log('Layout updated:', layout)
        // You could save layout to backend here
        saveLayoutToBackend(layout)
      }}
    />
  )
}

// Example 3: Dashboard with Initial State
export function DashboardWithInitialState() {
  const initialWidgets = [
    {
      type: 'bar-chart',
      title: 'Sales Overview',
      config: {
        data: [
          { month: 'Jan', sales: 1200 },
          { month: 'Feb', sales: 1900 },
          { month: 'Mar', sales: 1500 },
        ],
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      },
      layout: { x: 0, y: 0, w: 6, h: 4, i: 'sales-chart' }
    },
    {
      type: 'metrics',
      title: 'Key Metrics',
      config: {
        metrics: [
          { label: 'Revenue', value: '$45,230', change: '+12.5%' },
          { label: 'Orders', value: '1,234', change: '+8.2%' },
          { label: 'Customers', value: '892', change: '+15.3%' }
        ]
      },
      layout: { x: 6, y: 0, w: 6, h: 4, i: 'key-metrics' }
    }
  ]

  return (
    <DashboardBuilder
      initialWidgets={initialWidgets}
      topBar={{ title: 'Sales Dashboard' }}
      onReady={(dashboard) => {
        console.log('Dashboard ready with initial state:', dashboard)
      }}
    />
  )
}

// Example 4: Minimal Dashboard (No Top Bar)
export function MinimalDashboard() {
  return (
    <DashboardBuilder
      topBar={{ show: false }}        // Hide top bar completely
      config={{
        enableTemplates: false,       // Disable templates
        enableHistory: false,         // Disable history
        backgroundColor: 'bg-white',   // Simple white background
        margin: [8, 8],              // Smaller margins
      }}
      className="minimal-dashboard"
    />
  )
}

// Example 5: Dashboard with Custom Actions
export function DashboardWithCustomActions() {
  const CustomActions = () => (
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
        Refresh Data
      </button>
      <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
        Export PDF
      </button>
    </div>
  )

  return (
    <DashboardBuilder
      topBar={{
        title: 'Custom Dashboard',
        customActions: <CustomActions />
      }}
      config={{
        backgroundColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
        borderRadius: 20,
      }}
    />
  )
}

// Example 6: Responsive Dashboard
export function ResponsiveDashboard() {
  const responsiveConfig: DashboardConfig = {
    gridCols: 12,
    rowHeight: 60,
    margin: [12, 12],
    // The component will automatically handle responsive breakpoints
    enableAutoArrange: true,
    compactType: 'vertical',
  }

  return (
    <div className="w-full h-screen">
      <DashboardBuilder
        config={responsiveConfig}
        topBar={{ title: 'Responsive Dashboard' }}
        className="h-full"
        style={{ height: '100vh' }}
      />
    </div>
  )
}

// Example 7: Dashboard with Event Handling
export function DashboardWithEvents() {
  const handleWidgetAdd = (widget: any) => {
    console.log('Widget added:', widget)
    // Send to analytics
    analytics.track('dashboard_widget_added', {
      widget_type: widget.type,
      timestamp: new Date().toISOString()
    })
  }

  const handleWidgetRemove = (widgetId: string) => {
    console.log('Widget removed:', widgetId)
    // Update backend
    removeWidgetFromBackend(widgetId)
  }

  const handleLayoutChange = (layout: any[]) => {
    console.log('Layout changed:', layout)
    // Auto-save layout
    saveLayoutToBackend(layout)
  }

  const handleError = (error: Error) => {
    console.error('Dashboard error:', error)
    // Send to error tracking service
    errorTracking.captureException(error)
  }

  return (
    <DashboardBuilder
      topBar={{ title: 'Event-Driven Dashboard' }}
      onWidgetAdd={handleWidgetAdd}
      onWidgetRemove={handleWidgetRemove}
      onLayoutChange={handleLayoutChange}
      onError={handleError}
    />
  )
}

// Example 8: Dashboard with Custom Styling
export function StyledDashboard() {
  return (
    <DashboardBuilder
      topBar={{ title: 'Styled Dashboard' }}
      config={{
        backgroundColor: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
        borderRadius: 24,
        shadow: 'shadow-2xl',
        margin: [20, 20],
        containerPadding: [24, 24],
      }}
      className="styled-dashboard"
      style={{
        '--custom-accent': '#10b981',
        '--custom-border': '#d1fae5',
      } as React.CSSProperties}
    />
  )
}

// Helper functions (these would be implemented in your app)
function analytics() {
  return {
    track: (event: string, data: any) => console.log('Analytics:', event, data)
  }
}

function saveLayoutToBackend(layout: any[]) {
  console.log('Saving layout to backend:', layout)
  // Implementation would go here
}

function removeWidgetFromBackend(widgetId: string) {
  console.log('Removing widget from backend:', widgetId)
  // Implementation would go here
}

function errorTracking() {
  return {
    captureException: (error: Error) => console.error('Error tracked:', error)
  }
}
