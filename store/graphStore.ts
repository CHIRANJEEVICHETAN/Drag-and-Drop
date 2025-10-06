import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Node, Edge } from "@xyflow/react"

interface GraphState {
  nodes: Node[]
  edges: Edge[]
  shouldReset: boolean
  selectedNodes: string[]
  history: {
    nodes: Node[]
    edges: Edge[]
  }[]
  historyIndex: number
  maxHistorySize: number
  // Core actions
  addNode: (node: Node) => void
  updateNodes: (nodes: Node[]) => void
  updateEdges: (edges: Edge[]) => void
  resetCanvas: () => void
  // Node operations
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  deleteNode: (nodeId: string) => void
  duplicateNode: (nodeId: string) => void
  // Edge operations
  addEdge: (edge: Edge) => void
  deleteEdge: (edgeId: string) => void
  // Selection
  setSelectedNodes: (nodeIds: string[]) => void
  // History
  saveToHistory: () => void
  undo: () => boolean
  redo: () => boolean
  canUndo: () => boolean
  canRedo: () => boolean
  // Utility
  getNodeById: (nodeId: string) => Node | undefined
  getConnectedEdges: (nodeId: string) => Edge[]
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      shouldReset: false,
      selectedNodes: [],
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,

      addNode: (node) => {
        set((state) => {
          const newState = {
            nodes: [...state.nodes, node],
            shouldReset: false,
          }
          return newState
        })
        get().saveToHistory()
      },

      updateNodes: (nodes) => {
        set({ nodes, shouldReset: false })
      },

      updateEdges: (edges) => {
        set({ edges })
      },

      resetCanvas: () => {
        set({ nodes: [], edges: [], shouldReset: true, selectedNodes: [], history: [], historyIndex: -1 })
      },

      updateNode: (nodeId, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates, data: { ...node.data, ...updates.data } } : node,
          ),
        }))
        get().saveToHistory()
      },

      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          selectedNodes: state.selectedNodes.filter((id) => id !== nodeId),
        }))
        get().saveToHistory()
      },

      duplicateNode: (nodeId) => {
        const state = get()
        const originalNode = state.nodes.find((node) => node.id === nodeId)
        if (!originalNode) return

        const newNode: Node = {
          ...originalNode,
          id: `${originalNode.type}-${Date.now()}`,
          position: {
            x: originalNode.position.x + 50,
            y: originalNode.position.y + 50,
          },
          data: {
            ...originalNode.data,
            label: `${originalNode.data.label} (Copy)`,
          },
        }

        set((state) => ({
          nodes: [...state.nodes, newNode],
        }))
        get().saveToHistory()
      },

      addEdge: (edge) => {
        set((state) => ({
          edges: [...state.edges, edge],
        }))
        get().saveToHistory()
      },

      deleteEdge: (edgeId) => {
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== edgeId),
        }))
        get().saveToHistory()
      },

      setSelectedNodes: (nodeIds) => {
        set({ selectedNodes: nodeIds })
      },

      saveToHistory: () => {
        const state = get()
        const currentState = {
          nodes: [...state.nodes],
          edges: [...state.edges],
        }

        // Don't save if state hasn't changed
        if (state.history.length > 0 && state.historyIndex >= 0) {
          const lastState = state.history[state.historyIndex]
          if (
            JSON.stringify(lastState.nodes) === JSON.stringify(currentState.nodes) &&
            JSON.stringify(lastState.edges) === JSON.stringify(currentState.edges)
          ) {
            return
          }
        }

        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push(currentState)

        // Limit history size
        if (newHistory.length > state.maxHistorySize) {
          newHistory.shift()
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        })
      },

      undo: () => {
        const state = get()
        if (state.historyIndex > 0) {
          const previousState = state.history[state.historyIndex - 1]
          set({
            nodes: [...previousState.nodes],
            edges: [...previousState.edges],
            historyIndex: state.historyIndex - 1,
          })
          return true
        }
        return false
      },

      redo: () => {
        const state = get()
        if (state.historyIndex < state.history.length - 1) {
          const nextState = state.history[state.historyIndex + 1]
          set({
            nodes: [...nextState.nodes],
            edges: [...nextState.edges],
            historyIndex: state.historyIndex + 1,
          })
          return true
        }
        return false
      },

      canUndo: () => {
        const state = get()
        return state.historyIndex > 0
      },

      canRedo: () => {
        const state = get()
        return state.historyIndex < state.history.length - 1
      },

      getNodeById: (nodeId) => {
        const state = get()
        return state.nodes.find((node) => node.id === nodeId)
      },

      getConnectedEdges: (nodeId) => {
        const state = get()
        return state.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)
      },
    }),
    {
      name: "ea-graph",
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        history: state.history.slice(-10), // Only persist last 10 history states
        historyIndex: Math.min(state.historyIndex, 9),
      }),
    },
  ),
)
