"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  useReactFlow,
  SelectionMode,
  PanOnScrollMode,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { NodeSidebar } from "./NodeSidebar"
import { NodeContextMenu } from "./NodeContextMenu"
import { RenameDialog } from "./RenameDialog"
import { CanvasToolbar } from "./CanvasToolbar"
import { DeviceNode } from "./nodes/DeviceNode"
import { MetricNode } from "./nodes/MetricNode"
import { AlertNode } from "./nodes/AlertNode"
import { ReportNode } from "./nodes/ReportNode"
import { useGraphStore } from "@/store/graphStore"

const nodeTypes = {
  device: DeviceNode,
  metric: MetricNode,
  alert: AlertNode,
  report: ReportNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "device",
    position: { x: 100, y: 100 },
    data: { label: "Temperature Sensor" },
  },
  {
    id: "2",
    type: "metric",
    position: { x: 300, y: 100 },
    data: { label: "Average Temperature" },
  },
  {
    id: "3",
    type: "alert",
    position: { x: 500, y: 50 },
    data: { label: "High Temperature Alert" },
  },
  {
    id: "4",
    type: "device",
    position: { x: 100, y: 250 },
    data: { label: "Humidity Sensor" },
  },
  {
    id: "5",
    type: "metric",
    position: { x: 300, y: 250 },
    data: { label: "Humidity Level" },
  },
  {
    id: "6",
    type: "report",
    position: { x: 500, y: 200 },
    data: { label: "Environmental Report" },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
  { id: "e5-6", source: "5", target: "6", animated: true },
]

export function NodeEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [contextMenu, setContextMenu] = useState<{
    node: Node | null
    position: { x: number; y: number }
  } | null>(null)
  const [renameDialog, setRenameDialog] = useState<Node | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showMinimap, setShowMinimap] = useState(true)
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(SelectionMode.Partial)
  const [panOnScroll, setPanOnScroll] = useState<PanOnScrollMode>(PanOnScrollMode.Free)
  const [isInitialized, setIsInitialized] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    shouldReset,
    updateNode,
    deleteNode,
    duplicateNode,
    addEdge: storeAddEdge,
    deleteEdge,
    saveToHistory,
  } = useGraphStore()

  useEffect(() => {
    if (!isInitialized) {
      if (storeNodes.length > 0 || storeEdges.length > 0) {
        setNodes(storeNodes.length > 0 ? storeNodes : initialNodes)
        setEdges(storeEdges.length > 0 ? storeEdges : initialEdges)
      }
      setIsInitialized(true)
    }
  }, [storeNodes, storeEdges, setNodes, setEdges, isInitialized])

  useEffect(() => {
    if (shouldReset) {
      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [shouldReset, setNodes, setEdges])

  // The store will be updated through specific actions instead of syncing on every change

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        id: `e${params.source}-${params.target}`,
        style: { strokeWidth: 2 },
        markerEnd: {
          type: "arrowclosed",
          width: 20,
          height: 20,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      storeAddEdge(newEdge)
    },
    [setEdges, storeAddEdge],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const getDefaultLabel = (nodeType: string) => {
        const labels = {
          device: ["Temperature Sensor", "Humidity Sensor", "Pressure Sensor", "Motion Detector"],
          metric: ["Average Value", "Maximum Value", "Trend Analysis", "Data Processing"],
          alert: ["Threshold Alert", "Anomaly Detection", "Critical Warning", "Status Monitor"],
          report: ["Daily Report", "Summary Report", "Analytics Dashboard", "Data Export"],
        }
        const typeLabels = labels[nodeType as keyof typeof labels] || ["New Node"]
        return typeLabels[Math.floor(Math.random() * typeLabels.length)]
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: getDefaultLabel(type) },
      }

      setNodes((nds) => nds.concat(newNode))
      addNode(newNode)
    },
    [screenToFlowPosition, setNodes, addNode],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation()
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
      deleteEdge(edge.id)
    },
    [setEdges, deleteEdge],
  )

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const deletedIds = deleted.map((node) => node.id)
      setEdges((eds) => eds.filter((edge) => !deletedIds.includes(edge.source) && !deletedIds.includes(edge.target)))
      deletedIds.forEach((id) => deleteNode(id))
    },
    [setEdges, deleteNode],
  )

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      onNodesChange(changes)
      // Only sync position changes to store, not all changes to avoid loops
      const positionChanges = changes.filter((change) => change.type === "position" && change.dragging === false)
      if (positionChanges.length > 0) {
        // Debounce store updates to avoid too frequent saves
        setTimeout(() => {
          const currentNodes = nodes
          useGraphStore.getState().updateNodes(currentNodes)
        }, 100)
      }
    },
    [onNodesChange, nodes],
  )

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault()
    setContextMenu({
      node,
      position: { x: event.clientX, y: event.clientY },
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  const handleRename = useCallback((node: Node) => {
    setRenameDialog(node)
  }, [])

  const handleDuplicate = useCallback(
    (node: Node) => {
      duplicateNode(node.id)
      const duplicatedNode = useGraphStore
        .getState()
        .nodes.find((n) => n.id.startsWith(`${node.type}-`) && n.id !== node.id)
      if (duplicatedNode) {
        setNodes((nds) => [...nds, duplicatedNode])
      }
    },
    [duplicateNode, setNodes],
  )

  const handleDelete = useCallback(
    (node: Node) => {
      setNodes((nds) => nds.filter((n) => n.id !== node.id))
      setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
      deleteNode(node.id)
    },
    [deleteNode, setNodes, setEdges],
  )

  const handleRenameSubmit = useCallback(
    (nodeId: string, newLabel: string) => {
      updateNode(nodeId, { data: { label: newLabel } })
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { ...node.data, label: newLabel },
              }
            : node,
        ),
      )
    },
    [updateNode, setNodes],
  )

  const closeRenameDialog = useCallback(() => {
    setRenameDialog(null)
  }, [])

  const onPaneClick = useCallback(() => {
    setContextMenu(null)
  }, [])

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev)
  }, [])

  const toggleMinimap = useCallback(() => {
    setShowMinimap((prev) => !prev)
  }, [])

  return (
    <div className="flex h-full">
      <NodeSidebar />
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <CanvasToolbar
          showGrid={showGrid}
          onToggleGrid={toggleGrid}
          showMinimap={showMinimap}
          onToggleMinimap={toggleMinimap}
        />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeClick={onEdgeClick}
          onNodesDelete={onNodesDelete}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          className="bg-background"
          deleteKeyCode={["Backspace", "Delete"]}
          multiSelectionKeyCode={["Meta", "Ctrl"]}
          panOnScroll={panOnScroll}
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectionMode={selectionMode}
          elementsSelectable
          nodesConnectable
          nodesDraggable
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          minZoom={0.1}
          maxZoom={4}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          {showGrid && <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-30" />}

          <Controls
            className="bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-lg"
            showInteractive={false}
            showFitView={false}
            showZoom={false}
          />

          {showMinimap && (
            <MiniMap
              className="bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-lg"
              nodeColor={(node) => {
                const colors = {
                  device: "#3b82f6",
                  metric: "#10b981",
                  alert: "#ef4444",
                  report: "#8b5cf6",
                }
                return colors[node.type as keyof typeof colors] || "#6b7280"
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
              pannable
              zoomable
              ariaLabel="Canvas minimap"
            />
          )}
        </ReactFlow>

        {contextMenu && (
          <NodeContextMenu
            node={contextMenu.node}
            position={contextMenu.position}
            onClose={closeContextMenu}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}

        {renameDialog && <RenameDialog node={renameDialog} onClose={closeRenameDialog} onRename={handleRenameSubmit} />}
      </div>
    </div>
  )
}
