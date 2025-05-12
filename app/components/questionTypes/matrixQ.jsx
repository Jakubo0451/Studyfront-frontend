'use client'
import { useState } from 'react'
import commonStyles from '../../styles/questionTypes/common.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function MatrixQuestionBuilder() {
  // State to manage multiple matrix groups
  const [matrixGroups, setMatrixGroups] = useState([
    {
      id: 1,
      label: '',
      horizontalItems: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ],
      verticalItems: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }
  ]);

  // Function to add a new matrix group
  const addMatrixGroup = () => {
    const newId = matrixGroups.length + 1;
    setMatrixGroups([...matrixGroups, {
      id: newId,
      label: '',
      horizontalItems: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ],
      verticalItems: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }]);
  };

  // Function to remove a matrix group
  const removeMatrixGroup = (groupId) => {
    // Don't remove if it's the last matrix group
    if (matrixGroups.length <= 1) {
      return;
    }
    
    // Remove the matrix group with the specified ID
    const filteredGroups = matrixGroups.filter(group => group.id !== groupId);
    
    // Renumber the remaining matrix groups sequentially
    const renumberedGroups = filteredGroups.map((group, index) => ({
      ...group,
      id: index + 1
    }));
    
    setMatrixGroups(renumberedGroups);
  };

  // Function to handle matrix group label changes
  const handleMatrixGroupLabelChange = (groupId, value) => {
    setMatrixGroups(matrixGroups.map(group => 
      group.id === groupId ? { ...group, label: value } : group
    ));
  };

  // Function to add a horizontal item to a specific matrix group
  const addHorizontalItem = (groupId) => {
    setMatrixGroups(matrixGroups.map(group => {
      if (group.id === groupId) {
        const newItemId = group.horizontalItems.length + 1;
        return {
          ...group,
          horizontalItems: [...group.horizontalItems, { id: newItemId, text: '' }]
        };
      }
      return group;
    }));
  };

  // Function to add a vertical item to a specific matrix group
  const addVerticalItem = (groupId) => {
    setMatrixGroups(matrixGroups.map(group => {
      if (group.id === groupId) {
        const newItemId = group.verticalItems.length + 1;
        return {
          ...group,
          verticalItems: [...group.verticalItems, { id: newItemId, text: '' }]
        };
      }
      return group;
    }));
  };

  // Function to remove a horizontal item from a specific matrix group
  const removeHorizontalItem = (groupId, itemId) => {
    setMatrixGroups(matrixGroups.map(group => {
      if (group.id === groupId) {
        // Don't remove if only 2 items remain
        if (group.horizontalItems.length <= 2) {
          return group;
        }
        
        // Remove the item with the specified ID
        const filteredItems = group.horizontalItems.filter(item => item.id !== itemId);
        
        // Renumber the remaining items sequentially
        const renumberedItems = filteredItems.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        
        return {
          ...group,
          horizontalItems: renumberedItems
        };
      }
      return group;
    }));
  };

  // Function to remove a vertical item from a specific matrix group
  const removeVerticalItem = (groupId, itemId) => {
    setMatrixGroups(matrixGroups.map(group => {
      if (group.id === groupId) {
        // Don't remove if only 2 items remain
        if (group.verticalItems.length <= 2) {
          return group;
        }
        
        // Remove the item with the specified ID
        const filteredItems = group.verticalItems.filter(item => item.id !== itemId);
        
        // Renumber the remaining items sequentially
        const renumberedItems = filteredItems.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        
        return {
          ...group,
          verticalItems: renumberedItems
        };
      }
      return group;
    }));
  };

  // Function to handle horizontal item text changes
  const handleHorizontalItemChange = (groupId, itemId, value) => {
    setMatrixGroups(matrixGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          horizontalItems: group.horizontalItems.map(item =>
            item.id === itemId ? { ...item, text: value } : item
          )
        };
      }
      return group;
    }));
  };

  // Function to handle vertical item text changes
  const handleVerticalItemChange = (groupId, itemId, value) => {
    setMatrixGroups(matrixGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          verticalItems: group.verticalItems.map(item =>
            item.id === itemId ? { ...item, text: value } : item
          )
        };
      }
      return group;
    }));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Matrix question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionName">Question title:</label>
        <input type="text" name="questionName" id="questionName" placeholder="Title" />
      </div>
      
      {/* Use the Artifact component in standalone mode */}
      <Artifact mode="standalone" allowMultiple={true} />
      
      <p className={commonStyles.infoBox}>
        <IoIosInformationCircleOutline /> A matrix question creates a grid where participants select answers at the intersection of rows and columns.
      </p>
      
      {/* Map through each matrix group */}
      {matrixGroups.map((group) => (
        <div key={group.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`matrixGroup${group.id}`}>Matrix Group {group.id}:</label>
            <button 
              type="button" 
              className={commonStyles.removeBtn}
              onClick={() => removeMatrixGroup(group.id)}
              disabled={matrixGroups.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          
          <div className={commonStyles.itemGroup}>
            <label htmlFor={`matrixLabel${group.id}`}>Matrix group label:</label>
            <input 
              type="text" 
              name={`matrixLabel${group.id}`} 
              id={`matrixLabel${group.id}`} 
              placeholder="Please rate the following..."
              value={group.label}
              onChange={(e) => handleMatrixGroupLabelChange(group.id, e.target.value)} 
            />
            
            <div className="flex flex-row space-x-4">
              {/* Horizontal Items (Column Headers) */}
              <div className="flex-1">
                <h4>Column Headers:</h4>
                <div className={commonStyles.optionsContainer}>
                  {group.horizontalItems.map((item) => (
                    <div key={item.id} className={commonStyles.singleOptionBox}>
                      <div className={commonStyles.itemHeader}>
                        <label htmlFor={`group${group.id}HorizontalItem${item.id}`}>Column {item.id}:</label>
                        <button 
                          type="button" 
                          className={commonStyles.removeBtn}
                          onClick={() => removeHorizontalItem(group.id, item.id)}
                          disabled={group.horizontalItems.length <= 2}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                      <div>
                        <input 
                          type="text" 
                          name={`group${group.id}HorizontalItem${item.id}`} 
                          id={`group${group.id}HorizontalItem${item.id}`} 
                          placeholder="e.g., Agree, Disagree"
                          value={item.text}
                          onChange={(e) => handleHorizontalItemChange(group.id, item.id, e.target.value)} 
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    className={commonStyles.addItemBtn} 
                    onClick={() => addHorizontalItem(group.id)}
                  >
                    <FaPlus /> Add column
                  </button>
                </div>
              </div>
              
              {/* Vertical Items (Row Headers) */}
              <div className="flex-1">
                <h4>Row Headers:</h4>
                <div className={commonStyles.optionsContainer}>
                  {group.verticalItems.map((item) => (
                    <div key={item.id} className={commonStyles.singleOptionBox}>
                      <div className={commonStyles.itemHeader}>
                        <label htmlFor={`group${group.id}VerticalItem${item.id}`}>Row {item.id}:</label>
                        <button 
                          type="button" 
                          className={commonStyles.removeBtn}
                          onClick={() => removeVerticalItem(group.id, item.id)}
                          disabled={group.verticalItems.length <= 2}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                      <div>
                        <input 
                          type="text" 
                          name={`group${group.id}VerticalItem${item.id}`} 
                          id={`group${group.id}VerticalItem${item.id}`} 
                          placeholder="e.g., Product quality, Customer service"
                          value={item.text}
                          onChange={(e) => handleVerticalItemChange(group.id, item.id, e.target.value)} 
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    className={commonStyles.addItemBtn} 
                    onClick={() => addVerticalItem(group.id)}
                  >
                    <FaPlus /> Add row
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <button className={commonStyles.addItemBtn} onClick={addMatrixGroup}>
        <FaPlus /> Add another matrix group
      </button>
    </div>
  )
};