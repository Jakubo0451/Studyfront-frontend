'use client';
import React, { useState, useEffect } from 'react'; // Added useEffect
import multiplechoiceStyles from '../../styles/questionTypes/multiplechoiceQ.module.css';
import commonStyles from '../../styles/questionTypes/common.module.css';
import Artifact from './artifact';
import { FaPlus, FaTrash } from "react-icons/fa";

function MultipleChoiceQuestionComponent({ questionData, onChange }) { // Renamed and added props
  const [title, setTitle] = useState(questionData?.title || '');
  const [choiceGroups, setChoiceGroups] = useState(
    questionData?.choiceGroups?.map((group, gIndex) => ({
      ...group,
      id: group.id || `${Date.now()}-mcg-${gIndex}`, // Ensure group ID
      options: group.options?.map((opt, oIndex) => ({
        ...opt,
        id: opt.id || `${Date.now()}-mco-${gIndex}-${oIndex}`, // Ensure option ID
      })) || [{ id: `${Date.now()}-mco-${gIndex}-0`, text: '' }],
    })) || [{ 
      id: `${Date.now()}-mcg-0`, 
      label: '', 
      options: [{ id: `${Date.now()}-mco-0-0`, text: '' }] 
    }]
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        choiceGroups,
      });
    }
  }, [title, choiceGroups, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addChoiceGroup = () => {
    const newGroupId = `${Date.now()}-mcg-${choiceGroups.length}`;
    setChoiceGroups([
      ...choiceGroups,
      {
        id: newGroupId,
        label: '',
        options: [{ id: `${Date.now()}-mco-${choiceGroups.length}-0`, text: '' }, { id: `${Date.now()}-mco-${choiceGroups.length}-1`, text: '' }], // Start with 2 options
      },
    ]);
  };

  const removeChoiceGroup = (groupId) => {
    if (choiceGroups.length <= 1) return;
    setChoiceGroups(choiceGroups.filter(group => group.id !== groupId));
  };

  const handleGroupLabelChange = (groupId, value) => {
    setChoiceGroups(choiceGroups.map(group =>
      group.id === groupId ? { ...group, label: value } : group
    ));
  };

  const addOption = (groupId) => {
    setChoiceGroups(choiceGroups.map(group => {
      if (group.id === groupId) {
        const newOptionId = `${Date.now()}-mco-${group.id}-${group.options.length}`;
        return {
          ...group,
          options: [...group.options, { id: newOptionId, text: '' }],
        };
      }
      return group;
    }));
  };

  const removeOption = (groupId, optionId) => {
    setChoiceGroups(choiceGroups.map(group => {
      if (group.id === groupId) {
        if (group.options.length <= 2) return group; // Keep at least 2 options
        return {
          ...group,
          options: group.options.filter(option => option.id !== optionId),
        };
      }
      return group;
    }));
  };

  const handleOptionChange = (groupId, optionId, value) => {
    setChoiceGroups(choiceGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          options: group.options.map(option =>
            option.id === optionId ? { ...option, text: value } : option
          ),
        };
      }
      return group;
    }));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Multiple choice question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionTitle_mc">Question title:</label>
        <input
          type="text"
          name="questionTitle_mc"
          id="questionTitle_mc"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <Artifact mode="standalone" allowMultiple={true} />

      {choiceGroups.map((group, groupIndex) => (
        <div key={group.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`choiceGroupLabel_${group.id}`}>Choice Group {groupIndex + 1}:</label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeChoiceGroup(group.id)}
              disabled={choiceGroups.length <= 1}
            >
              <FaTrash /> Remove Group
            </button>
          </div>

          <div className={commonStyles.itemGroup}>
            <label htmlFor={`groupLabel_${group.id}`}>Group label:</label>
            <input
              type="text"
              name={`groupLabel_${group.id}`}
              id={`groupLabel_${group.id}`}
              placeholder="Group label (optional)"
              value={group.label}
              onChange={(e) => handleGroupLabelChange(group.id, e.target.value)}
            />

            <h4>Options (select one):</h4>
            <div className={multiplechoiceStyles.optionsContainer}>
              {group.options.map((option, optionIndex) => (
                <div key={option.id} className={commonStyles.singleOptionBox}>
                  <div className={commonStyles.itemHeader}>
                    <label htmlFor={`optionText_${option.id}`}>Option {optionIndex + 1}:</label>
                    <button
                      type="button"
                      className={commonStyles.removeBtn}
                      onClick={() => removeOption(group.id, option.id)}
                      disabled={group.options.length <= 2}
                    >
                      <FaTrash /> Remove Option
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      name={`optionText_${option.id}`}
                      id={`optionText_${option.id}`}
                      placeholder="Option text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(group.id, option.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className={commonStyles.addItemBtn + " mt-2"}
              onClick={() => addOption(group.id)}
            >
              <FaPlus /> Add option
            </button>
          </div>
        </div>
      ))}

      <button className={commonStyles.addItemBtn + " mt-4"} onClick={addChoiceGroup}>
        <FaPlus /> Add another choice group
      </button>
    </div>
  );
}

const MultipleChoiceQuestionBuilder = React.memo(MultipleChoiceQuestionComponent);
export default MultipleChoiceQuestionBuilder;