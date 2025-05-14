import { useState, useEffect } from 'react';
import commonStyles from '../../styles/questionRenderer/common.module.css';

export default function QuestionRenderer({ question, onResponse, currentResponse }) {
  const [localResponse, setLocalResponse] = useState(currentResponse);

  useEffect(() => {
    setLocalResponse(currentResponse);
  }, [currentResponse, question._id]); 

  console.log('Question data:', {
    type: question.type,
    id: question._id,
    fullData: question.data,
    currentLocalResponse: localResponse,
  });

  const handleChange = (value, fieldId = null) => {
    const questionTypeLower = question.type?.toLowerCase();

    if (questionTypeLower === 'text' && question.data?.textAreas?.length > 1 && fieldId) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    } else if (
      (questionTypeLower === 'ratingscale' || questionTypeLower === 'rating' || questionTypeLower === 'rating scale') &&
      question.data?.ratingScales?.length > 1 &&
      fieldId
    ) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    } else if (
      questionTypeLower === 'checkbox' &&
      question.data?.checkboxGroups?.length > 1 &&
      fieldId
    ) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    } else if (
      questionTypeLower === 'dropdown' &&
      question.data?.dropdowns?.length > 1 &&
      fieldId
    ) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    } else if (
      questionTypeLower === 'ranking' &&
      question.data?.rankGroups?.length > 1 &&
      fieldId
    ) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    } else if (
      (questionTypeLower === 'multiplechoice' || questionTypeLower === 'multiple choice') &&
      question.data?.choiceGroups?.length > 1 &&
      fieldId
    ) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    } else if (
      questionTypeLower === 'matrix' &&
      question.data?.matrixGroups?.length > 1 &&
      fieldId
    ) {
      const newResponseObject = {
        ...(typeof localResponse === 'object' && localResponse !== null ? localResponse : {}),
        [fieldId]: value,
      };
      setLocalResponse(newResponseObject);
      onResponse(newResponseObject);
    }
    else {
      setLocalResponse(value);
      onResponse(value);
    }
  };

  const getPrompt = () => {
    if (!question.data) return "Question text not available";
    
    return question.data.title || 
           question.data.prompt || 
           question.data.questionText || 
           `Question ${question._id}`;
  };

  const renderTextQuestion = () => {
    const textAreas = question.data?.textAreas;

    if (!Array.isArray(textAreas) || textAreas.length <= 1) {
      const textAreaId = textAreas?.[0]?.id || 'default';
      const singleLabel = textAreas?.[0]?.label || "Enter your answer here...";
      const valueForSingleTextArea = typeof localResponse === 'object' && localResponse !== null 
                                      ? (localResponse[textAreaId] || '') 
                                      : (typeof localResponse === 'string' ? localResponse : '');

      return (
        <div className={commonStyles.questionContainer}>
          <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
          {textAreas?.[0]?.label && <p className="block text-md text-gray-700 mb-1">{textAreas[0].label}</p>}
          <textarea
            className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            rows="4"
            value={valueForSingleTextArea}
            onChange={(e) => handleChange(e.target.value, textAreaId)}
            placeholder={singleLabel}
          />
        </div>
      );
    }

    return (
      <div className={commonStyles.questionContainer}>
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        {textAreas.map((area) => (
          <div key={area.id} className="mb-4">
            <label htmlFor={area.id} className="block text-md text-gray-700 mb-1">{area.label || `Input for ${area.id}`}</label>
            <textarea
              id={area.id}
              className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
              rows="3"
              value={(typeof localResponse === 'object' && localResponse !== null && localResponse[area.id]) || ''}
              onChange={(e) => handleChange(e.target.value, area.id)}
              placeholder={`Enter response for ${area.label || area.id}...`}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderNumberQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
      <input
        type="number"
        className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
        value={localResponse || ''}
        onChange={(e) => handleChange(Number(e.target.value))}
        placeholder="Enter a number"
      />
    </div>
  );

  const renderMultiChoiceQuestion = () => {
    const choiceGroups = question.data?.choiceGroups;

    if (Array.isArray(choiceGroups) && choiceGroups.length > 1) {
      return (
        <div className="mb-6">
          <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
          {choiceGroups.map((group, groupIndex) => {
            const groupId = group.id || `choiceGroup-${groupIndex}`;
            const options = group.options || [];

            if (options.length === 0) {
              return (
                <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
                  <p className="text-md text-gray-700 font-semibold mb-1">{group.name || `Group ${groupIndex + 1}`}</p>
                  <div className="text-sm text-gray-500">No options defined for this choice group.</div>
                </div>
              );
            }

            const currentGroupSelection = (typeof localResponse === 'object' && localResponse !== null)
                                          ? localResponse[groupId]
                                          : undefined;

            return (
              <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
                {group.name && <p className="text-md text-gray-700 font-semibold mb-2">{group.name}</p>}
                <div className="space-y-2">
                  {options.map((option, optionIndex) => {
                    const optionValue = typeof option === 'string' ? option : option.text;
                    const optionId = option.id || `option-${groupId}-${optionIndex}`;
                    const radioGroupName = `${question._id}_${groupId}`; 
                    return (
                      <label key={optionId} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-1 rounded-md transition-colors">
                        <input
                          type="radio"
                          name={radioGroupName}
                          value={optionValue}
                          checked={currentGroupSelection === optionValue}
                          onChange={(e) => handleChange(e.target.value, groupId)}
                          className="form-radio text-petrol-blue focus:ring-petrol-blue h-5 w-5"
                        />
                        <span className="text-gray-700">{optionValue}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const singleOptions = (Array.isArray(choiceGroups) && choiceGroups.length === 1)
                          ? choiceGroups[0].options
                          : extractOptions(question, 'multipleChoice');

    if (!singleOptions || singleOptions.length === 0) {
      return <div className="text-red-500">This multiple choice question has no options.</div>;
    }
    
    const singleGroupId = (Array.isArray(choiceGroups) && choiceGroups.length === 1) 
                          ? (choiceGroups[0].id || 'default_choice_group') 
                          : 'default_choice_group';


    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        {(Array.isArray(choiceGroups) && choiceGroups.length === 1 && choiceGroups[0].name) && (
            <p className="text-md text-gray-700 font-semibold mb-2">{choiceGroups[0].name}</p>
        )}
        <div className="space-y-3">
          {singleOptions.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.text;
            return (
              <label key={option.id || `option-${singleGroupId}-${index}`} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-2 rounded-md transition-colors">
                <input
                  type="radio"
                  name={question._id}
                  value={optionValue}
                  checked={localResponse === optionValue}
                  onChange={(e) => handleChange(e.target.value)}
                  className="form-radio text-petrol-blue focus:ring-petrol-blue h-5 w-5"
                />
                <span className="text-gray-700">{optionValue}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper function to extract options from different question structures
  const extractOptions = (question, type) => {
    if (!question.data) return [];
    
    if (type === 'multipleChoice') {
      // Try different possible structures
      if (Array.isArray(question.data.options)) {
        return question.data.options;
      } else if (question.data.choiceGroups && question.data.choiceGroups[0]?.options) {
        return question.data.choiceGroups[0].options;
      }
    } else if (type === 'checkbox') {
      if (Array.isArray(question.data.options)) {
        return question.data.options;
      } else if (question.data.checkboxGroups && question.data.checkboxGroups[0]?.options) {
        return question.data.checkboxGroups[0].options;
      }
    }
    
    return [];
  };

  const renderCheckboxQuestion = () => {
    const checkboxGroups = question.data?.checkboxGroups;

    if (Array.isArray(checkboxGroups) && checkboxGroups.length > 1) {
      return (
        <div className="mb-6">
          <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
          {checkboxGroups.map((group, groupIndex) => {
            const groupId = group.id || `checkboxGroup-${groupIndex}`;
            const groupOptions = group.options || [];
            const groupResponseArray = (typeof localResponse === 'object' && localResponse !== null && Array.isArray(localResponse[groupId]))
              ? localResponse[groupId]
              : [];

            if (groupOptions.length === 0) {
              return <div key={groupId} className="text-red-500">This checkbox group has no options.</div>;
            }

            return (
              <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
                {group.name && <p className="text-md text-gray-700 font-semibold mb-2">{group.name}</p>}
                <div className="space-y-2">
                  {groupOptions.map((option, optionIndex) => {
                    const optionValue = typeof option === 'string' ? option : option.text;
                    const optionId = option.id || `option-${groupId}-${optionIndex}`;
                    return (
                      <label key={optionId} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-1 rounded-md transition-colors">
                        <input
                          type="checkbox"
                          value={optionValue}
                          checked={groupResponseArray.includes(optionValue)}
                          onChange={(e) => {
                            const newGroupResponse = e.target.checked
                              ? [...groupResponseArray, optionValue]
                              : groupResponseArray.filter(item => item !== optionValue);
                            handleChange(newGroupResponse, groupId);
                          }}
                          className="form-checkbox text-petrol-blue focus:ring-petrol-blue h-5 w-5"
                        />
                        <span className="text-gray-700">{optionValue}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const singleGroupOptions = checkboxGroups && checkboxGroups.length === 1
      ? checkboxGroups[0].options
      : extractOptions(question, 'checkbox');

    const responseArray = Array.isArray(localResponse) ? localResponse : [];
    const singleGroupId = checkboxGroups && checkboxGroups.length === 1 ? (checkboxGroups[0].id || 'default_checkbox_group') : 'default_checkbox_group';

    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        {checkboxGroups && checkboxGroups.length === 1 && checkboxGroups[0].name && (
            <p className="text-md text-gray-700 font-semibold mb-2">{checkboxGroups[0].name}</p>
        )}
        <div className="space-y-3">
          {singleGroupOptions.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.text;
            const optionId = option.id || `option-${singleGroupId}-${index}`;
            return (
              <label key={optionId} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  value={optionValue}
                  checked={responseArray.includes(optionValue)}
                  onChange={(e) => {
                    const newResponse = e.target.checked
                      ? [...responseArray, optionValue]
                      : responseArray.filter(item => item !== optionValue);
                    handleChange(newResponse);
                  }}
                  className="form-checkbox text-petrol-blue focus:ring-petrol-blue h-5 w-5"
                />
                <span className="text-gray-700">{optionValue}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRatingQuestion = () => {
    const ratingScales = question.data?.ratingScales;

    if (!Array.isArray(ratingScales) || ratingScales.length === 0) {
      return (
        <div className="text-red-500">
          This rating question has no rating scales defined.
        </div>
      );
    }

    if (ratingScales.length === 1) {
      const ratingScale = ratingScales[0];
      const scaleId = ratingScale.id || 'default_rating_scale';
      const min = parseInt(ratingScale.min) || 1;
      const max = parseInt(ratingScale.max) || 5;
      
      const currentVal = (typeof localResponse === 'object' && localResponse !== null) 
                         ? localResponse[scaleId] 
                         : localResponse;
      const displayValue = currentVal !== null && currentVal !== undefined ? currentVal : '';

      return (
        <div className="mb-6">
          <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
          {ratingScale.name && (
            <p className="text-gray-600 mb-2">{ratingScale.name}</p>
          )}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex justify-between w-full px-1 text-sm text-gray-500">
              <span>{min}</span>
              <span>{max}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={currentVal === undefined || currentVal === null ? min : currentVal}
              onChange={(e) => handleChange(parseInt(e.target.value), scaleId)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-petrol-blue"
            />
            <span className="text-lg font-semibold text-petrol-blue">{displayValue}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        {ratingScales.map((ratingScale, index) => {
          const scaleId = ratingScale.id || `ratingScale-${index}`;
          const min = parseInt(ratingScale.min) || 1;
          const max = parseInt(ratingScale.max) || 5;
          /* eslint-disable-next-line */
          const ratingValues = Array.from(
            { length: max - min + 1 },
            (_, i) => i + min
          );
          const currentScaleResponse = (typeof localResponse === 'object' && localResponse !== null) 
                                       ? localResponse[scaleId] 
                                       : undefined;
          const displayValue = currentScaleResponse !== null && currentScaleResponse !== undefined ? currentScaleResponse : '';

          return (
            <div key={scaleId} className="mb-6 p-3 border border-gray-200 rounded-md">
              {ratingScale.name && (
                <p className="text-md text-gray-700 font-semibold mb-2">{ratingScale.name}</p>
              )}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex justify-between w-full px-1 text-sm text-gray-500">
                  <span>{min}</span>
                  <span>{max}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={currentScaleResponse === undefined || currentScaleResponse === null ? min : currentScaleResponse} // Default to min if no value
                  onChange={(e) => handleChange(parseInt(e.target.value), scaleId)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-petrol-blue"
                />
                <span className="text-lg font-semibold text-petrol-blue">{displayValue}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDropdownQuestion = () => {
    const dropdowns = question.data?.dropdowns;

    if (!Array.isArray(dropdowns) || dropdowns.length === 0) {
      return <div className="text-red-500">This dropdown question has no dropdowns defined.</div>;
    }

    if (dropdowns.length === 1) {
      const singleDropdown = dropdowns[0];
      const dropdownId = singleDropdown.id || 'default_dropdown';
      const options = singleDropdown.options || [];
      
      const currentValue = (typeof localResponse === 'object' && localResponse !== null)
                           ? localResponse[dropdownId]
                           : localResponse;

      return (
        <div className="mb-6">
          <label htmlFor={dropdownId} className="block text-lg text-petrol-blue mb-3">
            {singleDropdown.name || question.data.title || question.data.prompt || "Select an option"}
          </label>
          <select
            id={dropdownId}
            className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            value={currentValue || ''}
            onChange={(e) => handleChange(e.target.value, dropdownId)}
          >
            <option value="">-- Select an option --</option>
            {options.map((option, index) => (
              <option key={option.id || `option-${index}`} value={option.text}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">
          {question.data.title || question.data.prompt || "Please make your selections"}
        </label>
        {dropdowns.map((dropdownItem, index) => {
          const dropdownId = dropdownItem.id || `dropdown-${index}`;
          const options = dropdownItem.options || [];
          const currentDropdownValue = (typeof localResponse === 'object' && localResponse !== null)
                                       ? localResponse[dropdownId]
                                       : undefined;
          
          if (options.length === 0) {
            return (
              <div key={dropdownId} className="mb-4 p-3 border border-gray-200 rounded-md">
                <p className="text-md text-gray-700 font-semibold mb-1">{dropdownItem.name || `Selection ${index + 1}`}</p>
                <div className="text-sm text-gray-500">No options defined for this selection.</div>
              </div>
            );
          }

          return (
            <div key={dropdownId} className="mb-4 p-3 border border-gray-200 rounded-md">
              <label htmlFor={dropdownId} className="block text-md text-gray-700 font-semibold mb-2">
                {dropdownItem.name || `Selection ${index + 1}`}
              </label>
              <select
                id={dropdownId}
                className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
                value={currentDropdownValue || ''}
                onChange={(e) => handleChange(e.target.value, dropdownId)}
              >
                <option value="">-- Select an option --</option>
                {options.map((option, optIndex) => (
                  <option key={option.id || `option-${dropdownId}-${optIndex}`} value={option.text}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRankingQuestion = () => {
    const rankGroups = question.data?.rankGroups;

    if (!Array.isArray(rankGroups) || rankGroups.length === 0) {
      return <div className="text-red-500">This ranking question has no ranking groups defined.</div>;
    }

    if (rankGroups.length === 1) {
      const singleGroup = rankGroups[0];
      /* eslint-disable-next-line */
      const groupId = singleGroup.id || 'default_rank_group';
      const options = singleGroup.options || [];

      if (options.length === 0) {
        return <div className="text-red-500">This ranking group has no options.</div>;
      }

      const currentRanking = (typeof localResponse === 'object' && localResponse !== null) ? localResponse : {};

      return (
        <div className="mb-6">
          <label className="block text-lg text-petrol-blue mb-3">
            {singleGroup.name || question.data.title || question.data.prompt || "Rank the following items"}
          </label>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-500">Enter a number to rank items (e.g., 1 for highest).</p>
            <div className="bg-sky-blue p-3 rounded-md">
              {options.map((option, index) => (
                <div key={option.id || `option-${index}`} className="flex items-center space-x-3 mb-2">
                  <input
                    type="number"
                    min="1"
                    max={options.length}
                    value={(currentRanking && currentRanking[option.text]) || ""}
                    onChange={(e) => {
                      const newRankingForGroup = { ...(currentRanking || {}) };
                      const rankValue = e.target.value ? parseInt(e.target.value) : null;
                      if (rankValue === null || (rankValue >= 1 && rankValue <= options.length)) {
                        newRankingForGroup[option.text] = rankValue === null ? undefined : rankValue;
                        if (newRankingForGroup[option.text] === undefined) {
                          delete newRankingForGroup[option.text];
                        }
                      }
                      handleChange(newRankingForGroup);
                    }}
                    className="w-16 p-1 border border-gray-300 rounded"
                    placeholder="rank"
                  />
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">
          {question.data.title || question.data.prompt || "Please rank items in each group"}
        </label>
        {rankGroups.map((group, groupIndex) => {
          const groupId = group.id || `rankGroup-${groupIndex}`;
          const options = group.options || [];

          if (options.length === 0) {
            return (
              <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
                <p className="text-md text-gray-700 font-semibold mb-1">{group.name || `Group ${groupIndex + 1}`}</p>
                <div className="text-sm text-gray-500">No options defined for this ranking group.</div>
              </div>
            );
          }
          
          const currentGroupRanking = (typeof localResponse === 'object' && localResponse !== null && typeof localResponse[groupId] === 'object')
                                      ? localResponse[groupId]
                                      : {};

          return (
            <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
              <p className="text-md text-gray-700 font-semibold mb-2">{group.name || `Group ${groupIndex + 1}`}</p>
              <p className="text-sm text-gray-500 mb-2">Enter a number to rank items (e.g., 1 for highest).</p>
              <div className="bg-sky-blue p-3 rounded-md">
                {options.map((option, optionIndex) => (
                  <div key={option.id || `option-${groupId}-${optionIndex}`} className="flex items-center space-x-3 mb-2">
                    <input
                      type="number"
                      min="1"
                      max={options.length}
                      value={(currentGroupRanking && currentGroupRanking[option.text]) || ""}
                      onChange={(e) => {
                        const newRankingForGroup = { ...(currentGroupRanking || {}) };
                        const rankValue = e.target.value ? parseInt(e.target.value) : null;
                        if (rankValue === null || (rankValue >= 1 && rankValue <= options.length)) {
                          newRankingForGroup[option.text] = rankValue === null ? undefined : rankValue;
                          if (newRankingForGroup[option.text] === undefined) {
                            delete newRankingForGroup[option.text];
                          }
                        }
                        handleChange(newRankingForGroup, groupId);
                      }}
                      className="w-16 p-1 border border-gray-300 rounded"
                      placeholder="rank"
                    />
                    <span>{option.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMatrixQuestion = () => {
    const matrixGroups = question.data?.matrixGroups;

    if (!Array.isArray(matrixGroups) || matrixGroups.length === 0) {
      return <div className="text-red-500">This matrix question has no matrix groups defined.</div>;
    }

    if (matrixGroups.length === 1) {
      const singleGroup = matrixGroups[0];
      const groupId = singleGroup.id || 'default_matrix_group';
      const verticalItems = singleGroup.verticalItems || [];
      const horizontalItems = singleGroup.horizontalItems || [];

      if (verticalItems.length === 0 || horizontalItems.length === 0) {
        return <div className="text-red-500">Matrix group is missing vertical or horizontal items.</div>;
      }
      
      const currentMatrixResponse = (typeof localResponse === 'object' && localResponse !== null) ? localResponse : {};

      return (
        <div className="mb-6">
          <label className="block text-lg text-petrol-blue mb-3">
            {singleGroup.name || question.data.title || question.data.prompt || "Matrix Question"}
          </label>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border bg-sky-blue/10"></th> {/* Corner cell */}
                  {horizontalItems.map((hItem, hIndex) => (
                    <th key={hItem.id || `h-${hIndex}`} className="p-2 border bg-sky-blue text-center">
                      {hItem.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {verticalItems.map((vItem, vIndex) => (
                  <tr key={vItem.id || `v-${vIndex}`}>
                    <td className="p-2 border font-medium bg-sky-blue/30">{vItem.text}</td>
                    {horizontalItems.map((hItem, hIndex) => {
                      const isSelected = currentMatrixResponse && currentMatrixResponse[vItem.text] === hItem.text;
                      return (
                        <td key={hItem.id || `h-val-${hIndex}`} className="p-2 border text-center">
                          <input
                            type="radio"
                            name={`matrix_row_${groupId}_${vItem.id || vIndex}`}
                            checked={isSelected}
                            onChange={() => {
                              const newResponseForGroup = { ...(currentMatrixResponse || {}) };
                              newResponseForGroup[vItem.text] = hItem.text;
                              handleChange(newResponseForGroup);
                            }}
                            className="form-radio text-petrol-blue h-4 w-4"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">
          {question.data.title || question.data.prompt || "Please complete all matrices"}
        </label>
        {matrixGroups.map((group, groupIndex) => {
          const groupId = group.id || `matrixGroup-${groupIndex}`;
          const verticalItems = group.verticalItems || [];
          const horizontalItems = group.horizontalItems || [];

          if (verticalItems.length === 0 || horizontalItems.length === 0) {
            return (
              <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
                <p className="text-md text-gray-700 font-semibold mb-1">{group.name || `Matrix ${groupIndex + 1}`}</p>
                <div className="text-sm text-red-500">Matrix group is missing vertical or horizontal items.</div>
              </div>
            );
          }

          const currentGroupMatrixResponse = (typeof localResponse === 'object' && localResponse !== null && typeof localResponse[groupId] === 'object')
                                            ? localResponse[groupId]
                                            : {};
          return (
            <div key={groupId} className="mb-6 p-3 border border-gray-200 rounded-md">
              <p className="text-md text-gray-700 font-semibold mb-2">{group.name || `Matrix ${groupIndex + 1}`}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border bg-sky-blue/10"></th> {/* Corner cell */}
                      {horizontalItems.map((hItem, hIndex) => (
                        <th key={hItem.id || `h-${groupId}-${hIndex}`} className="p-2 border bg-sky-blue text-center">
                          {hItem.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {verticalItems.map((vItem, vIndex) => (
                      <tr key={vItem.id || `v-${groupId}-${vIndex}`}>
                        <td className="p-2 border font-medium bg-sky-blue/30">{vItem.text}</td>
                        {horizontalItems.map((hItem, hIndex) => {
                          const isSelected = currentGroupMatrixResponse && currentGroupMatrixResponse[vItem.text] === hItem.text;
                          return (
                            <td key={hItem.id || `h-val-${groupId}-${hIndex}`} className="p-2 border text-center">
                              <input
                                type="radio"
                                name={`matrix_row_${groupId}_${vItem.id || vIndex}`}
                                checked={isSelected}
                                onChange={() => {
                                  const newResponseForThisGroup = { ...(currentGroupMatrixResponse || {}) };
                                  newResponseForThisGroup[vItem.text] = hItem.text;
                                  handleChange(newResponseForThisGroup, groupId);
                                }}
                                className="form-radio text-petrol-blue h-4 w-4"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the appropriate question type with error handling
  try {
    switch (question.type?.toLowerCase()) {
      case 'text':
        return renderTextQuestion();
      case 'number':
        return renderNumberQuestion();
      case 'multiplechoice':
      case 'multiple choice':
        return renderMultiChoiceQuestion();
      case 'checkbox':
        return renderCheckboxQuestion();
      case 'ratingscale':
      case 'rating':
      case 'rating scale':
        return renderRatingQuestion();
      case 'dropdown':
        return renderDropdownQuestion();
      case 'ranking':
        return renderRankingQuestion();
      case 'matrix':
        return renderMatrixQuestion();
      default:
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded">
            <p>Unsupported question type: {question.type}</p>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(question, null, 2)}
            </pre>
          </div>
        );
    }
  } catch (err) {
    console.error("Error rendering question:", err);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <p className="text-red-600 font-bold">Error rendering question</p>
        <p>{err.message}</p>
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(question, null, 2)}
        </pre>
      </div>
    );
  }
}