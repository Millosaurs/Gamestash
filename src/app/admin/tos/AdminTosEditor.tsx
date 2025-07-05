"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Pencil, Trash2, Check, X } from "lucide-react";

type AdminTosEditorProps = {
  initialContent: string;
  tosId: string;
};

// Extracts <li>...</li> as plain text (may be HTML or custom markup)
function extractClauses(html: string): string[] {
  const matches = html.match(/<li[^>]*>[\s\S]*?<\/li>/g);
  if (matches) {
    return matches.map((clause) => clause.replace(/<\/?li[^>]*>/g, "").trim());
  }
  return [html];
}

// Joins clauses as <ul><li>...</li></ul>
function joinClauses(clauses: string[]): string {
  return `<ul>\n${clauses.map((c) => `<li>${c}</li>`).join("\n")}\n</ul>`;
}

// Custom markup parser: **bold**, __underline__, !!italic!!
function parseCustomMarkup(text: string): string {
  return text
    .replace(/__([^_]+)__/g, "<u>$1</u>")
    .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/!!([^!]+)!!/g, "<em>$1</em>");
}

// Converts HTML tags to custom markup for editing
function htmlToCustomMarkup(html: string): string {
  return html
    .replace(/<u>(.*?)<\/u>/g, "__$1__")
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "!!$1!!")
    .replace(/<b>(.*?)<\/b>/g, "**$1**")
    .replace(/<i>(.*?)<\/i>/g, "!!$1!!")
    .replace(/<[^>]+>/g, ""); // Remove any other tags
}

export default function AdminTosEditor({
  initialContent,
  tosId,
}: AdminTosEditorProps) {
  const [clauses, setClauses] = useState(() => extractClauses(initialContent));
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // When editing, always show custom markup (not HTML)
  function handleEdit(idx: number) {
    setEditingIdx(idx);
    setEditValue(htmlToCustomMarkup(clauses[idx]));
    setIsAdding(false);
  }

  async function handleSaveClause(idx: number) {
    let newClauses = [...clauses];
    if (isAdding) {
      newClauses = [...clauses, editValue];
    } else {
      newClauses[idx] = editValue;
    }
    setClauses(newClauses);
    setEditingIdx(null);
    setIsAdding(false);

    setSaving(true);
    const res = await fetch("/api/admin/tos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tosId, content: joinClauses(newClauses) }),
    });
    setSaving(false);
    if (!res.ok) alert("Failed to update TOS");
  }

  function handleAddClause() {
    setEditingIdx(clauses.length);
    setEditValue("");
    setIsAdding(true);
  }

  function handleCancel() {
    setEditingIdx(null);
    setIsAdding(false);
    setEditValue("");
  }

  async function handleDeleteClause(idx: number) {
    if (!confirm("Delete this clause?")) return;
    const newClauses = clauses.filter((_, i) => i !== idx);
    setClauses(newClauses);

    setSaving(true);
    const res = await fetch("/api/admin/tos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tosId, content: joinClauses(newClauses) }),
    });
    setSaving(false);
    if (!res.ok) alert("Failed to update TOS");
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(clauses);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setClauses(reordered);

    setSaving(true);
    const res = await fetch("/api/admin/tos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tosId, content: joinClauses(reordered) }),
    });
    setSaving(false);
    if (!res.ok) alert("Failed to update TOS");
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Terms of Service</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tos-clauses">
          {(provided) => (
            <div
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {clauses.map((clause, idx) =>
                editingIdx === idx && !isAdding ? (
                  <Card key={idx} className="relative p-0">
                    <CardContent className="py-2 px-3 flex items-center gap-2">
                      <textarea
                        className="w-full border rounded p-1 text-sm"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={2}
                        style={{ resize: "vertical" }}
                      />
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <button
                          aria-label="Save"
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          onClick={() => handleSaveClause(idx)}
                          disabled={saving}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          aria-label="Cancel"
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Draggable
                    key={idx}
                    draggableId={`clause-${idx}`}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.7 : 1,
                        }}
                      >
                        <Card className="relative p-0">
                          <CardContent className="py-2 px-3 flex items-center gap-2">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab pr-2 text-gray-400 flex-shrink-0"
                              title="Drag to reorder"
                            >
                              <GripVertical size={16} />
                            </div>
                            <div
                              className="text-muted-foreground text-sm flex-1 min-w-0 break-words"
                              dangerouslySetInnerHTML={{
                                __html: parseCustomMarkup(clause),
                              }}
                            />
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              <button
                                aria-label="Edit"
                                className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                                onClick={() => handleEdit(idx)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                aria-label="Delete"
                                className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                onClick={() => handleDeleteClause(idx)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
              {editingIdx === clauses.length && isAdding && (
                <Card>
                  <CardContent className="py-2 px-3 flex items-center gap-2">
                    <textarea
                      className="w-full border rounded p-1 text-sm"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={2}
                      placeholder="Enter new clause"
                      style={{ resize: "vertical" }}
                    />
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <button
                        aria-label="Save"
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        onClick={() => handleSaveClause(clauses.length)}
                        disabled={saving || !editValue.trim()}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        aria-label="Cancel"
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button
                className="w-full mt-2"
                variant="secondary"
                onClick={handleAddClause}
                disabled={editingIdx !== null}
                size="sm"
              >
                + Add Clause
              </Button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
