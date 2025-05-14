"use client";
import React, { useState, useEffect } from "react"; // Added useEffect
import dropdownStyles from "../../styles/questionTypes/dropdownQ.module.css";
import commonStyles from "../../styles/questionTypes/common.module.css";
import Artifact from "./artifact";
import { FaPlus, FaTrash } from "react-icons/fa";

function DropdownQuestionComponent({ questionData, onChange, study }) {
  // Renamed and added props
  const [title, setTitle] = useState(questionData?.title || "");
  const [dropdowns, setDropdowns] = useState(
    questionData?.dropdowns?.map((dropdown, dIndex) => ({
      ...dropdown,
      id: dropdown.id || `${Date.now()}-dd-${dIndex}`, // Ensure dropdown ID
      options: dropdown.options?.map((opt, oIndex) => ({
        ...opt,
        id: opt.id || `${Date.now()}-ddo-${dIndex}-${oIndex}`, // Ensure option ID
      })) || [{ id: `${Date.now()}-ddo-${dIndex}-0`, text: "" }],
    })) || [
      {
        id: `${Date.now()}-dd-0`,
        label: "",
        options: [{ id: `${Date.now()}-ddo-0-0`, text: "" }],
      },
    ]
  );

  const [artifacts, setArtifacts] = useState(questionData?.artifacts || []);

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        dropdowns,
        artifacts, // Include artifacts in data sent back
      });
    }
  }, [title, dropdowns, artifacts, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addDropdown = () => {
    const newDropdownId = `${Date.now()}-dd-${dropdowns.length}`;
    setDropdowns([
      ...dropdowns,
      {
        id: newDropdownId,
        label: "",
        options: [
          { id: `${Date.now()}-ddo-${dropdowns.length}-0`, text: "" },
          { id: `${Date.now()}-ddo-${dropdowns.length}-1`, text: "" },
        ], // Start with 2 options
      },
    ]);
  };

  const removeDropdown = (dropdownId) => {
    if (dropdowns.length <= 1) return;
    setDropdowns(dropdowns.filter((dropdown) => dropdown.id !== dropdownId));
  };

  const handleDropdownLabelChange = (dropdownId, value) => {
    setDropdowns(
      dropdowns.map((dropdown) =>
        dropdown.id === dropdownId ? { ...dropdown, label: value } : dropdown
      )
    );
  };

  const addOption = (dropdownId) => {
    setDropdowns(
      dropdowns.map((dropdown) => {
        if (dropdown.id === dropdownId) {
          const newOptionId = `${Date.now()}-ddo-${dropdown.id}-${
            dropdown.options.length
          }`;
          return {
            ...dropdown,
            options: [...dropdown.options, { id: newOptionId, text: "" }],
          };
        }
        return dropdown;
      })
    );
  };

  const removeOption = (dropdownId, optionId) => {
    setDropdowns(
      dropdowns.map((dropdown) => {
        if (dropdown.id === dropdownId) {
          if (dropdown.options.length <= 2) return dropdown;
          return {
            ...dropdown,
            options: dropdown.options.filter(
              (option) => option.id !== optionId
            ),
          };
        }
        return dropdown;
      })
    );
  };

  const handleOptionChange = (dropdownId, optionId, value) => {
    setDropdowns(
      dropdowns.map((dropdown) => {
        if (dropdown.id === dropdownId) {
          return {
            ...dropdown,
            options: dropdown.options.map((option) =>
              option.id === optionId ? { ...option, text: value } : option
            ),
          };
        }
        return dropdown;
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
      <h2>Dropdown question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionTitle_dd">Question title:</label>
        <input
          type="text"
          name="questionTitle_dd"
          id="questionTitle_dd"
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
        onRemoveArtifact={removeArtifact}
      />


      {dropdowns.map((dropdown, dropdownIndex) => (
        <div key={dropdown.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`dropdownLabel_${dropdown.id}`}>
              Dropdown {dropdownIndex + 1}:
            </label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeDropdown(dropdown.id)}
              disabled={dropdowns.length <= 1}
            >
              <FaTrash /> Remove Dropdown
            </button>
          </div>

          <div className={commonStyles.itemGroup}>
            <label htmlFor={`ddLabel_${dropdown.id}`}>Dropdown label:</label>
            <input
              type="text"
              name={`ddLabel_${dropdown.id}`}
              id={`ddLabel_${dropdown.id}`}
              placeholder="Dropdown label (e.g., Select your country)"
              value={dropdown.label}
              onChange={(e) =>
                handleDropdownLabelChange(dropdown.id, e.target.value)
              }
            />

            <h4>Dropdown options:</h4>
            <div className={dropdownStyles.optionsContainer}>
              {dropdown.options.map((option, optionIndex) => (
                <div key={option.id} className={dropdownStyles.singleOptionBox}>
                  {" "}
                  {/* Use dropdownStyles if specific */}
                  <div className={commonStyles.itemHeader}>
                    <label htmlFor={`optionText_${option.id}`}>
                      Option {optionIndex + 1}:
                    </label>
                    <button
                      type="button"
                      className={commonStyles.removeBtn}
                      onClick={() => removeOption(dropdown.id, option.id)}
                      disabled={dropdown.options.length <= 2}
                    >
                      <FaTrash /> Remove Option
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      name={`optionText_${option.id}`}
                      id={`optionText_${option.id}`}
                      placeholder="Option name"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(
                          dropdown.id,
                          option.id,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={commonStyles.addItemBtn + " mt-2"}
              onClick={() => addOption(dropdown.id)}
            >
              <FaPlus /> Add dropdown option
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={commonStyles.addItemBtn + " mt-4"}
        onClick={addDropdown}
      >
        <FaPlus /> Add another dropdown
      </button>
    </div>
  );
}

const DropdownQuestionBuilder = React.memo(DropdownQuestionComponent);
export default DropdownQuestionBuilder;
