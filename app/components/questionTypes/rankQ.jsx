'use client'
import { useState } from 'react'
import commonStyles from '../../styles/questionTypes/common.module.css'
import rankStyles from '../../styles/questionTypes/rankQ.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function RankQuestionBuilder() {
  // State to manage multiple ranking groups, each with their own options
  const [rankGroups, setRankGroups] = useState([
    {
      id: 1,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }
  ]);

  // Function to add a new ranking group
  const addRankGroup = () => {
    const newId = rankGroups.length + 1;
    setRankGroups([...rankGroups, {
      id: newId,
      label: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]
    }]);
  };

  // Function to remove a ranking group
  const removeRankGroup = (groupId) => {
    // Don't remove if it's the last ranking group
    if (rankGroups.length <= 1) {
      return;
    }
    
    // Remove the ranking group with the specified ID
    const filteredGroups = rankGroups.filter(group => group.id !== groupId);
    
    // Renumber the remaining ranking groups sequentially
    const renumberedGroups = filteredGroups.map((group, index) => ({
      ...group,
      id: index + 1
    }));
    
    setRankGroups(renumberedGroups);
  };

  // Function to handle ranking group label changes
  const handleRankGroupLabelChange = (groupId, value) => {
    setRankGroups(rankGroups.map(group => 
      group.id === groupId ? { ...group, label: value } : group
    ));
  };

  // Function to add an item to a specific ranking group
  const addItem = (groupId) => {
    setRankGroups(rankGroups.map(group => {
      if (group.id === groupId) {
        const newItemId = group.options.length + 1;
        return {
          ...group,
          options: [...group.options, { id: newItemId, text: '' }]
        };
      }
      return group;
    }));
  };

  // Function to remove an item from a specific ranking group
  const removeItem = (groupId, itemId) => {
    setRankGroups(rankGroups.map(group => {
      if (group.id === groupId) {
        // Don't remove if only 2 items remain
        if (group.options.length <= 2) {
          return group;
        }
        
        // Remove the item with the specified ID
        const filteredItems = group.options.filter(item => item.id !== itemId);
        
        // Renumber the remaining items sequentially
        const renumberedItems = filteredItems.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        
        return {
          ...group,
          options: renumberedItems
        };
      }
      return group;
    }));
  };

  // Function to handle item text changes
  const handleItemChange = (groupId, itemId, value) => {
    setRankGroups(rankGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          options: group.options.map(item =>
            item.id === itemId ? { ...item, text: value } : item
          )
        };
      }
      return group;
    }));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Ranking question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionName">Question title:</label>
        <input type="text" name="questionName" id="questionName" placeholder="Title" />
      </div>
      
      {/* Use the Artifact component in standalone mode */}
      <Artifact mode="standalone" allowMultiple={true} />
      
      <p className={commonStyles.infoBox}>
        <IoIosInformationCircleOutline /> Participants will be able to drag and reorder items to create their ranked list. The item number in the question creator will decide the initial order of the items.
      </p>
      
      {/* Map through each ranking group */}
      {rankGroups.map((group) => (
        <div key={group.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`rankGroup${group.id}`}>Ranking Group {group.id}:</label>
            <button 
              type="button" 
              className={commonStyles.removeBtn}
              onClick={() => removeRankGroup(group.id)}
              disabled={rankGroups.length <= 1}
            >
              <FaTrash /> Remove
            </button>
          </div>
          
          <div className={commonStyles.itemGroup}>
            <label htmlFor={`rankLabel${group.id}`}>Ranking group label:</label>
            <input 
              type="text" 
              name={`rankLabel${group.id}`} 
              id={`rankLabel${group.id}`} 
              placeholder="Rank these items from highest to lowest..."
              value={group.label}
              onChange={(e) => handleRankGroupLabelChange(group.id, e.target.value)} 
            />
          
          <h4>Items to rank:</h4>
          <div className={rankStyles.optionsContainer || commonStyles.optionsContainer}>
            
            {/* Map through items for this ranking group */}
            {group.options.map((item) => (
              <div key={item.id} className={commonStyles.singleOptionBox}>
                <div className={commonStyles.itemHeader}>
                  <label htmlFor={`group${group.id}Item${item.id}`}>Item {item.id}:</label>
                  <button 
                    type="button" 
                    className={commonStyles.removeBtn}
                    onClick={() => removeItem(group.id, item.id)}
                    disabled={group.options.length <= 2}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
                <div>
                  <input 
                    type="text" 
                    name={`group${group.id}Item${item.id}`} 
                    id={`group${group.id}Item${item.id}`} 
                    placeholder="Item to rank"
                    value={item.text}
                    onChange={(e) => handleItemChange(group.id, item.id, e.target.value)} 
                  />
                </div>
              </div>
            ))}</div>
            
            <button 
              className={commonStyles.addItemBtn} 
              onClick={() => addItem(group.id)}
            >
              <FaPlus /> Add item to rank
            </button>
          </div>
        </div>
      ))}
      
      <button className={commonStyles.addItemBtn} onClick={addRankGroup}>
        <FaPlus /> Add another ranking group
      </button>
    </div>
  )
};