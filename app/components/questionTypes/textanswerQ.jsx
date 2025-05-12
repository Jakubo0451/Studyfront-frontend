'use client';
import React, { useState, useEffect, useCallback } from 'react';
import commonStyles from '../../styles/questionTypes/common.module.css';
import Artifact from './artifact';
import { FaPlus, FaTrash } from "react-icons/fa";

function TextanswerQuestionComponent({ questionData, onChange }) {
  const [title, setTitle] = useState(questionData?.title || '');
  const [textAreas, setTextAreas] = useState(
    questionData?.textAreas?.map((area, index) => ({
      ...area,
      id: area.id || `${Date.now()}-ta-${index}`,
    })) || [{ id: `${Date.now()}-ta-0`, label: '' }]
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        textAreas,
      });
    }
  }, [title, textAreas, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addTextArea = () => {
    const newId = `${Date.now()}-ta-${textAreas.length}`;
    setTextAreas([...textAreas, { id: newId, label: '' }]);
  };

  const removeTextArea = (idToRemove) => {
    if (textAreas.length <= 1) return;
    setTextAreas(textAreas.filter(area => area.id !== idToRemove));
  };

  const handleTextAreaLabelChange = (id, value) => {
    setTextAreas(textAreas.map(area =>
      area.id === id ? { ...area, label: value } : area
    ));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Text answer question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionTitle_text">Question title:</label>
        <input
          type="text"
          name="questionTitle_text"
          id="questionTitle_text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <Artifact mode="standalone" allowMultiple={true} />

      {textAreas.map((textArea, index) => (
        <div key={textArea.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`textAreaLabel_${textArea.id}`}>Text Area {index + 1}:</label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeTextArea(textArea.id)}
              disabled={textAreas.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          <div className={commonStyles.itemGroup}>
            <label htmlFor={`textAreaInput_${textArea.id}`}>Text area label (optional, prompt for user):</label>
            <input
              type="text"
              name={`textAreaInput_${textArea.id}`}
              id={`textAreaInput_${textArea.id}`}
              placeholder="e.g., Please describe your experience..."
              value={textArea.label}
              onChange={(e) => handleTextAreaLabelChange(textArea.id, e.target.value)}
            />
          </div>
        </div>
      ))}
      <button className={commonStyles.addItemBtn} onClick={addTextArea}>
        <FaPlus /> Add another text area
      </button>
    </div>
  );
}

const TextanswerQuestionBuilder = React.memo(TextanswerQuestionComponent);
export default TextanswerQuestionBuilder;