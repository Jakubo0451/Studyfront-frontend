"use client";
import { useEffect, useState } from "react";
import ratingStyles from "../../styles/questionTypes/ratingQ.module.css";
import commonStyles from "../../styles/questionTypes/common.module.css";
import Artifact from "./artifact";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function RatingScaleQuestionBuilder({ questionData, onChange, study }) {
  const [ratingScales, setRatingScales] = useState(
    questionData?.ratingScales || [
      { id: Date.now(), name: "", min: "", max: "" },
    ]
  );
  const [title, setTitle] = useState(questionData?.title || "");
  const [artifacts, setArtifacts] = useState(questionData?.artifacts || []);

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        ratingScales,
        artifacts
      });
    }
  }, [title, ratingScales, artifacts, onChange]);

  const addRatingScale = () => {
    const newId = Date.now();
    setRatingScales([
      ...ratingScales,
      { id: newId, name: "", min: "", max: "" },
    ]);
  };

  const removeRatingScale = (idToRemove) => {
    if (ratingScales.length <= 1) return;

    const filteredScales = ratingScales.filter(
      (scale) => scale.id !== idToRemove
    );
    setRatingScales(filteredScales);
  };

  const handleRatingScaleChange = (id, field, value) => {
    setRatingScales((prev) =>
      prev.map((scale) =>
        scale.id === id ? { ...scale, [field]: value } : scale
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

  // Add or update the removeArtifact function
  const removeArtifact = (artifactIdToRemove) => {
    // Remove the artifact from state
    const updatedArtifacts = artifacts.filter(artifact => artifact.id !== artifactIdToRemove);
    setArtifacts(updatedArtifacts);
    // The onChange callback will trigger automatically via useEffect
  };

  return (
    <div className={ratingStyles.ratingQ + " question-type"}>
      <h2>Rating Question</h2>
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


      {ratingScales.map((scale, index) => (
        <div key={scale.id} className={ratingStyles.ratingScale}>
          <div className={ratingStyles.ratingHeader}>
            <label htmlFor={`rating${scale.id}`}>
              Rating Factor {index + 1}:
            </label>
            <button
              type="button"
              className={ratingStyles.removeBtn}
              onClick={() => removeRatingScale(scale.id)}
              disabled={ratingScales.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          <div className={ratingStyles.ratingScaleInput}>
            <label htmlFor={`rf${scale.id}_name`}>Rating Name:</label>
            <input
              type="text"
              name={`rf${scale.id}_name`}
              id={`rf${scale.id}_name`}
              placeholder="Name"
              value={scale.name}
              onChange={(e) =>
                handleRatingScaleChange(scale.id, "name", e.target.value)
              }
            />
            <div>
              <label htmlFor={`rf${scale.id}_from`}>Range:</label>
              <div className={ratingStyles.rangeInputs}>
                <input
                  type="number"
                  name={`rf${scale.id}_from`}
                  id={`rf${scale.id}_from`}
                  placeholder="Min Value"
                  value={scale.min}
                  onChange={(e) =>
                    handleRatingScaleChange(scale.id, "min", e.target.value)
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  name={`rf${scale.id}_to`}
                  id={`rf${scale.id}_to`}
                  placeholder="Max Value"
                  value={scale.max}
                  onChange={(e) =>
                    handleRatingScaleChange(scale.id, "max", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className={ratingStyles.addRanking}
        onClick={addRatingScale}
      >
        <FaPlus /> Add another rating scale
      </button>
    </div>
  );
}
