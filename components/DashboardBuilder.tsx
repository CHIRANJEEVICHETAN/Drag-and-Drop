"use client"

import { useState } from "react"
import { TopBar } from "./TopBar"
import { WidgetSidebar } from "./WidgetSidebar"
import { DashboardCanvas } from "./DashboardCanvas"
import { useDashboardStore } from "@/store/dashboardStore"
import { Button } from "@/components/ui/button"
import { ChevronRight, Zap } from "lucide-react"

export function DashboardBuilder() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentTemplate } = useDashboardStore()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        templateName={currentTemplate?.name || "IIoT Analytics Dashboard"}
      />

      <div className="flex flex-1 overflow-hidden">
        <WidgetSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Expand button when sidebar is closed */}
        {!sidebarOpen && (
          <div className="relative flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-full w-10 p-0 border-r border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-3"
            >
              <ChevronRight className="h-4 w-4" />
              <Zap className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400 rotate-90 whitespace-nowrap font-medium">
                Widgets
              </span>
            </Button>
          </div>
        )}
        
        <div className="flex-1 w-full overflow-hidden">
          <DashboardCanvas />
        </div>
      </div>
    </div>
  )
}
