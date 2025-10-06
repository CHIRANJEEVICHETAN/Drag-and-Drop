"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { useDashboardStore } from "../store/dashboardStore"
import { Moon, Sun, RotateCcw, Undo2, Redo2, Save, Upload, Download, Grid3X3, Rows, Zap } from "lucide-react"
import type { TopBarConfig } from "./DashboardBuilder"

interface TopBarProps {
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
  templateName?: string
  config?: TopBarConfig
}

export function TopBar({ sidebarOpen, setSidebarOpen, templateName, config }: TopBarProps) {
  const [isDark, setIsDark] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)

  const {
    resetDashboard,
    undo,
    redo,
    canUndo,
    canRedo,
    widgets,
    layout,
    exportDashboard,
    importDashboard,
    saveTemplate,
    autoArrange,
    compactLayout,
    arrangeInGrid,
    arrangeInRows,
  } = useDashboardStore()

  useEffect(() => {
    const stored = localStorage.getItem("ea-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = stored === "dark" || (!stored && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault()
        undo()
      } else if ((event.metaKey || event.ctrlKey) && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
        event.preventDefault()
        redo()
      } else if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault()
        handleQuickSave()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("ea-theme", newTheme ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newTheme)
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the dashboard? This action cannot be undone.")) {
      resetDashboard()
    }
  }

  const handleQuickSave = async () => {
    setIsSaving(true)
    try {
      await saveTemplate()
      // Show success feedback
    } catch (error) {
      console.error("Failed to save template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    exportDashboard()
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            importDashboard(data)
          } catch (error) {
            console.error("Failed to import dashboard:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Left side - Title and Sidebar Toggle */}
      <div className="flex items-center gap-4">
        {setSidebarOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {templateName || "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Center - Layout Actions */}
      {config?.showTemplateActions && (
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={compactLayout}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Compact
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={arrangeInGrid}
            className="text-xs"
          >
            <Grid3X3 className="h-3 w-3 mr-1" />
            Grid
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={arrangeInRows}
            className="text-xs"
          >
            <Rows className="h-3 w-3 mr-1" />
            Rows
          </Button>
        </div>
      )}

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Custom Actions */}
        {config?.customActions}

        {/* Undo/Redo */}
        {config?.showUndoRedo && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="text-xs"
            >
              <Undo2 className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="text-xs"
            >
              <Redo2 className="h-3 w-3 mr-1" />
              Redo
            </Button>
          </>
        )}

        {/* Export/Import */}
        {config?.showExportImport && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              Import
            </Button>
          </>
        )}

        {/* Save Template */}
        {config?.showTemplateActions && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickSave}
            disabled={isSaving}
            className="text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs text-red-600 hover:text-red-700"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="text-xs"
        >
          {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  )
}
