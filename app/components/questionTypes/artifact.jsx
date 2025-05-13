/* eslint-disable */

"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/questionTypes/artifact.module.css";
import { IoIosClose } from "react-icons/io";
import { MdOutlineNoteAdd } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";
import backendUrl from "environment";

// Single artifact component with its own isolated state
const SingleArtifact = ({
  studyId,
  artifactId,
  initialName,
  initialImage,
  initialTitle = "", // Add prop for initial title
  onArtifactSelect,
  onTitleChange, // Add callback for title changes
}) => {
  const [selectedArtifactName, setSelectedArtifactName] = useState(
    initialName || "No artifact selected"
  );
  const [selectedArtifactId, setSelectedArtifactId] = useState(
    artifactId || null
  );
  const [selectedArtifactImage, setSelectedArtifactImage] = useState(
    initialImage || null
  );
  const [artifactTitle, setArtifactTitle] = useState(initialTitle); // Initialize with prop
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);
  const [artifactsList, setArtifactsList] = useState([]);
  const popupRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchArtifacts = async () => {
      if (!studyId) {
        console.error("studyId is not defined.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view artifacts.");
        return;
      }

      try {
        const response = await fetch(
          `${backendUrl}/api/studies/${studyId}/files`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch artifacts");
        }

        const artifacts = await response.json();

        const artifactsWithUrls = artifacts.map(artifact => {
          let imageUrl = `${backendUrl}/api/upload/${artifact._id}`;

          if (artifact.contentType && artifact.contentType.startsWith("audio/")) {
            imageUrl = "/audio.png";
          }
          else if (artifact.contentType && artifact.contentType.startsWith("video/")) {
            imageUrl = "/video.png";
          }
          else if (artifact.contentType === "application/pdf") {
            imageUrl = "/pdf.png";
          }

          return {
            ...artifact,
            id: artifact._id,
            imageUrl: imageUrl
          };
        });

        setArtifactsList(artifactsWithUrls);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      }
    };

    fetchArtifacts();
  }, [studyId]);

  useEffect(() => {
    // Set name regardless of value (will use default if null)
    setSelectedArtifactName(initialName || "No artifact selected");

    // Set ID regardless of value
    setSelectedArtifactId(artifactId || null);

    // Always update the image, even when it's null
    // This ensures the image is cleared when no artifact is selected
    setSelectedArtifactImage(initialImage || null);
  }, [artifactId, initialName, initialImage]);

  // This effect is causing the problem - removing it
  useEffect(() => {
    // Only clean up URLs, don't override the artifact name
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  const openArtifactMenu = () => {
    if (popupRef.current) {
      popupRef.current.style.display = "flex";
    }
  };

  const closePopup = () => {
    if (popupRef.current) {
      popupRef.current.style.display = "none";
    }
  };

  const selectArtifact = (artifactId, artifactName, artifactImage, contentType) => {
    return () => {
      setSelectedArtifactName(artifactName);
      setSelectedArtifactId(artifactId);

      let displayImage = artifactImage;
      if (contentType && contentType.startsWith("audio/")) {
        displayImage = "/audio.png";
      }
      else if (contentType && contentType.startsWith("video/")) {
        displayImage = "/video.png";
      }
      else if (contentType === "application/pdf") {
        displayImage = "/pdf.png";
      }

      setSelectedArtifactImage(displayImage);

      // Call the callback if provided
      if (onArtifactSelect) {
        onArtifactSelect(artifactId, artifactName, artifactImage);
      }

      closePopup();
    };
  };

  const clearFiles = () => {
    filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setFileNames([]);
    setFilePreviewUrls([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadArtifacts = async () => {
    if (!selectedFiles.length) return;

    setIsUploading(true);
    const successfulUploads = [];
    const failedUploads = [];

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "displayName",
          fileNames[selectedFiles.indexOf(file)] || file.name
        );
        formData.append("studyId", studyId);

        const contentType = file.type;

        try {
          const response = await fetch(
            `${backendUrl}/api/studies/${studyId}/files`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to upload file: ${file.name}`);
          }

          const data = await response.json();

          let displayUrl;
          if (contentType.startsWith("audio/")) {
            displayUrl = "/audio.png";
          } else if (contentType.startsWith("video/")) {
            displayUrl = "/video.png";
          } else if (contentType === "application/pdf") {
            displayUrl = "/pdf.png";
          } else {
            displayUrl = `${backendUrl}/api/upload/${data.file._id}`;
          }

          successfulUploads.push({
            id: data.file._id,
            displayName: data.file.displayName,
            imageUrl: displayUrl,
            contentType: contentType
          });
        } catch (error) {
          console.error("Error uploading file:", error);
          failedUploads.push(file.name);
        }
      }

      // Add successfully uploaded files to the artifacts list
      if (successfulUploads.length > 0) {
        setArtifactsList((prev) => [...prev, ...successfulUploads]);
      }

      // Clear the file selection
      clearFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previewUrls = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      else if (file.type.startsWith("audio/")) {
        return "/audio.png";
      }
      else if (file.type.startsWith("video/")) {
        return "/video.png";
      }
      else if (file.type === "application/pdf") {
        return "/pdf.png";
      }
      return "";
    });

    setFilePreviewUrls(previewUrls);
    setFileNames(files.map((file) => file.name));
  };

  const handleNameChange = (index, newName) => {
    const updatedNames = [...fileNames];
    updatedNames[index] = newName;
    setFileNames(updatedNames);
  };

  useEffect(() => {
    setArtifactTitle(initialTitle);
  }, [initialTitle]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setArtifactTitle(newTitle);

    // Call the callback to update parent state
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  // Render popup for this specific artifact
  const renderPopup = () => (
    <div className={styles.selectArtifactPopup} ref={popupRef}>
      <div className="closePopupBackground" onClick={closePopup}></div>
      <div>
        <div className={styles.selectArtifactMenu}>
          <h2>Select artifact</h2>
          <div>
            <div className={styles.uploadArtifact}>
              <label>Upload new artifact(s):</label>
              <input
                type="file"
                className={styles.fileUpload}
                accept="image/apng, image/avif, image/gifs, image/jpeg, image/png, image/webp, video/mp4, audio/mp4, audio/mp3, audio/m4a, audio/mpeg, audio/ogg, audio/ogv, application/pdf"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {selectedFiles.length > 0 && (
                <div className={styles.fileList}>
                  <button onClick={clearFiles} className={styles.clearFiles}>
                    <IoIosClose /> Clear files
                  </button>
                  <h3>Change artifact name(s):</h3>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      {filePreviewUrls[index] ? (
                        <img
                          src={filePreviewUrls[index]}
                          alt={`Preview of ${fileNames[index]}`}
                          className={styles.filePreview}
                        />
                      ) : (
                        <div className={styles.noPreview}>
                          {file.type.split("/")[0]}
                        </div>
                      )}
                      <input
                        type="text"
                        value={fileNames[index]}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    className={styles.uploadArtifactsBtn}
                    onClick={handleUploadArtifacts}
                  >
                    <MdOutlineNoteAdd /> Upload selected artifacts
                  </button>
                </div>
              )}
              <label>Already uploaded artifact(s):</label>
              <div className={styles.artifactsList}>
                <p>
                  <IoIosInformationCircleOutline /> Select <span> one </span>{" "}
                  artifact
                </p>
                <div className={styles.artifactItems}>
                  {artifactsList.map((artifact) => (
                    <div
                      key={artifact.id}
                      className={styles.artifactItem}
                      onClick={selectArtifact(
                        artifact.id,
                        artifact.displayName,
                        artifact.imageUrl,
                        artifact.contentType
                      )}
                      title={artifact.displayName}
                    >
                      <img src={artifact.imageUrl} alt={artifact.displayName} />
                      <p>{artifact.displayName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={closePopup}>
          <button
            type="button"
            className="closeBtn"
            title="Close menu"
            onClick={closePopup}
          >
            <IoIosClose />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.artifact}>
      <div className={styles.selectArtifact}>
        {selectedArtifactImage ? (
          <img
            src={selectedArtifactImage}
            alt={selectedArtifactName}
            className={styles.artifactPreview}
          />
        ) : null}
        <div>
          <div>
            <button onClick={openArtifactMenu}>Select artifact</button>
            <p>{selectedArtifactName}</p>
          </div>
          <input
            type="text"
            placeholder="Artifact label"
            className={styles.artifactTitleInput}
            value={artifactTitle}
            onChange={handleTitleChange}
          />
        </div>
      </div>
      {renderPopup()}
    </div>
  );
};

// Main Artifact component
export default function Artifact({
  studyId,
  initialArtifactId,
  onArtifactSelect,
  allowMultiple = false,
  mode = "normal",
}) {
  // For standalone mode only - track both id and selected artifact info
  const [artifacts, setArtifacts] = useState(
    mode === "standalone"
      ? [
          {
            id: 1,
            selectedArtifactId: null,
            selectedArtifactName: "No artifact selected",
            selectedArtifactImage: null,
            artifactTitle: "", // Add title to the state
          },
        ]
      : []
  );

  // Functions for standalone mode
  const addArtifact = () => {
    const newId =
      artifacts.length > 0 ? Math.max(...artifacts.map((a) => a.id)) + 1 : 1;
    setArtifacts([
      ...artifacts,
      {
        id: newId,
        selectedArtifactId: null,
        selectedArtifactName: "No artifact selected",
        selectedArtifactImage: null,
        artifactTitle: "", // Initialize title
      },
    ]);
  };

  const removeArtifact = (idToRemove) => {
    // Remove the artifact with the specified ID
    const filteredArtifacts = artifacts.filter(
      (artifact) => artifact.id !== idToRemove
    );

    // If we end up with no artifacts and allowMultiple is false, don't remove the last one
    if (filteredArtifacts.length === 0 && !allowMultiple) {
      return;
    }

    // Renumber the remaining artifacts sequentially but keep their selection data
    const renumberedArtifacts = filteredArtifacts.map((artifact, index) => ({
      ...artifact, // Keep all existing properties (including selectedArtifactName)
      id: index + 1,
    }));

    setArtifacts(renumberedArtifacts);
  };

  // Update the title for a specific artifact
  const handleTitleChange = (artifactPositionId, newTitle) => {
    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === artifactPositionId
          ? { ...artifact, artifactTitle: newTitle }
          : artifact
      )
    );
  };

  // Update the selected artifact for a specific position
  const handleArtifactSelection = (
    artifactPositionId,
    artifactId,
    artifactName,
    artifactImage
  ) => {
    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === artifactPositionId
          ? {
              ...artifact,
              selectedArtifactId: artifactId,
              selectedArtifactName: artifactName,
              selectedArtifactImage: artifactImage,
            }
          : artifact
      )
    );

    // Call the parent callback if provided
    if (onArtifactSelect) {
      onArtifactSelect(artifactId, artifactName, artifactImage); // Pass image data to parent callback
    }
  };

  // Render different based on mode
  if (mode === "standalone") {
    return (
      <div className={styles.artifactsContainer}>
        <div className={styles.artifacts}>
          {artifacts.map((artifact) => (
            <div key={artifact.id} className={styles.artifactContainer}>
              <div className={styles.artifactHeader}>
                <label>Artifact {artifact.id}:</label>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeArtifact(artifact.id)}
                  disabled={artifacts.length <= 1 && !allowMultiple}
                >
                  <FaTrash /> Remove
                </button>
              </div>
              {/* Pass the selected artifact data and title to each instance */}
              <SingleArtifact
                studyId={studyId}
                artifactId={artifact.selectedArtifactId}
                initialName={artifact.selectedArtifactName}
                initialImage={artifact.selectedArtifactImage}
                initialTitle={artifact.artifactTitle} // Pass the title
                onArtifactSelect={(id, name, image) =>
                  handleArtifactSelection(artifact.id, id, name, image)
                }
                onTitleChange={(newTitle) =>
                  handleTitleChange(artifact.id, newTitle)
                } // Pass title change handler
              />
            </div>
          ))}
        </div>
        <button className={styles.addArtifactBtn} onClick={addArtifact}>
          <FaPlus />{" "}
          {artifacts.length === 0 ? "Add artifact" : "Add another artifact"}
        </button>
      </div>
    );
  }

  // Normal mode - just a single artifact selector
  return (
    <SingleArtifact
      studyId={studyId}
      artifactId={artifact.selectedArtifactId}
      initialName={artifact.selectedArtifactName}
      initialImage={artifact.selectedArtifactImage}
      initialTitle={artifact.artifactTitle}
      onArtifactSelect={(id, name, image) =>
        handleArtifactSelection(artifact.id, id, name, image)
      }
    />
  );
}
