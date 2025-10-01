import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API = import.meta.env.VITE_API_URL + "/api";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
}

interface Column {
  id: string;
  title: string;
  items: Task[];
}

interface Columns {
  [key: string]: Column;
}

const columnsFromTasks = (tasks: Task[]): Columns => ({
  todo: { id: "todo", title: "📋 To Do", items: tasks.filter(t => t.status === "todo") },
  in_progress: { id: "in_progress", title: "⚡ In Progress", items: tasks.filter(t => t.status === "in_progress") },
  done: { id: "done", title: "✅ Done", items: tasks.filter(t => t.status === "done") },
});

export default function Dashboard() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Columns>({});

  useEffect(() => { 
    fetchProject(); 
  }, []);

  async function fetchProject() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<Project[]>(`${API}/projects`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.data.length) {
        setCurrentProject(res.data[0]);
        setColumns(columnsFromTasks(res.data[0].tasks));
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const [moved] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
      setColumns({ 
        ...columns, 
        [source.droppableId]: { ...sourceCol, items: sourceItems } 
      });
    } else {
      const destItems = Array.from(destCol.items);
      moved.status = destination.droppableId as "todo" | "in_progress" | "done";
      destItems.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });

      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `${API}/tasks/${moved.id}`, 
          { status: moved.status }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{currentProject.title}</h2>
          <p className="text-gray-600">Manage your project tasks</p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columns).map(([colId, col]) => (
              <div key={colId} className="flex flex-col">
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h3 className="font-bold text-lg text-gray-800">{col.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">{col.items.length} Tasks</div>
                </div>

                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-lg p-4 transition-all duration-200 ${
                        snapshot.isDraggingOver 
                          ? 'bg-blue-100 shadow-lg' 
                          : 'bg-white/50 shadow-sm'
                      }`}
                      style={{ minHeight: '400px' }}
                    >
                      <div className="space-y-3">
                        {col.items.map((task, index) => (
                          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg p-4 border-l-4 transition-all duration-200 ${
                                  snapshot.isDragging 
                                    ? 'shadow-2xl rotate-2 scale-105 border-l-blue-500' 
                                    : 'shadow-md hover:shadow-lg border-l-gray-300'
                                } cursor-grab active:cursor-grabbing`}
                              >
                                <div className="font-semibold text-gray-800 mb-2">{task.title}</div>
                                <div className="text-sm text-gray-600 leading-relaxed">{task.description}</div>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                  <span className="text-xs text-gray-400">ID: {task.id}</span>
                                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                                    colId === 'todo' ? 'bg-gray-100 text-gray-700' :
                                    colId === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {col.title.split(' ')[1] || col.title}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}