'use client'
import { useEffect } from 'react'
import styles from '../../styles/questionTypes/ratingQ.module.css'
import Artifact from './artifact'
import { FaPlus } from "react-icons/fa";

export default function ratingQ() {
  useEffect(() => {
    document.addEventListener('input', function (e) {
      if (e.target.matches('input[type="range"]')) {
          const value = e.target.value;
          const ratingValue = e.target.nextElementSibling;
          ratingValue.textContent = value;
      }
    });

    return () => {
      document.removeEventListener('input', function() {});
    };
  }, []);

  return (
    <div className={styles.ratingQ + " question-type"}>
        <h2>Rating question</h2>
        <div className={styles.questionName}>
          <label htmlFor="questionName">Qustion title:</label>
          <input type="text" name="questionName" id="questionName" placeholder="Title" />
        </div>
        
        {/* Use the Artifact component in standalone mode */}
        <Artifact mode="standalone" allowMultiple={true} />
        
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
        </div>
        <button className={styles.addRanking}><FaPlus /> Add another rating scale</button>
    </div>
  )
};