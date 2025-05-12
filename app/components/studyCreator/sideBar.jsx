import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FaPlus, FaRegTrashAlt, FaCheck  } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import styles from '../../styles/studyCreator/sidebar.module.css';
import { IoIosClose } from "react-icons/io";

const SortableItem = ({ id, content, onQuestionSelect, index, isSelected, onDeleteQuestion }) => {
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
    // Add outline styling when selected
    ...(isSelected && { 
      outline: '',
    })
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    console.log(`Delete question at index: ${index}`);
    console.log(`Delete question with id: ${id}`);
    onDeleteQuestion(index);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`pl-2 pr-2 text-white flex justify-between items-center cursor-pointer rounded`}
      onClick={() => onQuestionSelect(index)}
    >
      <div className="flex items-center space-x-2">
        <FaRegTrashAlt onClick={handleDelete} className="cursor-pointer text-red-500" />{" "}
        <div className="flex flex-col space-y-1">
          <MdDragIndicator
            {...attributes}
            {...listeners}
            data-handle="drag-handle"
            className="cursor-grab active:cursor-grabbing text-petrol-blue text-[1.8rem]"
          />
        </div>
      </div>
      <span className={`flex-grow h-full text-left pl-2 ml-2 bg-petrol-blue rounded overflow-x-hidden whitespace-nowrap text-ellipsis 
        ${isSelected ? 'outline-solid outline-white' : ''}`}>
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
  selectedQuestionIndex,
  studyTitle,
  onViewStudyDetails,
  onChange,
  study,
  deleteQuestion,
  saveStatus,
}) => {
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      setStudyId(params.id);
    }
  }, [params]);

  const [showAddQuestionMenu, setShowAddQuestionMenu] = useState(false);

  const handleAddButtonClick = () => {
    setShowAddQuestionMenu(!showAddQuestionMenu);
  };

  const handleAddQuestionType = (type) => {
    onChange()
    onAddQuestion(type);
    setShowAddQuestionMenu(false);
  };

  const onDeleteQuestion = (index) => {
    const questionToDelete = questions[index];

    if (!questionToDelete._id) {
      setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
      return;
    }

    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    deleteQuestion(
      study._id,
      questionToDelete._id,
      (updatedStudy) => {
        console.log("Question deleted successfully.");
        setQuestions(updatedStudy.questions);
      },
      (error) => {
        console.error("Failed to delete the question:", error);
        alert("Failed to delete the question. Please try again.");
      }
    );
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
      <h2 className="text-xl w-full mb-4 text-center">{studyTitle}</h2>
      <div
        className={`flex flex-row items-center justify-center text-green-500 mb-4 ${
          saveStatus ? '' : 'invisible'
      }`}
      >
        <FaCheck />
        <p>Study saved</p>
      </div>
      <button
        onClick={onViewStudyDetails}
        type="button"
        className="mb-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center"
      >
        Study Information
      </button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
      items={questions?.map((question) => `item-${question.id}`) || []}
    >
      <div className="space-y-2 flex-grow border-b-2 border-t-2 border-dotted border-petrol-blue pb-4 pt-4 text-lg overflow-y-auto">
        {questions?.length > 0 ? (
          questions.map((question, index) => (
            <SortableItem
              key={`${question.id}-${index}`}
              id={`item-${question.id}`}
              content={
                question.type === "text"
                  ? `${index + 1}: Text Question`
                  : question.type === "multipleChoice"
                  ? `${index + 1}: Multiple Choice`
                  : question.type === "checkbox"
                  ? `${index + 1}: Checkbox Question`
                  : question.type === "ratingScale"
                  ? `${index + 1}: Rating Scale Question`
                  : `Question ${index + 1}`
              }
              onQuestionSelect={onQuestionSelect}
              index={index}
              onDeleteQuestion={onDeleteQuestion}
              isSelected={index === selectedQuestionIndex}
            />
          ))
        ) : (
          <p className="text-center text-gray-600">No questions added yet.</p>
        )}
      </div>
      </SortableContext>
      </DndContext>
      <div className="relative">
        <button
          type="button"
          onClick={handleAddButtonClick}
          className="mt-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center w-full hover:bg-oxford-blue transition duration-300 cursor-pointer"
        >
          <FaPlus className="mr-2" />
          Add Question
        </button>
        {showAddQuestionMenu && (
          <div className={styles.addQuestionPopup}>
            <div className="closePopupBackground" onClick={handleAddButtonClick}></div>
            <div>
              <div className={styles.addQuestionMenu}>
                <h2>Add question</h2>
                <div>
                  <button
                    type="button"
                    onClick={() => handleAddQuestionType("ratingScale")}
                  >
                    <img src="/questionTypes/ratingQ.svg" alt="Rating scale" />
                    Rating Scale
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddQuestionType("checkbox")}
                  >
                    <img src="/questionTypes/checkboxQ.svg" alt="Rating scale" />
                    Checkbox
                  </button>
                </div>
              </div>
              <div onClick={handleAddButtonClick}>
                <button type="button" className="closeBtn" title="Close menu" onClick={handleAddButtonClick}><IoIosClose /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
