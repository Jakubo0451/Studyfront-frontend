'use client';
import React from 'react';
import styles from '../../styles/questionTypes/artifact.module.css';

export default function Artifact({ artifactType, artifactSrc }) {
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
        return <div className={styles.uploadArtifact}><label for="fileUpload">Upload artifact:</label><input type="file" className={styles.fileUpload} id="fileUpload" name="fileUpload" accept="image/apng, image/avif, image/gifs, image/jpeg, image/png, image/webp, video/mp4, audio/mp4, audio/mp3, audio/m4a, audio/mpeg, audio/ogg"></input></div>;
      default:
        return <p>Could not get Artifact</p>;
    }
  };

  return <div className={styles.artifact}>{renderArtifact()}</div>;
}