"use client"

import { useEffect, useRef } from "react"
import { Edit3, Copy, Trash2 } from "lucide-react"
import type { Node } from "@xyflow/react"

interface NodeContextMenuProps {
  node: Node | null
  position: { x: number; y: number }
  onClose: () => void
  onRename: (node: Node) => void
  onDuplicate: (node: Node) => void
  onDelete: (node: Node) => void
}

export function NodeContextMenu({ node, position, onClose, onRename, onDuplicate, onDelete }: NodeContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  if (!node) return null

  const menuItems = [
    {
      label: "Rename",
      icon: Edit3,
      onClick: () => {
        onRename(node)
        onClose()
      },
      shortcut: "F2",
    },
    {
      label: "Duplicate",
      icon: Copy,
      onClick: () => {
        onDuplicate(node)
        onClose()
      },
      shortcut: "Ctrl+D",
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => {
        onDelete(node)
        onClose()
      },
      destructive: true,
      shortcut: "Del",
    },
  ]

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-xl py-1 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="px-3 py-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground truncate">{node.data.label}</p>
        <p className="text-xs text-muted-foreground capitalize">{node.type} Node</p>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
              item.destructive ? "text-destructive hover:bg-destructive/10" : "text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {item.label}
            </div>
            <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
              {item.shortcut}
            </kbd>
          </button>
        )
      })}
    </div>
  )
}
