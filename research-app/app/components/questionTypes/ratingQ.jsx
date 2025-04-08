'use client'
import React from 'react'
import styles from '../../styles/questionTypes/ratingQ.module.css'
import Artifact from './artifact'

export default function ratingQ() {
  document.addEventListener('input', function (e) {
    if (e.target.matches('input[type="range"]')) {
        const value = e.target.value;
        const ratingValue = e.target.nextElementSibling;
        ratingValue.textContent = value;
    }
  });

  return (
    <div className={styles.ratingQ + " question-type"}>
        <h2>Rate this artifact</h2>
        <Artifact artifactType="upload" />
        {/* <Artifact artifactType="text" artifactSrc="This is a text Artifact!" />
        <Artifact artifactType="image" artifactSrc="https://picsum.photos/300/200" />
        <Artifact artifactType="video" artifactSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
        <Artifact artifactType="audio" artifactSrc="https://www.w3schools.com/html/horse.mp3" /> */}
        <div className={styles.ratingScale}>
            <label htmlFor="rating1">Rating factor 1:</label>
            <div>
              <input type="range" id="rating1" name="rating1" min="1" max="5" step="1" />
              <span className={styles.ratingValue}>3</span>
            </div>
        </div>
        <div className={styles.ratingScale}>
            <label htmlFor="rating2">Rating factor 2:</label>
            <div>
              <input type="range" id="rating2" name="rating2" min="1" max="5" step="1" />
              <span className={styles.ratingValue}>3</span>
            </div>
        </div>
        <div className={styles.ratingScale}>
            <label htmlFor="rating3">Rating factor 3:</label>
            <div>
              <input type="range" id="rating3" name="rating3" min="1" max="5" step="1" />
              <span className={styles.ratingValue}>3</span>
            </div>
        </div>
    </div>
  )
};