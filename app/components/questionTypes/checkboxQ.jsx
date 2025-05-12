'use client'
import { useState } from 'react'
import checkboxStyles from '../../styles/questionTypes/checkboxQ.module.css'
import commonStyles from '../../styles/questionTypes/common.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa";

export default function checkboxQ() {
  // State to manage multiple checkbox groups, each with their own options
  const [checkboxGroups, setCheckboxGroups] = useState([
    {
      id: 1,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }
  ]);

  // Function to add a new checkbox group
  const addCheckboxGroup = () => {
    const newId = checkboxGroups.length + 1;
    setCheckboxGroups([...checkboxGroups, {
      id: newId,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }]);
  };

  // Function to remove a checkbox group
  const removeCheckboxGroup = (groupId) => {
    // Don't remove if it's the last checkbox group
    if (checkboxGroups.length <= 1) {
      return;
    }
    
    // Remove the checkbox group with the specified ID
    const filteredGroups = checkboxGroups.filter(group => group.id !== groupId);
    
    // Renumber the remaining checkbox groups sequentially
    const renumberedGroups = filteredGroups.map((group, index) => ({
      ...group,
      id: index + 1
    }));
    
    setCheckboxGroups(renumberedGroups);
  };

  // Function to handle checkbox group label changes
  const handleGroupLabelChange = (groupId, value) => {
    setCheckboxGroups(checkboxGroups.map(group => 
      group.id === groupId ? { ...group, label: value } : group
    ));
  };

  // Function to add an option to a specific checkbox group
  const addOption = (groupId) => {
    setCheckboxGroups(checkboxGroups.map(group => {
      if (group.id === groupId) {
        const newOptionId = group.options.length + 1;
        return {
          ...group,
          options: [...group.options, { id: newOptionId, text: '' }]
        };
      }
      return group;
    }));
  };

  // Function to remove an option from a specific checkbox group
  const removeOption = (groupId, optionId) => {
    setCheckboxGroups(checkboxGroups.map(group => {
      if (group.id === groupId) {
        // Don't remove if only 1 option remains (checkbox can have just 1 option)
        if (group.options.length <= 1) {
          return group;
        }
        
        // Remove the option with the specified ID
        const filteredOptions = group.options.filter(option => option.id !== optionId);
        
        // Renumber the remaining options sequentially
        const renumberedOptions = filteredOptions.map((option, index) => ({
          ...option,
          id: index + 1
        }));
        
        return {
          ...group,
          options: renumberedOptions
        };
      }
      return group;
    }));
  };

  // Function to handle option text changes
  const handleOptionChange = (groupId, optionId, value) => {
    setCheckboxGroups(checkboxGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          options: group.options.map(option =>
            option.id === optionId ? { ...option, text: value } : option
          )
        };
      }
      return group;
    }));
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
      
      {/* Map through each checkbox group */}
      {checkboxGroups.map((group) => (
        <div key={group.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`checkboxGroup${group.id}`}>Checkbox Group {group.id}:</label>
            <button 
              type="button" 
              className={commonStyles.removeBtn}
              onClick={() => removeCheckboxGroup(group.id)}
              disabled={checkboxGroups.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          
          <div className={commonStyles.itemGroup}>
            <label htmlFor={`groupLabel${group.id}`}>Group label:</label>
            <input 
              type="text" 
              name={`groupLabel${group.id}`} 
              id={`groupLabel${group.id}`} 
              placeholder="Group label"
              value={group.label}
              onChange={(e) => handleGroupLabelChange(group.id, e.target.value)} 
            />
          
          <h4>Checkbox options:</h4>
          <div className={checkboxStyles.optionsContainer}>
            
            {/* Map through options for this checkbox group */}
            {group.options.map((option) => (
              <div key={option.id} className={commonStyles.singleOptionBox || 'border-l-3 border-petrol-blue pl-2 py-2'}>
                <div className={commonStyles.itemHeader}>
                  <label htmlFor={`group${group.id}Option${option.id}`}>Option {option.id}:</label>
                  <button 
                    type="button" 
                    className={commonStyles.removeBtn}
                    onClick={() => removeOption(group.id, option.id)}
                    disabled={group.options.length <= 1}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
                <div>
                  <input 
                    type="text" 
                    name={`group${group.id}Option${option.id}`} 
                    id={`group${group.id}Option${option.id}`} 
                    placeholder="Option text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(group.id, option.id, e.target.value)} 
                  />
                </div>
              </div>
            ))}</div>
            
            <button 
              className={commonStyles.addItemBtn + " mt-2"} 
              onClick={() => addOption(group.id)}
            >
              <FaPlus /> Add checkbox option
            </button>
          </div>
        </div>
      ))}
      
      <button className={commonStyles.addItemBtn + " mt-4"} onClick={addCheckboxGroup}>
        <FaPlus /> Add another checkbox group
      </button>
    </div>
  )
};