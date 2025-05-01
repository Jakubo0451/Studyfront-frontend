import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

const SortableItem = ({ id, content, onQuestionSelect, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      modifiers: [restrictToVerticalAxis, restrictToParentElement],
      handle: "drag-handle",
    });

  const style = {
    transform: transform
      ? CSS.Transform.toString({
          ...transform,
          x: 0,
        })
      : "",
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="pl-2 pr-2 text-white flex justify-between items-center cursor-pointer rounded"
      onClick={() => onQuestionSelect(index)}
    >
      <div className="flex items-center space-x-2">
        <FaRegTrashAlt className="cursor-pointer text-red-500" />{" "}
        {/* Placeholder for delete functionality */}
        <div className="flex flex-col space-y-1">
          <MdDragIndicator
            {...attributes}
            {...listeners}
            data-handle="drag-handle"
            className="cursor-grab active:cursor-grabbing text-petrol-blue text-[1.8rem]"
          />
        </div>
      </div>
      <span className="flex-grow h-full text-left pl-2 ml-2 bg-petrol-blue rounded overflow-x-hidden whitespace-nowrap text-ellipsis">
        {content}
      </span>
    </div>
  );
};

const SideBar = ({
  questions,
  onQuestionSelect,
  onAddQuestion,
  setQuestions,
}) => {
  const [showAddQuestionMenu, setShowAddQuestionMenu] = useState(false);

  const handleAddButtonClick = () => {
    setShowAddQuestionMenu(!showAddQuestionMenu);
  };

  const handleAddQuestionType = (type) => {
    onAddQuestion(type);
    setShowAddQuestionMenu(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(
        (question) => `item-${question.id}` === active.id
      );
      const newIndex = questions.findIndex(
        (question) => `item-${question.id}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setQuestions((prevQuestions) =>
          arrayMove(prevQuestions, oldIndex, newIndex)
        );
      }
    }
  };

  return (
    <div className="w-80 bg-sky-blue h-full p-4 flex flex-col">
      <h2 className="text-xl w-full mb-4 text-center">Study Information</h2>
      <button className="mb-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center">
        Study information
      </button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={questions.map((question) => `item-${question.id}`)}
        >
          <div className="space-y-2 flex-grow border-b-2 border-t-2 border-dotted border-petrol-blue pb-4 pt-4 text-lg overflow-y-auto">
            {questions && questions.length > 0 ? (
              questions.map((question, index) => (
                <SortableItem
                  key={question.id}
                  id={`item-${question.id}`}
                  content={
                    question.type === "text"
                      ? `Text Question ${index + 1}`
                      : question.type === "multipleChoice"
                      ? `Multiple Choice ${index + 1}`
                      : question.type === "checkbox"
                      ? `Checkbox Question ${index + 1}`
                      : `Question ${index + 1}`
                  }
                  onQuestionSelect={onQuestionSelect}
                  index={index}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">
                No questions added yet.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>
      <div className="relative">
        <button
          onClick={handleAddButtonClick}
          className="mt-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center w-full"
        >
          <FaPlus className="mr-2" />
          Add Item
        </button>
        {showAddQuestionMenu && (
          <div className="absolute left-0 w-full bg-gray-100 rounded-md shadow-md mt-2 z-10">
            <button
              onClick={() => handleAddQuestionType("text")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Text Input
            </button>
            <button
              onClick={() => handleAddQuestionType("multipleChoice")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Multiple Choice
            </button>
            <button
              onClick={() => onAddQuestion("checkbox")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Checkbox
            </button>
            <button
              onClick={() => handleAddQuestionType("trueFalse")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              True/False
            </button>
            <button
              onClick={() => handleAddQuestionType("ratingScale")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Rating Scale
            </button>
            <button
              onClick={() => handleAddQuestionType("fileUpload")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              File Upload Only
            </button>
            <button
              onClick={() => handleAddQuestionType("longAnswer")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Long Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
