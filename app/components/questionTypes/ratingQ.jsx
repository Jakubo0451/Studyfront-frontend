'use client';
import { useEffect, useState, useCallback } from 'react';
import styles from '../../styles/questionTypes/ratingQ.module.css';
import Artifact from './artifact';
import { FaPlus, FaTrash } from "react-icons/fa";

export default function RatingScaleQuestionBuilder({ questionData, onChange }) {
  const [ratingScales, setRatingScales] = useState(
    questionData?.ratingScales || [{ id: Date.now(), name: '', min: '', max: '' }]
  );
  const [title, setTitle] = useState(questionData?.title || '');

  useEffect(() => {
    onChange({
      title,
      ratingScales,
    });
  }, [title, ratingScales]);

  // Function to add a new rating scale
  const addRatingScale = () => {
    const newId = Date.now();
    setRatingScales([...ratingScales, { id: newId, name: '', min: '', max: '' }]);
  };

  // Function to remove a rating scale
  const removeRatingScale = (idToRemove) => {
    if (ratingScales.length <= 1) return;

    const filteredScales = ratingScales.filter((scale) => scale.id !== idToRemove);
    setRatingScales(filteredScales);
  };

  // Function to handle input changes
  const handleRatingScaleChange = (id, field, value) => {
    setRatingScales((prev) =>
      prev.map((scale) => (scale.id === id ? { ...scale, [field]: value } : scale))
    );
  };

  return (
    <div className={styles.ratingQ + ' question-type'}>
      <h2>Rating Question</h2>
      <div className={styles.questionName}>
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

      <Artifact mode="standalone" allowMultiple={true} />

      {ratingScales.map((scale, index) => (
        <div key={scale.id} className={styles.ratingScale}>
          <div className={styles.ratingHeader}>
            <label htmlFor={`rating${scale.id}`}>Rating Factor {index + 1}:</label>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeRatingScale(scale.id)}
              disabled={ratingScales.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          <div className={styles.ratingScaleInput}>
            <label htmlFor={`rf${scale.id}_name`}>Rating Name:</label>
            <input
              type="text"
              name={`rf${scale.id}_name`}
              id={`rf${scale.id}_name`}
              placeholder="Name"
              value={scale.name}
              onChange={(e) => handleRatingScaleChange(scale.id, 'name', e.target.value)}
            />
            <div>
              <label htmlFor={`rf${scale.id}_from`}>Range:</label>
              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  name={`rf${scale.id}_from`}
                  id={`rf${scale.id}_from`}
                  placeholder="Min Value"
                  value={scale.min}
                  onChange={(e) => handleRatingScaleChange(scale.id, 'min', e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  name={`rf${scale.id}_to`}
                  id={`rf${scale.id}_to`}
                  placeholder="Max Value"
                  value={scale.max}
                  onChange={(e) => handleRatingScaleChange(scale.id, 'max', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className={styles.addRanking} onClick={addRatingScale}>
        <FaPlus /> Add another rating scale
      </button>
    </div>
  );
}