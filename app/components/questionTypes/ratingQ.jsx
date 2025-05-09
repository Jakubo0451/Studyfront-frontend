'use client'
import { useEffect, useState } from 'react' // Added useState import
import styles from '../../styles/questionTypes/ratingQ.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa"; // Added FaTrash import

export default function ratingQ() {
  // State to manage multiple rating scales
  const [ratingScales, setRatingScales] = useState([
    { id: 1, name: '', min: '', max: '' }
  ]);

  // Function to add a new rating scale
  const addRatingScale = () => {
    const newId = ratingScales.length + 1;
    setRatingScales([...ratingScales, { id: newId, name: '', min: '', max: '' }]);
  };

  // Function to remove a rating scale
  const removeRatingScale = (idToRemove) => {
    // Don't remove if it's the last scale
    if (ratingScales.length <= 1) {
      return;
    }
    
    // Remove the rating scale with the specified ID
    const filteredScales = ratingScales.filter(scale => scale.id !== idToRemove);
    
    // Renumber the remaining scales sequentially
    const renumberedScales = filteredScales.map((scale, index) => ({
      ...scale,
      id: index + 1
    }));
    
    setRatingScales(renumberedScales);
  };

  // Function to handle input changes
  const handleRatingScaleChange = (id, field, value) => {
    setRatingScales(ratingScales.map(scale => 
      scale.id === id ? { ...scale, [field]: value } : scale
    ));
  };

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
        
        {/* Map through rating scales and render each one */}
        {ratingScales.map((scale) => (
          <div key={scale.id} className={styles.ratingScale}>
              <div className={styles.ratingHeader}>
                <label htmlFor={`rating${scale.id}`}>Rating factor {scale.id}:</label>
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
                <label htmlFor={`rf${scale.id}_name`}>Rating name:</label>
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
        <button className={styles.addRanking} onClick={addRatingScale}><FaPlus /> Add another rating scale</button>
    </div>
  )
};