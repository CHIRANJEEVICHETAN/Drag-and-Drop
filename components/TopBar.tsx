"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Moon,
  Sun,
  RotateCcw,
  Undo,
  Redo,
  Save,
  Menu,
  FolderOpen,
  Download,
  Upload,
  LayoutGrid,
  AlignLeft,
  Layers,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDashboardStore } from "@/store/dashboardStore"
import { SaveTemplateDialog } from "./dialogs/SaveTemplateDialog"
import { LoadTemplateDialog } from "./dialogs/LoadTemplateDialog"

interface TopBarProps {
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
  templateName?: string
}

export function TopBar({ sidebarOpen, setSidebarOpen, templateName }: TopBarProps) {
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
    // Quick save current template or create new one
    saveTemplate()
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
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
            alert("Invalid file format")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {setSidebarOpen && (
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        )}

        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">IA</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">IIoT Analytics Dashboard</h1>
          <p className="text-xs text-muted-foreground">{templateName || "Analytics Dashboard"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          className="gap-2 bg-transparent"
          title="Save Template"
        >
          <Save className="w-4 h-4" />
          Save As
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLoadDialog(true)}
          className="gap-2 bg-transparent"
          title="Load Template"
        >
          <FolderOpen className="w-4 h-4" />
          Load
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportDashboard}
          className="gap-2 bg-transparent"
          title="Export Dashboard"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleImport}
          className="gap-2 bg-transparent"
          title="Import Dashboard"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              title="Auto Arrange"
              disabled={widgets.length === 0}
            >
              <LayoutGrid className="w-4 h-4" />
              Arrange
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={compactLayout}>
              <Layers className="mr-2 h-4 w-4" />
              Compact Layout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={arrangeInGrid}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid Layout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={arrangeInRows}>
              <AlignLeft className="mr-2 h-4 w-4" />
              Row Layout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          className="gap-2 bg-transparent"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
          Undo
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          className="gap-2 bg-transparent"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
          Redo
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="w-10 h-10 p-0 bg-transparent"
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      <SaveTemplateDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
      <LoadTemplateDialog open={showLoadDialog} onOpenChange={setShowLoadDialog} />
    </div>
  )
}
