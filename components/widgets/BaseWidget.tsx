"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoreHorizontal, Settings, Edit2, Check, X as XIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDashboardStore } from "@/store/dashboardStore"

interface BaseWidgetProps {
  id: string
  title?: string
  children: ReactNode
  className?: string
  onConfigure?: () => void
  showTitle?: boolean
}

export function BaseWidget({ id, title, children, className = "", onConfigure, showTitle = true }: BaseWidgetProps) {
  const { removeWidget, updateWidget } = useDashboardStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title || "")

  const handleRemove = () => {
    if (confirm(`Remove "${title || 'widget'}" widget?`)) {
      removeWidget(id)
    }
  }

  const handleTitleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      updateWidget(id, { title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setEditedTitle(title || "")
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    action()
  }

  return (
    <TooltipProvider>
      <Card
        className={`widget-card h-full transition-all duration-300 hover:shadow-lg group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Seamlessly embedded title - moved to the right */}
        {showTitle && (
          <div className="absolute top-2 left-8 z-10">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 rounded-md px-2 py-1 shadow-sm">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="h-6 text-sm font-medium border-none bg-transparent p-0 focus-visible:ring-0 min-w-[120px]"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                  onClick={handleTitleSave}
                >
                  <Check className="h-3 w-3 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                  onClick={handleTitleCancel}
                >
                  <XIcon className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-md shadow-sm cursor-pointer group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors duration-200">
                  {title || "Untitled Widget"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 bg-white/90 dark:bg-slate-800/90 rounded-full"
                  onClick={(e) => handleButtonClick(e, () => setIsEditingTitle(true))}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action menu button */}
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 bg-white/90 dark:bg-slate-800/90 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onConfigure && (
                <DropdownMenuItem onClick={() => onConfigure()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemove} className="text-red-600">
                <XIcon className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="widget-content p-3 overflow-hidden pt-8">{children}</CardContent>
      </Card>
    </TooltipProvider>
  )
}
