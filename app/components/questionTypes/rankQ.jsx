'use client';
import React, { useState, useEffect } from 'react'; // Added useEffect
import commonStyles from '../../styles/questionTypes/common.module.css';
import rankStyles from '../../styles/questionTypes/rankQ.module.css';
import Artifact from './artifact';
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

function RankQuestionComponent({ questionData, onChange }) { // Renamed and added props
  const [title, setTitle] = useState(questionData?.title || '');
  const [rankGroups, setRankGroups] = useState(
    questionData?.rankGroups?.map((group, gIndex) => ({
      ...group,
      id: group.id || `${Date.now()}-rg-${gIndex}`, // Ensure group ID
      options: group.options?.map((opt, oIndex) => ({
        ...opt,
        id: opt.id || `${Date.now()}-ro-${gIndex}-${oIndex}`, // Ensure option ID
      })) || [{ id: `${Date.now()}-ro-${gIndex}-0`, text: '' }],
    })) || [{ 
      id: `${Date.now()}-rg-0`, 
      label: '', 
      options: [{ id: `${Date.now()}-ro-0-0`, text: '' }] 
    }]
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        rankGroups,
      });
    }
  }, [title, rankGroups, onChange]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const addRankGroup = () => {
    const newGroupId = `${Date.now()}-rg-${rankGroups.length}`;
    setRankGroups([
      ...rankGroups,
      {
        id: newGroupId,
        label: '',
        options: [{ id: `${Date.now()}-ro-${rankGroups.length}-0`, text: '' }, { id: `${Date.now()}-ro-${rankGroups.length}-1`, text: '' }], // Start with 2 items
      },
    ]);
  };

  const removeRankGroup = (groupId) => {
    if (rankGroups.length <= 1) return;
    setRankGroups(rankGroups.filter(group => group.id !== groupId));
  };

  const handleRankGroupLabelChange = (groupId, value) => {
    setRankGroups(rankGroups.map(group =>
      group.id === groupId ? { ...group, label: value } : group
    ));
  };

  const addItem = (groupId) => { // Renamed from addOption for clarity
    setRankGroups(rankGroups.map(group => {
      if (group.id === groupId) {
        const newItemId = `${Date.now()}-ro-${group.id}-${group.options.length}`;
        return {
          ...group,
          options: [...group.options, { id: newItemId, text: '' }],
        };
      }
      return group;
    }));
  };

  const removeItem = (groupId, itemId) => { // Renamed from removeOption
    setRankGroups(rankGroups.map(group => {
      if (group.id === groupId) {
        if (group.options.length <= 2) return group; // Keep at least 2 items
        return {
          ...group,
          options: group.options.filter(item => item.id !== itemId),
        };
      }
      return group;
    }));
  };

  const handleItemChange = (groupId, itemId, value) => { // Renamed from handleOptionChange
    setRankGroups(rankGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          options: group.options.map(item =>
            item.id === itemId ? { ...item, text: value } : item
          ),
        };
      }
      return group;
    }));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
      <h2>Ranking question</h2>
      <div className={commonStyles.questionName}>
        <label htmlFor="questionTitle_rank">Question title:</label>
        <input
          type="text"
          name="questionTitle_rank"
          id="questionTitle_rank"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <Artifact mode="standalone" allowMultiple={true} />

      <p className={commonStyles.infoBox}>
        <IoIosInformationCircleOutline /> Participants will be able to drag and reorder items to create their ranked list. The item number in the question creator will decide the initial order of the items.
      </p>

      {rankGroups.map((group, groupIndex) => (
        <div key={group.id} className={commonStyles.itemBox}>
          <div className={commonStyles.itemHeader}>
            <label htmlFor={`rankGroupLabel_${group.id}`}>Ranking Group {groupIndex + 1}:</label>
            <button
              type="button"
              className={commonStyles.removeBtn}
              onClick={() => removeRankGroup(group.id)}
              disabled={rankGroups.length <= 1}
            >
              <FaTrash /> Remove Group
            </button>
          </div>

          <div className={commonStyles.itemGroup}>
            <label htmlFor={`rgLabel_${group.id}`}>Ranking group label:</label>
            <input
              type="text"
              name={`rgLabel_${group.id}`}
              id={`rgLabel_${group.id}`}
              placeholder="Rank these items from highest to lowest..."
              value={group.label}
              onChange={(e) => handleRankGroupLabelChange(group.id, e.target.value)}
            />

            <h4>Items to rank:</h4>
            <div className={rankStyles.optionsContainer || commonStyles.optionsContainer}>
              {group.options.map((item, itemIndex) => (
                <div key={item.id} className={commonStyles.singleOptionBox}>
                  <div className={commonStyles.itemHeader}>
                    <label htmlFor={`itemText_${item.id}`}>Item {itemIndex + 1}:</label>
                    <button
                      type="button"
                      className={commonStyles.removeBtn}
                      onClick={() => removeItem(group.id, item.id)}
                      disabled={group.options.length <= 2}
                    >
                      <FaTrash /> Remove Item
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      name={`itemText_${item.id}`}
                      id={`itemText_${item.id}`}
                      placeholder="Item to rank"
                      value={item.text}
                      onChange={(e) => handleItemChange(group.id, item.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className={commonStyles.addItemBtn + " mt-2"}
              onClick={() => addItem(group.id)}
            >
              <FaPlus /> Add item to rank
            </button>
          </div>
        </div>
      ))}

      <button className={commonStyles.addItemBtn + " mt-4"} onClick={addRankGroup}>
        <FaPlus /> Add another ranking group
      </button>
    </div>
  );
}

const TextanswerQuestionBuilder = React.memo(RankQuestionComponent);
export default TextanswerQuestionBuilder;