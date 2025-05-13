"use client";
import React, { useState, useEffect } from "react";
import checkboxStyles from "../../styles/questionTypes/checkboxQ.module.css";
import commonStyles from "../../styles/questionTypes/common.module.css";
import Artifact from "./artifact";
import { FaPlus, FaTrash } from "react-icons/fa";

function CheckboxQuestionBuilderComponent({ questionData, onChange, study }) {
  const [title, setTitle] = useState(questionData?.title || "");
  const [checkboxGroups, setCheckboxGroups] = useState(
    questionData?.checkboxGroups?.map((group, gIndex) => ({
      ...group,
      id: group.id || `${Date.now()}-cg-${gIndex}`,
      options: group.options?.map((opt, oIndex) => ({
        ...opt,
        id: opt.id || `${Date.now()}-opt-${gIndex}-${oIndex}`,
      })) || [{ id: `${Date.now()}-opt-${gIndex}-0`, text: "" }],
    })) || [
      {
        id: `${Date.now()}-cg-0`,
        label: "",
        options: [{ id: `${Date.now()}-opt-0-0`, text: "" }],
      },
    ]
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        checkboxGroups,
      });
    }
  }, [title, checkboxGroups, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addCheckboxGroup = () => {
    const newGroupId = `${Date.now()}-cg-${checkboxGroups.length}`;
    setCheckboxGroups([
      ...checkboxGroups,
      {
        id: newGroupId,
        label: "",
        options: [
          { id: `${Date.now()}-opt-${checkboxGroups.length}-0`, text: "" },
        ],
      },
    ]);
  };

  const removeCheckboxGroup = (groupId) => {
    if (checkboxGroups.length <= 1) return;
    setCheckboxGroups(checkboxGroups.filter((group) => group.id !== groupId));
  };

  const handleGroupLabelChange = (groupId, value) => {
    setCheckboxGroups(
      checkboxGroups.map((group) =>
        group.id === groupId ? { ...group, label: value } : group
      )
    );
  };

  const addOption = (groupId) => {
    setCheckboxGroups(
      checkboxGroups.map((group) => {
        if (group.id === groupId) {
          const newOptionId = `${Date.now()}-opt-${group.id}-${
            group.options.length
          }`;
          return {
            ...group,
            options: [...group.options, { id: newOptionId, text: "" }],
          };
        }
        return group;
      })
    );
  };

  const removeOption = (groupId, optionId) => {
    setCheckboxGroups(
      checkboxGroups.map((group) => {
        if (group.id === groupId) {
          if (group.options.length <= 1) return group;
          return {
            ...group,
            options: group.options.filter((option) => option.id !== optionId),
          };
        }
        return group;
      })
    );
  };

  const handleOptionChange = (groupId, optionId, value) => {
    setCheckboxGroups(
      checkboxGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map((option) =>
              option.id === optionId ? { ...option, text: value } : option
            ),
          };
        }
        return group;
      })
    );
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Checkbox question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionTitle_checkbox">Question title:</label>
        <input
          type="text"
          name="questionTitle_checkbox"
          id="questionTitle_checkbox"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <Artifact
        mode="standalone"
        allowMultiple={true}
        studyId={study?._id}
        initialArtifactId={null}
        onArtifactSelect={(artifactId, artifactName, artifactImage) => {
          console.log(
            "Selected artifact:",
            artifactId,
            artifactName,
            artifactImage
          );
        }}
      />

      {checkboxGroups.map((group, groupIndex) => (
        <div key={group.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`checkboxGroupLabel_${group.id}`}>
              Checkbox Group {groupIndex + 1}:
            </label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeCheckboxGroup(group.id)}
              disabled={checkboxGroups.length <= 1}
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

            <h4>Checkbox options:</h4>
            <div className={checkboxStyles.optionsContainer}>
              {group.options.map((option, optionIndex) => (
                <div key={option.id} className={commonStyles.singleOptionBox}>
                  <div className={commonStyles.itemHeader}>
                    <label htmlFor={`optionText_${option.id}`}>
                      Option {optionIndex + 1}:
                    </label>
                    <button
                      type="button"
                      className={commonStyles.removeBtn}
                      onClick={() => removeOption(group.id, option.id)}
                      disabled={group.options.length <= 1}
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
                      onChange={(e) =>
                        handleOptionChange(group.id, option.id, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={commonStyles.addItemBtn + " mt-2"}
              onClick={() => addOption(group.id)}
            >
              <FaPlus /> Add checkbox option
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={commonStyles.addItemBtn + " mt-4"}
        onClick={addCheckboxGroup}
      >
        <FaPlus /> Add another checkbox group
      </button>
    </div>
  );
}

const CheckboxQuestionBuilder = React.memo(CheckboxQuestionBuilderComponent);
export default CheckboxQuestionBuilder;
