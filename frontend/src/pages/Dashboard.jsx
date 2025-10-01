import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const API = import.meta.env.VITE_API_URL + '/api'

function columnsFromTasks(tasks){
  return {
    todo: { id:'todo', title:'To Do', items: tasks.filter(t=>t.status==='todo') },
    in_progress: { id:'in_progress', title:'In Progress', items: tasks.filter(t=>t.status==='in_progress') },
    done: { id:'done', title:'Done', items: tasks.filter(t=>t.status==='done') }
  }
}

export default function Dashboard(){
  const [projects,setProjects] = useState([])
  const [currentProject,setCurrentProject] = useState(null)
  const [columns,setColumns] = useState({})

  useEffect(()=>{ fetchProjects() }, [])

  async function fetchProjects(){
    const token = localStorage.getItem('token')
    const res = await axios.get(API + '/projects', { headers: { Authorization: 'Bearer ' + token } })
    setProjects(res.data)
    if (res.data.length) {
      setCurrentProject(res.data[0])
      setColumns(columnsFromTasks(res.data[0].tasks))
    }
  }

  function onDragEnd(result){
    if (!result.destination) return
    const { source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = columns[source.droppableId]
    const destCol = columns[destination.droppableId]
    const sourceItems = Array.from(sourceCol.items)
    const [moved] = sourceItems.splice(source.index,1)

    if (source.droppableId === destination.droppableId){
      sourceItems.splice(destination.index,0,moved)
      setColumns({...columns, [source.droppableId]: {...sourceCol, items:sourceItems}})
    } else {
      const destItems = Array.from(destCol.items)
      destItems.splice(destination.index,0,moved)
      moved.status = destination.droppableId
      // persist change
      const token = localStorage.getItem('token')
      axios.patch(API + '/tasks/' + moved.id, { status: moved.status }, { headers: { Authorization: 'Bearer ' + token } })
      setColumns({...columns, [source.droppableId]: {...sourceCol, items:sourceItems}, [destination.droppableId]: {...destCol, items:destItems}})
    }
  }

  if (!currentProject) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{currentProject.title}</h2>

      <div className="grid grid-cols-3 gap-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([id, col]) => (
            <Droppable droppableId={id} key={id}>
              {(provided)=>(
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-white p-4 rounded shadow min-h-[200px]">
                  <h3 className="font-semibold mb-2">{col.title}</h3>
                  {col.items.map((item, index)=>(
                    <Draggable draggableId={String(item.id)} index={index} key={item.id}>
                      {(provided)=>(
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          className="p-3 mb-2 border rounded">
                          <div className="font-bold">{item.title}</div>
                          <div className="text-sm">{item.description}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}
