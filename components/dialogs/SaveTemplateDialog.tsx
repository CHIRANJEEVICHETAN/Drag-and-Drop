"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDashboardStore } from "@/store/dashboardStore"

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaveTemplateDialog({ open, onOpenChange }: SaveTemplateDialogProps) {
  const [templateName, setTemplateName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { saveTemplate, currentTemplate } = useDashboardStore()

  const handleSave = async () => {
    if (!templateName.trim()) return

    setIsSaving(true)
    try {
      saveTemplate(templateName.trim())
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate save delay
      onOpenChange(false)
      setTemplateName("")
    } catch (error) {
      console.error("Failed to save template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSaving) {
      onOpenChange(newOpen)
      if (!newOpen) {
        setTemplateName("")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Dashboard Template</DialogTitle>
          <DialogDescription>Save your current dashboard layout as a template for future use.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-name" className="text-right">
              Name
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && templateName.trim()) {
                  handleSave()
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!templateName.trim() || isSaving}>
            {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
