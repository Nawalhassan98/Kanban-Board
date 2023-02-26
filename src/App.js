import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as uuid from "uuid";
import "./App.css"
import NewItemForm from "./NewItemForm";


const itemsData = [
  { id: uuid.v4(), content: "First task" },
  { id: uuid.v4(), content: "Second task" },
  { id: uuid.v4(), content: "Third task"},
  { id: uuid.v4(), content: "Fourth task" },
  { id: uuid.v4(), content: "Fifth task" }
];

const columnsData = {
  
  [uuid.v4()]: {
    name: "To-do",
    items: itemsData
    
  },
  [uuid.v4()]: {
    name: "In Progress",
    items: []
   
  },
  [uuid.v4()]: {
    name: "Finished",
    items: []
  
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsData);
  const handleAddItem = (columnId, content) => {
    const column = columns[columnId];
    const newItems = [...column.items, { id: uuid.v4(), content }];
    const newColumns = {
      ...columns,
      [columnId]: {
        ...column,
        items: newItems,
      },
    };
    setColumns(newColumns);
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%", paddingTop:"400px"}} >
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#D8BFD8"
                            : "#DDA0DD",
                          padding: 20,
                          width: 300,
                          minHeight: 500,
                          borderRadius:50
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 20,
                                      margin: "3px 3px 8px 3px",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#9932CC"
                                        : "#BA55D3",
                                      color: "white",
                                      borderRadius:50,
                                      textAlign:"center",
                                      fontSize:"25px",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
              {index === 0 && (
                <NewItemForm
                  columnId={columnId}
                  onAddItem={handleAddItem}
                />
              )}
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
