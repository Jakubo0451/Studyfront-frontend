'use client'
import { useState } from 'react'
import multiplechoiceStyles from '../../styles/questionTypes/multiplechoiceQ.module.css'
import commonStyles from '../../styles/questionTypes/common.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa";

export default function multiplechoiceQ() {
  // State to manage multiple choice groups, each with their own options
  const [choiceGroups, setChoiceGroups] = useState([
    {
      id: 1,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }
  ]);

  // Function to add a new choice group
  const addChoiceGroup = () => {
    const newId = choiceGroups.length + 1;
    setChoiceGroups([...choiceGroups, {
      id: newId,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }]);
  };

  // Function to remove a choice group
  const removeChoiceGroup = (groupId) => {
    // Don't remove if it's the last choice group
    if (choiceGroups.length <= 1) {
      return;
    }
    
    // Remove the choice group with the specified ID
    const filteredGroups = choiceGroups.filter(group => group.id !== groupId);
    
    // Renumber the remaining choice groups sequentially
    const renumberedGroups = filteredGroups.map((group, index) => ({
      ...group,
      id: index + 1
    }));
    
    setChoiceGroups(renumberedGroups);
  };

  // Function to handle choice group label changes
  const handleGroupLabelChange = (groupId, value) => {
    setChoiceGroups(choiceGroups.map(group => 
      group.id === groupId ? { ...group, label: value } : group
    ));
  };

  // Function to add an option to a specific choice group
  const addOption = (groupId) => {
    setChoiceGroups(choiceGroups.map(group => {
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

  // Function to remove an option from a specific choice group
  const removeOption = (groupId, optionId) => {
    setChoiceGroups(choiceGroups.map(group => {
      if (group.id === groupId) {
        // Don't remove if only 2 options remain (minimum required for multiple choice)
        if (group.options.length <= 2) {
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
    setChoiceGroups(choiceGroups.map(group => {
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
      <h2>Multiple choice question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionName">Question title:</label>
        <input type="text" name="questionName" id="questionName" placeholder="Title" />
      </div>
      
      {/* Use the Artifact component in standalone mode */}
      <Artifact mode="standalone" allowMultiple={true} />
      
      {/* Map through each choice group */}
      {choiceGroups.map((group) => (
        <div key={group.id} className={commonStyles.itemBox + " mb-6"}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`choiceGroup${group.id}`}>Choice Group {group.id}:</label>
            <button 
              type="button" 
              className={commonStyles.removeBtn}
              onClick={() => removeChoiceGroup(group.id)}
              disabled={choiceGroups.length <= 1}
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
          
          <h4>Options (select one):</h4>
          <div className={multiplechoiceStyles.optionsContainer}>
            
            {/* Map through options for this choice group */}
            {group.options.map((option) => (
              <div key={option.id} className={commonStyles.singleOptionBox}>
                <div className={commonStyles.itemHeader}>
                  <label htmlFor={`group${group.id}Option${option.id}`}>Option {option.id}:</label>
                  <button 
                    type="button" 
                    className={commonStyles.removeBtn}
                    onClick={() => removeOption(group.id, option.id)}
                    disabled={group.options.length <= 2}
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
              <FaPlus /> Add option
            </button>
          </div>
        </div>
      ))}
      
      <button className={commonStyles.addItemBtn + " mt-4"} onClick={addChoiceGroup}>
        <FaPlus /> Add another choice group
      </button>
    </div>
  )
};