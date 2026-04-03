import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ACCENT = "rgba(139,92,246,";
const BG = "rgba(11,15,18,0.95)";
const BORDER = "rgba(42,58,66,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.4)";

const NODE_COLORS = [
  "rgba(139,92,246,0.7)",
  "rgba(39,215,224,0.7)",
  "rgba(244,63,94,0.7)",
  "rgba(34,197,94,0.7)",
  "rgba(250,204,21,0.7)",
  "rgba(249,115,22,0.7)",
  "rgba(236,72,153,0.7)",
];

interface MindNode {
  id: number;
  label: string;
  parentId: number | null;
  x: number;
  y: number;
  color: string;
}

const INITIAL_NODES: MindNode[] = [
  {
    id: 1,
    label: "DecentOS",
    parentId: null,
    x: 360,
    y: 250,
    color: NODE_COLORS[0],
  },
  { id: 2, label: "Apps", parentId: 1, x: 180, y: 130, color: NODE_COLORS[1] },
  {
    id: 3,
    label: "File System",
    parentId: 1,
    x: 540,
    y: 130,
    color: NODE_COLORS[1],
  },
  {
    id: 4,
    label: "Security",
    parentId: 1,
    x: 180,
    y: 370,
    color: NODE_COLORS[2],
  },
  {
    id: 5,
    label: "Network",
    parentId: 1,
    x: 540,
    y: 370,
    color: NODE_COLORS[3],
  },
];

interface MindMapData {
  nodes: MindNode[];
  nextId: number;
}

export function MindMap({
  windowProps: _windowProps,
}: { windowProps?: Record<string, unknown> }) {
  const { data: mapData, set: saveMapData } = useCanisterKV<MindMapData>(
    "decentos_mindmap",
    { nodes: INITIAL_NODES, nextId: 6 },
  );
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [activeColor, setActiveColor] = useState(NODE_COLORS[1]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [nodeColorPickerId, setNodeColorPickerId] = useState<number | null>(
    null,
  );
  const draggingRef = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const nodes = mapData.nodes;
  const nextId = mapData.nextId;

  const _setNodes = (updater: (prev: MindNode[]) => MindNode[]) => {
    const updated = updater(nodes);
    saveMapData({ nodes: updated, nextId });
    toast.success("Saved to chain ✓");
  };

  const addChild = () => {
    const parent = nodes.find((n) => n.id === (selectedId ?? 1));
    if (!parent) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = 130 + Math.random() * 40;
    const newNode: MindNode = {
      id: nextId,
      label: "New Node",
      parentId: parent.id,
      x: parent.x + Math.cos(angle) * dist,
      y: parent.y + Math.sin(angle) * dist,
      color: activeColor,
    };
    saveMapData({ nodes: [...nodes, newNode], nextId: nextId + 1 });
    toast.success("Saved to chain ✓");
  };

  const clearAll = () => {
    saveMapData({
      nodes: [
        {
          id: 1,
          label: "Root",
          parentId: null,
          x: 360,
          y: 250,
          color: NODE_COLORS[0],
        },
      ],
      nextId: 2,
    });
    setSelectedId(1);
    toast.success("Saved to chain ✓");
  };

  const deleteNode = (id: number) => {
    if (id === 1) return;
    const toDelete = new Set<number>();
    const collect = (nid: number) => {
      toDelete.add(nid);
      for (const n of nodes.filter((n) => n.parentId === nid)) {
        collect(n.id);
      }
    };
    collect(id);
    saveMapData({ nodes: nodes.filter((n) => !toDelete.has(n.id)), nextId });
    setSelectedId(1);
    toast.success("Saved to chain ✓");
  };

  const startEdit = (node: MindNode) => {
    setEditingId(node.id);
    setEditLabel(node.label);
  };

  const commitEdit = () => {
    if (editingId === null) return;
    const updated = nodes.map((n) =>
      n.id === editingId ? { ...n, label: editLabel } : n,
    );
    saveMapData({ nodes: updated, nextId });
    setEditingId(null);
    toast.success("Saved to chain ✓");
  };

  const changeNodeColor = (id: number, color: string) => {
    const updated = nodes.map((n) => (n.id === id ? { ...n, color } : n));
    saveMapData({ nodes: updated, nextId });
    setNodeColorPickerId(null);
    toast.success("Saved to chain ✓");
  };

  const onMouseDownNode = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedId(id);
    const node = nodes.find((n) => n.id === id)!;
    draggingRef.current = {
      id,
      offsetX: e.clientX - node.x,
      offsetY: e.clientY - node.y,
    };
  };

  // Use local state during drag to avoid chain writes on every pixel
  const [localNodes, setLocalNodes] = useState<MindNode[] | null>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const { id, offsetX, offsetY } = draggingRef.current;
      setLocalNodes((prev) =>
        (prev ?? nodes).map((n) =>
          n.id === id
            ? { ...n, x: e.clientX - offsetX, y: e.clientY - offsetY }
            : n,
        ),
      );
    },
    [nodes],
  );

  const onMouseUp = useCallback(() => {
    if (draggingRef.current && localNodes) {
      saveMapData({ nodes: localNodes, nextId });
    }
    draggingRef.current = null;
    setLocalNodes(null);
  }, [localNodes, nextId, saveMapData]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const displayNodes = localNodes ?? nodes;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: BG,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <Button
          type="button"
          data-ocid="mindmap.primary_button"
          onClick={addChild}
          style={{
            fontSize: 12,
            height: 28,
            background: `${ACCENT}0.8)`,
            border: "none",
            color: "var(--os-text-primary)",
            padding: "0 12px",
          }}
        >
          + Add Child Node
        </Button>
        <Button
          type="button"
          data-ocid="mindmap.secondary_button"
          onClick={clearAll}
          variant="outline"
          style={{
            fontSize: 12,
            height: 28,
            borderColor: BORDER,
            color: MUTED,
            padding: "0 12px",
          }}
        >
          Clear All
        </Button>
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {NODE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              data-ocid="mindmap.toggle"
              onClick={() => setActiveColor(c)}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: c,
                border:
                  activeColor === c
                    ? "2px solid white"
                    : "2px solid transparent",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED }}>
          Double-click node to rename · Drag to move
        </span>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{ flex: 1, position: "relative", overflow: "hidden" }}
        onClick={() => setNodeColorPickerId(null)}
        onKeyDown={() => setNodeColorPickerId(null)}
      >
        {/* SVG edges */}
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <title>Mind map connections</title>
          {displayNodes
            .filter((n) => n.parentId !== null)
            .map((n) => {
              const parent = displayNodes.find((p) => p.id === n.parentId);
              if (!parent) return null;
              const cx = (parent.x + n.x) / 2;
              return (
                <path
                  key={n.id}
                  d={`M ${parent.x} ${parent.y} C ${cx} ${parent.y}, ${cx} ${n.y}, ${n.x} ${n.y}`}
                  stroke={n.color.replace("0.7)", "0.5)")}
                  strokeWidth="2"
                  fill="none"
                />
              );
            })}
        </svg>

        {/* Nodes */}
        {displayNodes.map((node) => (
          <div
            key={node.id}
            className="mind-node"
            onMouseDown={(e) => onMouseDownNode(e, node.id)}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              startEdit(node);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") startEdit(node);
            }}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              transform: "translate(-50%, -50%)",
              background: node.color.replace("0.7)", "0.2)"),
              border: `2px solid ${
                selectedId === node.id ? "var(--os-text-secondary)" : node.color
              }`,
              borderRadius: 10,
              padding: editingId === node.id ? "4px 8px" : "6px 14px",
              cursor: "grab",
              userSelect: "none",
              minWidth: 80,
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow:
                selectedId === node.id ? `0 0 12px ${node.color}` : "none",
            }}
          >
            {editingId === node.id ? (
              <input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: TEXT,
                  fontSize: 13,
                  width: 100,
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 13,
                  color: TEXT,
                  fontWeight: node.parentId === null ? 700 : 500,
                }}
              >
                {node.label}
              </span>
            )}
            {hoveredId === node.id && editingId !== node.id && (
              <div style={{ display: "flex", gap: 3, marginLeft: 2 }}>
                {/* Color picker trigger */}
                <button
                  type="button"
                  data-ocid="mindmap.toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNodeColorPickerId(
                      nodeColorPickerId === node.id ? null : node.id,
                    );
                  }}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: node.color,
                    border: "1px solid var(--os-text-secondary)",
                    cursor: "pointer",
                  }}
                />
                {node.id !== 1 && (
                  <button
                    type="button"
                    data-ocid="mindmap.delete_button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    style={{
                      background: "rgba(244,63,94,0.3)",
                      border: "none",
                      borderRadius: "50%",
                      width: 14,
                      height: 14,
                      color: "rgba(244,63,94,0.9)",
                      cursor: "pointer",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {/* Inline color picker */}
            {nodeColorPickerId === node.id && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(14,20,26,0.98)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: 8,
                  display: "flex",
                  gap: 6,
                  zIndex: 100,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {NODE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => changeNodeColor(node.id, c)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: c,
                      border:
                        node.color === c
                          ? "2px solid white"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
