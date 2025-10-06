"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Layers } from "lucide-react"
import { useDashboardStore } from "@/store/dashboardStore"
import { formatDistanceToNow } from "date-fns"

interface LoadTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoadTemplateDialog({ open, onOpenChange }: LoadTemplateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { templates, loadTemplate, deleteTemplate, currentTemplate } = useDashboardStore()

  const handleLoadTemplate = async (templateId: string) => {
    setIsLoading(true)
    try {
      loadTemplate(templateId)
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate load delay
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to load template:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    if (confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      deleteTemplate(templateId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Load Dashboard Template</DialogTitle>
          <DialogDescription>Choose a saved template to load into your dashboard.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">No templates saved yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Create your first template by clicking "Save As" in the top bar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors ${
                    currentTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{template.name}</h3>
                        {currentTemplate?.id === template.id && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>{template.widgets.length} widgets</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadTemplate(template.id)}
                        disabled={isLoading || currentTemplate?.id === template.id}
                      >
                        {isLoading ? "Loading..." : "Load"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id, template.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
