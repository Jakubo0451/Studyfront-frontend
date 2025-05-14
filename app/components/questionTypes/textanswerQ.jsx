"use client";
import { useState, useEffect } from "react";
import commonStyles from "../../styles/questionTypes/common.module.css";
import Artifact from "./artifact";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function TextanswerQuestionBuilder({ questionData, onChange, study }) {
  const [title, setTitle] = useState(questionData?.title || "");
  const [textAreas, setTextAreas] = useState(
    questionData?.textAreas?.map((area, index) => ({
      ...area,
      id: area.id || `${Date.now()}-ta-${index}`,
    })) || [{ id: `${Date.now()}-ta-0`, label: "" }]
  );
  // Initialize artifacts from questionData
  const [artifacts, setArtifacts] = useState(questionData?.artifacts || []);

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        textAreas,
        artifacts // Include artifacts in the data sent back
      });
    }
  }, [title, textAreas, artifacts, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addTextArea = () => {
    const newId = `${Date.now()}-ta-${textAreas.length}`;
    setTextAreas([...textAreas, { id: newId, label: "" }]);
  };

  const removeTextArea = (idToRemove) => {
    if (textAreas.length <= 1) return;
    setTextAreas(textAreas.filter((area) => area.id !== idToRemove));
  };

  const handleTextAreaLabelChange = (id, value) => {
    setTextAreas(
      textAreas.map((area) =>
        area.id === id ? { ...area, label: value } : area
      )
    );
  };

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
  
  // Update the removeArtifact function
  const removeArtifact = (artifactIdToRemove) => {
    // Remove the artifact from state
    const updatedArtifacts = artifacts.filter(artifact => artifact.id !== artifactIdToRemove);
    setArtifacts(updatedArtifacts);
    // The onChange callback will trigger automatically via useEffect when artifacts state changes
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

      <Artifact
        mode="standalone"
        allowMultiple={true}
        studyId={study?._id}
        initialArtifactId={null}
        initialArtifacts={artifacts} // Add this line to pass saved artifacts
        onArtifactSelect={handleArtifactSelect}
        onLabelChange={updateArtifactLabel} // Add this new callback
        onRemoveArtifact={removeArtifact} // Add this line
      />

      {textAreas.map((textArea, index) => (
        <div key={textArea.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`textAreaLabel_${textArea.id}`}>
              Text Area {index + 1}:
            </label>
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
            <label htmlFor={`textAreaInput_${textArea.id}`}>
              Text area label (optional, prompt for user):
            </label>
            <input
              type="text"
              name={`textAreaInput_${textArea.id}`}
              id={`textAreaInput_${textArea.id}`}
              placeholder="e.g., Please describe your experience..."
              value={textArea.label}
              onChange={(e) =>
                handleTextAreaLabelChange(textArea.id, e.target.value)
              }
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className={commonStyles.addItemBtn}
        onClick={addTextArea}
      >
        <FaPlus /> Add another text area
      </button>
    </div>
  );
}
