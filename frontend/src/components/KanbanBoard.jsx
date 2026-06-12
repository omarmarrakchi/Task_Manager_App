import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const COLUMNS = [
  { id: "TODO",        label: "TODO",        accent: "#595959" },
  { id: "IN_PROGRESS", label: "IN PROGRESS",  accent: "#FFE600" },
  { id: "DONE",        label: "DONE",         accent: "#2E7D32" },
];

export default function KanbanBoard({ tasks, onEdit, onDelete, onDragEnd }) {
  const byStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = byStatus(col.id);
          return (
            <div
              key={col.id}
              style={{ background: "#fff", border: "1px solid #D3D3D3" }}
            >
              {/* Column header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: "#1A1A1A", borderBottom: `3px solid ${col.accent}` }}
              >
                <span className="font-bold text-sm tracking-widest" style={{ color: col.accent }}>
                  {col.label}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5"
                  style={{ background: col.accent, color: col.accent === "#FFE600" ? "#1A1A1A" : "#fff" }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="kanban-col p-3"
                    style={{
                      background: snapshot.isDraggingOver ? "#FFFDE7" : "#fff",
                      transition: "background 0.15s",
                    }}
                  >
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div
                        className="text-xs text-center py-8"
                        style={{ color: "#D3D3D3", border: "2px dashed #E5E5E5" }}
                      >
                        Drop tasks here
                      </div>
                    )}
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              dragging={snap.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
