'use client';
import { useState, useEffect, useCallback } from 'react';
import checkboxStyles from '../../styles/questionTypes/checkboxQ.module.css';
import commonStyles from '../../styles/questionTypes/common.module.css';
import Artifact from './artifact';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function CheckboxQuestionBuilder({ questionData, onChange }) {
  const [title, setTitle] = useState(questionData?.title || '');
  const [checkboxes, setCheckboxes] = useState(
    questionData?.options || [{ id: 1, question: '' }]
  );

  // Notify parent component of changes
  useEffect(() => {
    console.log("CheckboxQuestionBuilder onChange triggered:", { title, options: checkboxes });
    onChange({
      title,
      options: checkboxes,
    });
  }, [title, checkboxes]);

  // Function to add a new checkbox
  const addCheckbox = () => {
    const newId = checkboxes.length + 1;
    setCheckboxes([...checkboxes, { id: newId, question: '' }]);
  };

  // Function to remove a checkbox
  const removeCheckbox = (idToRemove) => {
    if (checkboxes.length <= 1) return;

    const filteredCheckboxes = checkboxes.filter(
      (checkbox) => checkbox.id !== idToRemove
    );

    setCheckboxes(filteredCheckboxes);
  };

  // Function to handle input changes
  const handleCheckboxChange = (id, value) => {
    setCheckboxes((prev) =>
      prev.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, question: value } : checkbox
      )
    );
  };

  return (
    <div className={commonStyles.questionType + ' question-type'}>
      <h2>Checkbox Question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionName">Question Title:</label>
        <input
          type="text"
          name="questionName"
          id="questionName"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <Artifact mode="standalone" allowMultiple={true} />

      {checkboxes.map((checkbox) => (
        <div key={checkbox.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`checkbox${checkbox.id}`}>
              Checkbox {checkbox.id}:
            </label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeCheckbox(checkbox.id)}
              disabled={checkboxes.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          <div className={commonStyles.itemGroup}>
            <label htmlFor={`checkbox${checkbox.id}`}>Checkbox Name:</label>
            <input
              type="text"
              name={`checkbox${checkbox.id}`}
              id={`checkbox${checkbox.id}`}
              placeholder="Name"
              value={checkbox.question}
              onChange={(e) =>
                handleCheckboxChange(checkbox.id, e.target.value)
              }
            />
          </div>
        </div>
      ))}
      <button className={commonStyles.addItemBtn} onClick={addCheckbox}>
        <FaPlus /> Add another checkbox
      </button>
    </div>
  );
}