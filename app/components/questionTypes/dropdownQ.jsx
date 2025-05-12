'use client'
import { useState } from 'react'
import dropdownStyles from '../../styles/questionTypes/dropdownQ.module.css'
import commonStyles from '../../styles/questionTypes/common.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa";

export default function dropdownQ() {
  // State to manage multiple dropdown questions, each with their own options
  const [dropdowns, setDropdowns] = useState([
    {
      id: 1,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }
  ]);

  // Function to add a new dropdown
  const addDropdown = () => {
    const newId = dropdowns.length + 1;
    setDropdowns([...dropdowns, {
      id: newId,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }]);
  };

  // Function to remove a dropdown
  const removeDropdown = (dropdownId) => {
    // Don't remove if it's the last dropdown
    if (dropdowns.length <= 1) {
      return;
    }
    
    // Remove the dropdown with the specified ID
    const filteredDropdowns = dropdowns.filter(dropdown => dropdown.id !== dropdownId);
    
    // Renumber the remaining dropdowns sequentially
    const renumberedDropdowns = filteredDropdowns.map((dropdown, index) => ({
      ...dropdown,
      id: index + 1
    }));
    
    setDropdowns(renumberedDropdowns);
  };

  // Function to handle dropdown label changes
  const handleDropdownLabelChange = (dropdownId, value) => {
    setDropdowns(dropdowns.map(dropdown => 
      dropdown.id === dropdownId ? { ...dropdown, label: value } : dropdown
    ));
  };

  // Function to add an option to a specific dropdown
  const addOption = (dropdownId) => {
    setDropdowns(dropdowns.map(dropdown => {
      if (dropdown.id === dropdownId) {
        const newOptionId = dropdown.options.length + 1;
        return {
          ...dropdown,
          options: [...dropdown.options, { id: newOptionId, text: '' }]
        };
      }
      return dropdown;
    }));
  };

  // Function to remove an option from a specific dropdown
  const removeOption = (dropdownId, optionId) => {
    setDropdowns(dropdowns.map(dropdown => {
      if (dropdown.id === dropdownId) {
        // Don't remove if only 2 options remain
        if (dropdown.options.length <= 2) {
          return dropdown;
        }
        
        // Remove the option with the specified ID
        const filteredOptions = dropdown.options.filter(option => option.id !== optionId);
        
        // Renumber the remaining options sequentially
        const renumberedOptions = filteredOptions.map((option, index) => ({
          ...option,
          id: index + 1
        }));
        
        return {
          ...dropdown,
          options: renumberedOptions
        };
      }
      return dropdown;
    }));
  };

  // Function to handle option text changes
  const handleOptionChange = (dropdownId, optionId, value) => {
    setDropdowns(dropdowns.map(dropdown => {
      if (dropdown.id === dropdownId) {
        return {
          ...dropdown,
          options: dropdown.options.map(option =>
            option.id === optionId ? { ...option, text: value } : option
          )
        };
      }
      return dropdown;
    }));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Dropdown question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionName">Question title:</label>
        <input type="text" name="questionName" id="questionName" placeholder="Title" />
      </div>
      
      {/* Use the Artifact component in standalone mode */}
      <Artifact mode="standalone" allowMultiple={true} />
      
      {/* Map through each dropdown */}
      {dropdowns.map((dropdown) => (
        <div key={dropdown.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`dropdown${dropdown.id}`}>Dropdown {dropdown.id}:</label>
            <button 
              type="button" 
              className={commonStyles.removeBtn}
              onClick={() => removeDropdown(dropdown.id)}
              disabled={dropdowns.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          
          <div className={commonStyles.itemGroup}>
            <label htmlFor={`dropdownLabel${dropdown.id}`}>Dropdown label:</label>
            <input 
              type="text" 
              name={`dropdownLabel${dropdown.id}`} 
              id={`dropdownLabel${dropdown.id}`} 
              placeholder="Dropdown label"
              value={dropdown.label}
              onChange={(e) => handleDropdownLabelChange(dropdown.id, e.target.value)} 
            />
          
          <h4>Dropdown options:</h4>
          <div className={dropdownStyles.optionsContainer}>
            
            {/* Map through options for this dropdown */}
            {dropdown.options.map((option) => (
              <div key={option.id} className={dropdownStyles.singleOptionBox}>
                <div className={commonStyles.itemHeader}>
                  <label htmlFor={`dropdown${dropdown.id}Option${option.id}`}>Option {option.id}:</label>
                  <button 
                    type="button" 
                    className={commonStyles.removeBtn}
                    onClick={() => removeOption(dropdown.id, option.id)}
                    disabled={dropdown.options.length <= 2}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
                <div>
                  <input 
                    type="text" 
                    name={`dropdown${dropdown.id}Option${option.id}`} 
                    id={`dropdown${dropdown.id}Option${option.id}`} 
                    placeholder="Option name"
                    value={option.text}
                    onChange={(e) => handleOptionChange(dropdown.id, option.id, e.target.value)} 
                  />
                </div>
              </div>
            ))}</div>
            
            <button 
              className={commonStyles.addItemBtn + " mt-2"} 
              onClick={() => addOption(dropdown.id)}
            >
              <FaPlus /> Add dropdown option
            </button>
          </div>
        </div>
      ))}
      
      <button className={commonStyles.addItemBtn + " mt-4"} onClick={addDropdown}>
        <FaPlus /> Add another dropdown
      </button>
    </div>
  )
};