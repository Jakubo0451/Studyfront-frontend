'use client'
import React from 'react'
import styles from '../../styles/questionTypes/ratingQ.module.css'
import Artifact from './artifact'
import { FaPlus } from "react-icons/fa";

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
        <h2>Rating question</h2>
        <div className={styles.questionName}>
          <label htmlFor="questionName">Qustion title:</label>
          <input type="text" name="questionName" id="questionName" placeholder="Title" />
        </div>
        <div id="artifacts">
          <Artifact artifactType="upload" />
        </div>
        {/* <Artifact artifactType="text" artifactSrc="This is a text Artifact!" />
        <Artifact artifactType="image" artifactSrc="https://picsum.photos/300/200" />
        <Artifact artifactType="video" artifactSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
        <Artifact artifactType="audio" artifactSrc="https://www.w3schools.com/html/horse.mp3" /> */}
        <button className={styles.addRanking}><FaPlus /> New artifact</button>
        <div className={styles.ratingScale}>
            <label htmlFor="rating1">Rating factor 1:</label>
            <div className={styles.ratingScaleInput}>
              <label htmlFor="rf1_name">Rating name:</label>
              <input type="text" name="rf1_name" id="rf1_name" placeholder="Name" />
              <div>
                <label htmlFor="rf1_from">Range:</label>
                <div className={styles.rangeInputs}>
                  <input type="number" name="rf1_from" id="rf1_from" placeholder="Min Value" />
                  <span>to</span>
                  <input type="number" name="rf1_to" id="rf1_to" placeholder="Max Value" />
                </div>
              </div>
            </div>
            {/* <div className={styles.ratingScaleRange}>
              <input type="range" id="rating1" name="rating1" min="1" max="5" step="1" />
              <span className={styles.ratingValue}>3</span>
            </div> */}
        </div>
        <button className={styles.addRanking}><FaPlus /> New ranking</button>
    </div>
  )
};