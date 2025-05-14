"use client";
import { useState, useEffect } from "react"; // Added useEffect
import multiplechoiceStyles from "../../styles/questionTypes/multiplechoiceQ.module.css";
import commonStyles from "../../styles/questionTypes/common.module.css";
import Artifact from "./artifact";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function MultipleChoiceQuestionBuilder({ questionData, onChange, study }) {
  // Renamed and added props
  const [title, setTitle] = useState(questionData?.title || "");
  const [choiceGroups, setChoiceGroups] = useState(
    questionData?.choiceGroups?.map((group, gIndex) => ({
      ...group,
      id: group.id || `${Date.now()}-mcg-${gIndex}`, // Ensure group ID
      options: group.options?.map((opt, oIndex) => ({
        ...opt,
        id: opt.id || `${Date.now()}-mco-${gIndex}-${oIndex}`, // Ensure option ID
      })) || [{ id: `${Date.now()}-mco-${gIndex}-0`, text: "" }],
    })) || [
      {
        id: `${Date.now()}-mcg-0`,
        label: "",
        options: [{ id: `${Date.now()}-mco-0-0`, text: "" }],
      },
    ]
  );
  const [artifacts, setArtifacts] = useState(questionData?.artifacts || []);

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        choiceGroups,
        artifacts // Include artifacts in data sent back
      });
    }
  }, [title, choiceGroups, artifacts, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addChoiceGroup = () => {
    const newGroupId = `${Date.now()}-mcg-${choiceGroups.length}`;
    setChoiceGroups([
      ...choiceGroups,
      {
        id: newGroupId,
        label: "",
        options: [
          { id: `${Date.now()}-mco-${choiceGroups.length}-0`, text: "" },
          { id: `${Date.now()}-mco-${choiceGroups.length}-1`, text: "" },
        ], // Start with 2 options
      },
    ]);
  };

  const removeChoiceGroup = (groupId) => {
    if (choiceGroups.length <= 1) return;
    setChoiceGroups(choiceGroups.filter((group) => group.id !== groupId));
  };

  const handleGroupLabelChange = (groupId, value) => {
    setChoiceGroups(
      choiceGroups.map((group) =>
        group.id === groupId ? { ...group, label: value } : group
      )
    );
  };

  const addOption = (groupId) => {
    setChoiceGroups(
      choiceGroups.map((group) => {
        if (group.id === groupId) {
          const newOptionId = `${Date.now()}-mco-${group.id}-${
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
    setChoiceGroups(
      choiceGroups.map((group) => {
        if (group.id === groupId) {
          if (group.options.length <= 2) return group; // Keep at least 2 options
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
    setChoiceGroups(
      choiceGroups.map((group) => {
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

  // Update the existing handleArtifactSelect function
  const handleArtifactSelect = (artifactId, artifactName, artifactImage, contentType) => {
    const newArtifact = {
      id: artifactId,
      name: artifactName,
      imageUrl: artifactImage,
      contentType: contentType || 'image',
      title: artifactName, // Initialize title with artifact name
      label: artifactName  // Add label field
    };
    
    // Check if artifact already exists to preserve its label/title
    const existingArtifactIndex = artifacts.findIndex(a => a.id === artifactId);
    if (existingArtifactIndex >= 0) {
      // Update existing artifact but preserve its title/label
      const updatedArtifacts = [...artifacts];
      updatedArtifacts[existingArtifactIndex] = {
        ...updatedArtifacts[existingArtifactIndex],
        name: artifactName,
        imageUrl: artifactImage,
        contentType: contentType || 'image'
      };
      setArtifacts(updatedArtifacts);
    } else {
      // Add new artifact
      setArtifacts(prev => [...prev, newArtifact]);
    }
  };

  // Add this function to update artifact labels
  const updateArtifactLabel = (artifactId, newLabel) => {
    const updatedArtifacts = artifacts.map(artifact => 
      artifact.id === artifactId 
        ? { ...artifact, label: newLabel, title: newLabel } 
        : artifact
    );
    
    setArtifacts(updatedArtifacts);
  };
  
  // Add or update the removeArtifact function
  const removeArtifact = (artifactIdToRemove) => {
    // Remove the artifact from state
    const updatedArtifacts = artifacts.filter(artifact => artifact.id !== artifactIdToRemove);
    setArtifacts(updatedArtifacts);
    // The onChange callback will trigger automatically via useEffect
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

      <Artifact
        mode="standalone"
        allowMultiple={true}
        studyId={study?._id}
        initialArtifactId={null}
        initialArtifacts={artifacts} 
        onArtifactSelect={handleArtifactSelect}
        onLabelChange={updateArtifactLabel}
        onRemoveArtifact={removeArtifact} // Add this line
      />
      

      {choiceGroups.map((group, groupIndex) => (
        <div key={group.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`choiceGroupLabel_${group.id}`}>
              Choice Group {groupIndex + 1}:
            </label>
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
                    <label htmlFor={`optionText_${option.id}`}>
                      Option {optionIndex + 1}:
                    </label>
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
              <FaPlus /> Add option
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={commonStyles.addItemBtn + " mt-4"}
        onClick={addChoiceGroup}
      >
        <FaPlus /> Add another choice group
      </button>
    </div>
  );
}
