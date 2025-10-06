"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Node } from "@xyflow/react"

interface RenameDialogProps {
  node: Node | null
  onClose: () => void
  onRename: (nodeId: string, newLabel: string) => void
}

export function RenameDialog({ node, onClose, onRename }: RenameDialogProps) {
  const [label, setLabel] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || "")
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [node])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (node && label.trim()) {
      onRename(node.id, label.trim())
      onClose()
    }
  }

  if (!node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Rename Node</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="node-label" className="text-sm font-medium text-foreground block mb-2">
              Node Label
            </label>
            <Input
              ref={inputRef}
              id="node-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node label"
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!label.trim()}>
              Rename
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
