"use client";
import { useState, useEffect } from "react"; // Added useEffect
import commonStyles from "../../styles/questionTypes/common.module.css";
import Artifact from "./artifact";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function MatrixQuestionBuilder({ questionData, onChange, study }) {
  // Renamed and added props
  const [title, setTitle] = useState(questionData?.title || "");
  const [matrixGroups, setMatrixGroups] = useState(
    questionData?.matrixGroups?.map((group, gIndex) => ({
      ...group,
      id: group.id || `${Date.now()}-mg-${gIndex}`, // Ensure group ID
      horizontalItems: group.horizontalItems?.map((hItem, hIndex) => ({
        ...hItem,
        id: hItem.id || `${Date.now()}-mgh-${gIndex}-${hIndex}`, // Ensure horizontal item ID
      })) || [{ id: `${Date.now()}-mgh-${gIndex}-0`, text: "" }],
      verticalItems: group.verticalItems?.map((vItem, vIndex) => ({
        ...vItem,
        id: vItem.id || `${Date.now()}-mgv-${gIndex}-${vIndex}`, // Ensure vertical item ID
      })) || [{ id: `${Date.now()}-mgv-${gIndex}-0`, text: "" }],
    })) || [
      {
        id: `${Date.now()}-mg-0`,
        label: "",
        horizontalItems: [
          { id: `${Date.now()}-mgh-0-0`, text: "" },
          { id: `${Date.now()}-mgh-0-1`, text: "" },
        ],
        verticalItems: [
          { id: `${Date.now()}-mgv-0-0`, text: "" },
          { id: `${Date.now()}-mgv-0-1`, text: "" },
        ],
      },
    ]
  );

  const [artifacts, setArtifacts] = useState(questionData?.artifacts || []);

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        matrixGroups,
        artifacts // Include artifacts in data sent back
      });
    }
  }, [title, matrixGroups, artifacts, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addMatrixGroup = () => {
    const newGroupId = `${Date.now()}-mg-${matrixGroups.length}`;
    setMatrixGroups([
      ...matrixGroups,
      {
        id: newGroupId,
        label: "",
        horizontalItems: [
          { id: `${Date.now()}-mgh-${matrixGroups.length}-0`, text: "" },
          { id: `${Date.now()}-mgh-${matrixGroups.length}-1`, text: "" },
        ],
        verticalItems: [
          { id: `${Date.now()}-mgv-${matrixGroups.length}-0`, text: "" },
          { id: `${Date.now()}-mgv-${matrixGroups.length}-1`, text: "" },
        ],
      },
    ]);
  };

  const removeMatrixGroup = (groupId) => {
    if (matrixGroups.length <= 1) return;
    setMatrixGroups(matrixGroups.filter((group) => group.id !== groupId));
  };

  const handleMatrixGroupLabelChange = (groupId, value) => {
    setMatrixGroups(
      matrixGroups.map((group) =>
        group.id === groupId ? { ...group, label: value } : group
      )
    );
  };

  const addHorizontalItem = (groupId) => {
    setMatrixGroups(
      matrixGroups.map((group) => {
        if (group.id === groupId) {
          const newItemId = `${Date.now()}-mgh-${group.id}-${
            group.horizontalItems.length
          }`;
          return {
            ...group,
            horizontalItems: [
              ...group.horizontalItems,
              { id: newItemId, text: "" },
            ],
          };
        }
        return group;
      })
    );
  };

  const addVerticalItem = (groupId) => {
    setMatrixGroups(
      matrixGroups.map((group) => {
        if (group.id === groupId) {
          const newItemId = `${Date.now()}-mgv-${group.id}-${
            group.verticalItems.length
          }`;
          return {
            ...group,
            verticalItems: [
              ...group.verticalItems,
              { id: newItemId, text: "" },
            ],
          };
        }
        return group;
      })
    );
  };

  const removeHorizontalItem = (groupId, itemId) => {
    setMatrixGroups(
      matrixGroups.map((group) => {
        if (group.id === groupId) {
          if (group.horizontalItems.length <= 1) return group; // Keep at least 1 item
          return {
            ...group,
            horizontalItems: group.horizontalItems.filter(
              (item) => item.id !== itemId
            ),
          };
        }
        return group;
      })
    );
  };

  const removeVerticalItem = (groupId, itemId) => {
    setMatrixGroups(
      matrixGroups.map((group) => {
        if (group.id === groupId) {
          if (group.verticalItems.length <= 1) return group; // Keep at least 1 item
          return {
            ...group,
            verticalItems: group.verticalItems.filter(
              (item) => item.id !== itemId
            ),
          };
        }
        return group;
      })
    );
  };

  const handleHorizontalItemChange = (groupId, itemId, value) => {
    setMatrixGroups(
      matrixGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            horizontalItems: group.horizontalItems.map((item) =>
              item.id === itemId ? { ...item, text: value } : item
            ),
          };
        }
        return group;
      })
    );
  };

  const handleVerticalItemChange = (groupId, itemId, value) => {
    setMatrixGroups(
      matrixGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            verticalItems: group.verticalItems.map((item) =>
              item.id === itemId ? { ...item, text: value } : item
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

  const removeArtifact = (artifactIdToRemove) => {
    const updatedArtifacts = artifacts.filter(artifact => artifact.id !== artifactIdToRemove);
    setArtifacts(updatedArtifacts);
    // The onChange callback will trigger automatically via useEffect
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Matrix question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionTitle_matrix">Question title:</label>
        <input
          type="text"
          name="questionTitle_matrix"
          id="questionTitle_matrix"
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


      <p className={commonStyles.infoBox}>
        <IoIosInformationCircleOutline /> A matrix question creates a grid where
        participants select answers at the intersection of rows and columns.
      </p>

      {matrixGroups.map((group, groupIndex) => (
        <div key={group.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`matrixGroupLabel_${group.id}`}>
              Matrix Group {groupIndex + 1}:
            </label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeMatrixGroup(group.id)}
              disabled={matrixGroups.length <= 1}
            >
              <FaTrash /> Remove Group
            </button>
          </div>

          <div className={commonStyles.itemGroup}>
            <label htmlFor={`mgLabel_${group.id}`}>Matrix group label:</label>
            <input
              type="text"
              name={`mgLabel_${group.id}`}
              id={`mgLabel_${group.id}`}
              placeholder="Please rate the following..."
              value={group.label}
              onChange={(e) =>
                handleMatrixGroupLabelChange(group.id, e.target.value)
              }
            />

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
              {/* Vertical Items (Row Headers) */}
              <div className="flex-1">
                <h4>Row Headers (Statements/Items to rate):</h4>
                <div className={commonStyles.optionsContainer}>
                  {group.verticalItems.map((item, itemIndex) => (
                    <div key={item.id} className={commonStyles.singleOptionBox}>
                      <div className={commonStyles.itemHeader}>
                        <label htmlFor={`vItemText_${item.id}`}>
                          Row {itemIndex + 1}:
                        </label>
                        <button
                          type="button"
                          className={commonStyles.removeBtn}
                          onClick={() => removeVerticalItem(group.id, item.id)}
                          disabled={group.verticalItems.length <= 1}
                        >
                          <FaTrash /> Remove Row
                        </button>
                      </div>
                      <div>
                        <input
                          type="text"
                          name={`vItemText_${item.id}`}
                          id={`vItemText_${item.id}`}
                          placeholder="e.g., Product quality"
                          value={item.text}
                          onChange={(e) =>
                            handleVerticalItemChange(
                              group.id,
                              item.id,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={commonStyles.addItemBtn + " mt-2"}
                    onClick={() => addVerticalItem(group.id)}
                  >
                    <FaPlus /> Add row
                  </button>
                </div>
              </div>

              {/* Horizontal Items (Column Headers - Scale Points) */}
              <div className="flex-1">
                <h4>Column Headers (Scale Points):</h4>
                <div className={commonStyles.optionsContainer}>
                  {group.horizontalItems.map((item, itemIndex) => (
                    <div key={item.id} className={commonStyles.singleOptionBox}>
                      <div className={commonStyles.itemHeader}>
                        <label htmlFor={`hItemText_${item.id}`}>
                          Column {itemIndex + 1}:
                        </label>
                        <button
                          type="button"
                          className={commonStyles.removeBtn}
                          onClick={() =>
                            removeHorizontalItem(group.id, item.id)
                          }
                          disabled={group.horizontalItems.length <= 1}
                        >
                          <FaTrash /> Remove Column
                        </button>
                      </div>
                      <div>
                        <input
                          type="text"
                          name={`hItemText_${item.id}`}
                          id={`hItemText_${item.id}`}
                          placeholder="e.g., Agree"
                          value={item.text}
                          onChange={(e) =>
                            handleHorizontalItemChange(
                              group.id,
                              item.id,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={commonStyles.addItemBtn + " mt-2"}
                    onClick={() => addHorizontalItem(group.id)}
                  >
                    <FaPlus /> Add column
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={commonStyles.addItemBtn + " mt-4"}
        onClick={addMatrixGroup}
      >
        <FaPlus /> Add another matrix group
      </button>
    </div>
  );
}
