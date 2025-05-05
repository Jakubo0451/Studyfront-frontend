'use client';
import React, { useState } from 'react';
import styles from '../../styles/questionTypes/artifact.module.css';
import { IoIosClose } from "react-icons/io";
import { MdOutlineNoteAdd } from "react-icons/md";

export default function Artifact({ artifactType, artifactSrc }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      // Initialize editable names with original file names
      setFileNames(files.map(file => file.name));
    };
  
    const handleNameChange = (index, newName) => {
      const updatedNames = [...fileNames];
      updatedNames[index] = newName;
      setFileNames(updatedNames);
    };

  const renderArtifact = () => {
    switch (artifactType) {
      case 'image':
        return (
            <div className={styles.imageContainer}>
                <img src={artifactSrc} alt="Artifact" />
            </div>
        );
      case 'video':
        return <video src={artifactSrc} controls />;
      case 'audio':
        return <audio src={artifactSrc} controls />;
      case 'text':
        return <pre>{artifactSrc}</pre>;
      case 'upload':
        return <div className={styles.uploadArtifact}><input type="file" className={styles.fileUpload} id="fileUpload" name="fileUpload" accept="image/apng, image/avif, image/gifs, image/jpeg, image/png, image/webp, video/mp4, audio/mp4, audio/mp3, audio/m4a, audio/mpeg, audio/ogg"></input></div>;
      case 'select':
        return <div className={styles.selectArtifact}>
            <div>
                <button onClick={openArtifactMenu}>Select artifact</button>
                <p>No artifact selected</p>
            </div>
            <input type="text" placeholder="Artifact name" />
        </div>
      default:
        return <p>Could not get Artifact</p>;
    }
  };

  function openArtifactMenu() {
    document.querySelector('#selectArtifactPopup').style.display = 'flex';
  }

  function closePopup() {
    document.querySelector('#selectArtifactPopup').style.display = 'none';
  }

  return <div className={styles.artifact}>
    <div className={styles.selectArtifactPopup} id="selectArtifactPopup">
        <div className="closePopupBackground" onClick={closePopup}></div>
        <div>
            <div className={styles.selectArtifactMenu}>
                <h2>Select artifact</h2>
                <div>
                    <div className={styles.uploadArtifact}>
                        <label htmlFor="fileUpload">Add new artifact(s):</label>
                        <input 
                            type="file" 
                            className={styles.fileUpload} 
                            id="fileUpload" 
                            name="fileUpload" 
                            accept="image/apng, image/avif, image/gifs, image/jpeg, image/png, image/webp, video/mp4, audio/mp4, audio/mp3, audio/m4a, audio/mpeg, audio/ogg" 
                            multiple 
                            onChange={handleFileChange}
                        />
                        {selectedFiles.length > 0 && (
                        <div className={styles.fileList}>
                            <h3>Change artifact name(s):</h3>
                            {selectedFiles.map((file, index) => (
                            <div key={index} className={styles.fileItem}>
                                <input 
                                  type="text" 
                                  value={fileNames[index]} 
                                  onChange={(e) => handleNameChange(index, e.target.value)}
                                />
                            </div>
                            ))}
                            <button><MdOutlineNoteAdd /> Add selected artifacts</button>
                        </div>
                        )}
                        
                    </div>
                </div>
            </div>
            <div onClick={closePopup}>
                <button type="button" className="closeBtn" title="Close menu" onClick={closePopup}><IoIosClose /></button>
            </div>
        </div>
    </div>
    {renderArtifact()}
    </div>;
}