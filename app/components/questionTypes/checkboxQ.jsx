'use client'
import { useState } from 'react' // Add useState import
import checkboxStyles from '../../styles/questionTypes/checkboxQ.module.css'
import commonStyles from '../../styles/questionTypes/common.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa"; // Added FaTrash import

export default function checkboxQ() {
  // State to manage multiple checkbox questions
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, question: '' }
  ]);

  // Function to add a new checkbox
  const addCheckbox = () => {
    const newId = checkboxes.length + 1;
    setCheckboxes([...checkboxes, { id: newId, question: '' }]);
  };

  // Function to remove a checkbox
  const removeCheckbox = (idToRemove) => {
    // Don't remove if it's the last checkbox
    if (checkboxes.length <= 1) {
      return;
    }
    
    // Remove the checkbox with the specified ID
    const filteredCheckboxes = checkboxes.filter(checkbox => checkbox.id !== idToRemove);
    
    // Renumber the remaining checkboxes sequentially
    const renumberedCheckboxes = filteredCheckboxes.map((checkbox, index) => ({
      ...checkbox,
      id: index + 1
    }));
    
    setCheckboxes(renumberedCheckboxes);
  };

  // Function to handle input changes
  const handleCheckboxChange = (id, value) => {
    setCheckboxes(checkboxes.map(checkbox => 
      checkbox.id === id ? { ...checkbox, question: value } : checkbox
    ));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
        <h2>Checkbox question</h2>
        <div className={commonStyles.questionName}>
          <label htmlFor="questionName">Question title:</label>
          <input type="text" name="questionName" id="questionName" placeholder="Title" />
        </div>
        
        {/* Use the Artifact component in standalone mode */}
        <Artifact mode="standalone" allowMultiple={true} />
        
        {/* Map through checkboxes and render each one */}
        {checkboxes.map((checkbox) => (
          <div key={checkbox.id} className={commonStyles.itemBox}>
              <div className={commonStyles.itemHeader}>
                <label htmlFor={`checkbox${checkbox.id}`}>Checkbox {checkbox.id}:</label>
                <button 
                  type="button" 
                  className={commonStyles.removeBtn}
                  onClick={() => removeCheckbox(checkbox.id)}
                  disabled={checkboxes.length <= 1}
                >
                  <FaTrash /> Remove
                </button>
              </div>
              <div className={commonStyles.itemGroup}>
                <label htmlFor={`checkbox${checkbox.id}`}>Checkbox name:</label>
                <input 
                  type="text" 
                  name={`checkbox${checkbox.id}`} 
                  id={`checkbox${checkbox.id}`} 
                  placeholder="Name"
                  value={checkbox.question}
                  onChange={(e) => handleCheckboxChange(checkbox.id, e.target.value)} 
                />
              </div>
          </div>
        ))}
        <button className={commonStyles.addItemBtn} onClick={addCheckbox}><FaPlus /> Add another checkbox</button>
    </div>
  )
};