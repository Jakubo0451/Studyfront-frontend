'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/questionTypes/artifact.module.css';
import { IoIosClose } from "react-icons/io";
import { MdOutlineNoteAdd } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";

// Single artifact component with its own isolated state
const SingleArtifact = ({ artifactId, onArtifactSelect }) => {
  const [selectedArtifactName, setSelectedArtifactName] = useState("No artifact selected");
  const [selectedArtifactId, setSelectedArtifactId] = useState(artifactId || null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);
  const popupRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (artifactId) {
      setSelectedArtifactName(`Artifact ${artifactId}`);
      setSelectedArtifactId(artifactId);
    }
    
    return () => {
      filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [artifactId, filePreviewUrls]);
  
  const openArtifactMenu = () => {
    if (popupRef.current) {
      popupRef.current.style.display = 'flex';
    }
  };
  
  const closePopup = () => {
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };
  
  const selectArtifact = (artifactId, artifactName) => {
    return () => {
      setSelectedArtifactName(artifactName);
      setSelectedArtifactId(artifactId);
      
      // Call the callback if provided
      if (onArtifactSelect) {
        onArtifactSelect(artifactId, artifactName);
      }
      
      closePopup();
    };
  };
  
  const clearFiles = () => {
    filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setFileNames([]);
    setFilePreviewUrls([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }; 
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    const previewUrls = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    
    setFilePreviewUrls(previewUrls);
    setFileNames(files.map(file => file.name));
  };

  const handleNameChange = (index, newName) => {
    const updatedNames = [...fileNames];
    updatedNames[index] = newName;
    setFileNames(updatedNames);
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
                accept="image/apng, image/avif, image/gifs, image/jpeg, image/png, image/webp, video/mp4, audio/mp4, audio/mp3, audio/m4a, audio/mpeg, audio/ogg" 
                multiple 
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {selectedFiles.length > 0 && (
                <div className={styles.fileList}>
                  <button onClick={clearFiles} className={styles.clearFiles}><IoIosClose /> Clear files</button>
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
                          {file.type.split('/')[0]}
                        </div>
                      )}
                      <input 
                        type="text" 
                        value={fileNames[index]} 
                        onChange={(e) => handleNameChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button className={styles.uploadArtifactsBtn}><MdOutlineNoteAdd /> Upload selected artifacts</button>
                </div>
              )}
              <label>Already uploaded artifact(s):</label>
              <div className={styles.artifactsList}>
                <p><IoIosInformationCircleOutline /> Select <span> one </span> artifact</p>
                <div className={styles.artifactItems}>
                  <div className={styles.artifactItem} onClick={selectArtifact(1, "Artifact 1")} title="Artifact 1">
                    <img src="https://picsum.photos/100/200" alt="Artifact" />
                    <p>Artifact 1</p>
                  </div>
                  <div className={styles.artifactItem} onClick={selectArtifact(2, "Artifact 2")} title="Artifact 2">
                    <img src="https://picsum.photos/200/200" alt="Artifact" />
                    <p>Artifact 2</p>
                  </div>
                  <div className={styles.artifactItem} onClick={selectArtifact(3, "Artifact 3 has a really long name apparently")} title="Artifact 3 has a really long name apparently">
                    <img src="https://picsum.photos/200/300" alt="Artifact" />
                    <p>Artifact 3 has a really long name apparently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={closePopup}>
          <button type="button" className="closeBtn" title="Close menu" onClick={closePopup}><IoIosClose /></button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={styles.artifact}>
      <div className={styles.selectArtifact}>
        <div>
          <button onClick={openArtifactMenu}>Select artifact</button>
          <p>{selectedArtifactName}</p>
        </div>
        <input type="text" placeholder="Artifact name" />
      </div>
      {renderPopup()}
    </div>
  );
};

// Main Artifact component
export default function Artifact({ 
  initialArtifactId,
  onArtifactSelect,
  allowMultiple = false,
  mode = 'normal'
}) {
  // For standalone mode only
  const [artifacts, setArtifacts] = useState(mode === 'standalone' ? [{ id: 1 }] : []);

  // Functions for standalone mode
  const addArtifact = () => {
    const newId = artifacts.length > 0 ? Math.max(...artifacts.map(a => a.id)) + 1 : 1;
    setArtifacts([...artifacts, { id: newId }]);
  };
  
  const removeArtifact = (idToRemove) => {
    setArtifacts(artifacts.filter(artifact => artifact.id !== idToRemove));
  };

  // Render different based on mode
  if (mode === 'standalone') {
    return (
      <div className={styles.artifactsContainer}>
        <div className={styles.artifacts}>
          {artifacts.map(artifact => (
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
              {/* Each artifact has its own independent component instance */}
              <SingleArtifact 
                artifactId={initialArtifactId} 
                onArtifactSelect={onArtifactSelect}
              />
            </div>
          ))}
        </div>
        <button 
          className={styles.addArtifactBtn} 
          onClick={addArtifact}
        >
          <FaPlus /> {artifacts.length === 0 ? "Add artifact" : "Add another artifact"}
        </button>
      </div>
    );
  }
  
  // Normal mode - just a single artifact selector
  return (
    <SingleArtifact 
      artifactId={initialArtifactId} 
      onArtifactSelect={onArtifactSelect}
    />
  );
}