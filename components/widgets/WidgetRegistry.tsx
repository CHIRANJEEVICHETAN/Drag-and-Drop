import type React from "react"
import { BarChartWidget } from "./BarChartWidget"
import { LineChartWidget } from "./LineChartWidget"
import { AreaChartWidget } from "./AreaChartWidget"
import { MachineStatusWidget } from "./MachineStatusWidget"
import { MetricsWidget } from "./MetricsWidget"
import { OEEWidget } from "./OEEWidget"
import { EnergyWidget } from "./EnergyWidget"
import { TemperatureWidget } from "./TemperatureWidget"
import { ProductionCounterWidget } from "./ProductionCounterWidget"
import { AlertsWidget } from "./AlertsWidget"
import {
  BarChart3,
  LineChart,
  AreaChart,
  Cpu,
  Activity,
  Target,
  Zap,
  Thermometer,
  Package,
  AlertTriangle,
} from "lucide-react"

export interface WidgetType {
  id: string
  name: string
  icon: React.ComponentType<any>
  component: React.ComponentType<any>
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  category: "charts" | "iiot" | "analytics"
  description: string
}

export const WIDGET_TYPES: WidgetType[] = [
  {
    id: "bar-chart",
    name: "Bar Chart",
    icon: BarChart3,
    component: BarChartWidget,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    category: "charts",
    description: "Display data using vertical bars",
  },
  {
    id: "line-chart",
    name: "Line Chart",
    icon: LineChart,
    component: LineChartWidget,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    category: "charts",
    description: "Show trends over time with connected points",
  },
  {
    id: "area-chart",
    name: "Area Chart",
    icon: AreaChart,
    component: AreaChartWidget,
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    category: "charts",
    description: "Visualize data with filled areas",
  },
  {
    id: "machine-status",
    name: "Machine Status",
    icon: Cpu,
    component: MachineStatusWidget,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    category: "iiot",
    description: "Monitor machine health and status",
  },
  {
    id: "production-metrics",
    name: "Production Metrics",
    icon: Activity,
    component: MetricsWidget,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    category: "analytics",
    description: "Track key production indicators",
  },
  {
    id: "oee-widget",
    name: "OEE Monitor",
    icon: Target,
    component: OEEWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    category: "iiot",
    description: "Overall Equipment Effectiveness tracking",
  },
  {
    id: "energy-widget",
    name: "Energy Monitor",
    icon: Zap,
    component: EnergyWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    category: "iiot",
    description: "Real-time energy consumption monitoring",
  },
  {
    id: "temperature-widget",
    name: "Temperature Monitor",
    icon: Thermometer,
    component: TemperatureWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    category: "iiot",
    description: "Multi-sensor temperature monitoring",
  },
  {
    id: "production-counter",
    name: "Production Counter",
    icon: Package,
    component: ProductionCounterWidget,
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    category: "iiot",
    description: "Track production counts and targets",
  },
  {
    id: "alerts-widget",
    name: "System Alerts",
    icon: AlertTriangle,
    component: AlertsWidget,
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    category: "iiot",
    description: "Monitor system alerts and notifications",
  },
]

export function getWidgetComponent(type: string) {
  const widgetType = WIDGET_TYPES.find((w) => w.id === type)
  return widgetType?.component || BarChartWidget
}

export function getWidgetType(type: string) {
  return WIDGET_TYPES.find((w) => w.id === type)
}
