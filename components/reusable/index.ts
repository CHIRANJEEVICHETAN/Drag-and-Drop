// Main Dashboard Builder Component
export { DashboardBuilder } from './DashboardBuilder'
export type { 
  DashboardBuilderProps,
  DashboardConfig,
  WidgetLibraryConfig,
  TopBarConfig
} from './DashboardBuilder'

// Core Types
export type {
  Widget,
  WidgetLayout,
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
} from './types'

// Store and Hooks
export { useDashboardStore } from '../store/dashboardStore'
export { useDashboard } from '../hooks/useDashboard'

// Utility Components
export { BaseWidget } from '../widgets/BaseWidget'
export { WidgetSidebar } from '../WidgetSidebar'
export { DashboardCanvas } from '../DashboardCanvas'

// Widget Registry
export { 
  WIDGET_TYPES,
  getWidgetComponent,
  getWidgetType
} from '../widgets/WidgetRegistry'

// Default Widgets
export { default as BarChartWidget } from '../widgets/BarChartWidget'
export { default as LineChartWidget } from '../widgets/LineChartWidget'
export { default as AreaChartWidget } from '../widgets/AreaChartWidget'
export { default as MachineStatusWidget } from '../widgets/MachineStatusWidget'
export { default as MetricsWidget } from '../widgets/MetricsWidget'
export { default as OEEWidget } from '../widgets/OEEWidget'
export { default as EnergyWidget } from '../widgets/EnergyWidget'
export { default as TemperatureWidget } from '../widgets/TemperatureWidget'
export { default as ProductionCounterWidget } from '../widgets/ProductionCounterWidget'
export { default as AlertsWidget } from '../widgets/AlertsWidget'

// Re-export UI components for convenience
export { Button } from '../ui/button'
export { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
export { Input } from '../ui/input'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

// Version info
export const VERSION = '1.0.0'
export const PACKAGE_NAME = '@your-org/dashboard-builder'
