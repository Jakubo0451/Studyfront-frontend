// components/studyCreator/sideBar.jsx
import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown, FaPlus, FaRegTrashAlt } from "react-icons/fa";

const SideBar = ({ questions, onQuestionSelect, onAddQuestion }) => {
  const [showAddQuestionMenu, setShowAddQuestionMenu] = useState(false);

  const handleAddButtonClick = () => {
    setShowAddQuestionMenu(!showAddQuestionMenu);
  };

  const handleAddQuestionType = (type) => {
    onAddQuestion(type);
    setShowAddQuestionMenu(false);
  };

  return (
    <div className="w-80 bg-sky-blue h-full p-4 flex flex-col">
      <h2 className="text-xl w-full mb-4 text-center">Study Information</h2>
      <button className="mb-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center">
        Study information
      </button>
      <hr className="my-4 border-t-2 border-dotted border-petrol-blue" />
      <h2 className="text-lg font-semibold mb-2">Questions</h2>
      <div className="space-y-2 flex-grow pb-4 pt-4 text-lg overflow-y-auto">
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={index}
              onClick={() => onQuestionSelect(index)}
              className="pl-2 pr-2 text-white flex justify-between items-center cursor-pointer hover:bg-petrol-blue rounded"
            >
              <div className="flex items-center space-x-2">
                <FaRegTrashAlt className="cursor-pointer text-red-500" /> {/* Placeholder for delete functionality */}
                <div className="flex flex-col space-y-1">
                  <FaChevronUp className="cursor-pointer text-petrol-blue" /> {/* Placeholder for move up */}
                  <FaChevronDown className="cursor-pointer text-petrol-blue" /> {/* Placeholder for move down */}
                </div>
              </div>
              <span className="flex-grow h-full text-left pl-2 ml-2 bg-petrol-blue rounded">
                {question.type === 'text' && `Text Question ${index + 1}`}
                {question.type === 'multipleChoice' && `Multiple Choice ${index + 1}`}
                {question.type || `Question ${index + 1}`}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No questions added yet.</p>
        )}
      </div>
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
              onClick={() => handleAddQuestionType('text')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Text Input
            </button>
            <button
              onClick={() => handleAddQuestionType('multipleChoice')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Multiple Choice
            </button>
            <button
              onClick={() => handleAddQuestionType('trueFalse')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              True/False
            </button>
            <button
              onClick={() => handleAddQuestionType('ratingScale')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Rating Scale
            </button>
            <button
              onClick={() => handleAddQuestionType('fileUpload')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              File Upload Only
            </button>
            <button
              onClick={() => handleAddQuestionType('longAnswer')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Long Answer
            </button>
            {/* Add buttons for all 6 question types */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;