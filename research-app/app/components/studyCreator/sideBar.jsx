import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { FaChevronUp, FaChevronDown, FaPlus, FaRegTrashAlt } from "react-icons/fa";

const SortableItem = ({ id, content }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="pl-2 pr-2 text-white flex justify-between items-center"
    >
      <div className="flex items-center space-x-2">
        <FaRegTrashAlt className="cursor-pointer text-red-500" />
        <div className="flex flex-col space-y-1">
          <FaChevronUp className="cursor-pointer text-petrol-blue" />
          <FaChevronDown className="cursor-pointer text-petrol-blue" />
        </div>
      </div>
      <span className="flex-grow h-full text-left pl-2 ml-2 bg-petrol-blue rounded">
        {content}
      </span>
    </div>
  );
};

const SideBar = () => {
  const [items, setItems] = useState([
    //test data, replace with api call later
    { id: 'item-1', content: 'Item 1 long long long long long long long' },
    { id: 'item-2', content: 'Item 2' },
    { id: 'item-3', content: 'Item 3' },
    { id: 'item-4', content: 'Item 4' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="w-80 bg-sky-blue h-full p-4 flex flex-col">
      <h2 className="text-xl w-full mb-4 text-center">Sidebar Heading</h2>
      <button className="mb-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center">
        Study information
      </button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)}>
          <div className="space-y-2 flex-grow border-b-2 border-t-2 border-dotted border-petrol-blue pb-4 pt-4 text-lg">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button className="mt-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center">
        <FaPlus className="mr-2" />
        Add Item
      </button>
    </div>
  );
};

export default SideBar;