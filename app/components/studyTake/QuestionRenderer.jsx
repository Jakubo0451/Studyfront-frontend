import { useState, useEffect, useCallback } from 'react';
import commonStyles from '../../styles/questionRenderer/common.module.css';
import backendUrl from 'environment';
import { IoExpand } from "react-icons/io5";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator } from 'react-icons/md';

const ArtifactDisplay = ({ artifact }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!artifact) return null;

  const handleExpandArtifact = () => {
    setIsExpanded(true);
  };
  
  const handleCloseArtifact = () => {
    setIsExpanded(false);
  };

  const renderContent = () => {
  // Determine how to render based on contentType
  if (artifact.contentType && artifact.contentType.startsWith('image/')) {
    return (
    <div className="flex">
      <img 
        src={artifact.imageUrl} 
        alt={artifact.name || artifact.label || 'Image artifact'} 
        className="max-w-full h-auto object-contain object-bottom bg-sky-blue"
      />
    </div>
    );
  } else if (artifact.contentType && artifact.contentType.startsWith('audio/')) {
    return (
      <div className="flex flex-col items-center bg-sky-blue pt-2 px-2">
        <img src="/audio.png" alt="Audio icon" className="w-16 h-16 mb-2" />
        <audio controls className="max-w-full">
          <source src={`${backendUrl}/api/upload/${artifact.id}`} type={artifact.contentType} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  } else if (artifact.contentType && artifact.contentType.startsWith('video/')) {
    return (
      <div className="flex flex-col items-center bg-sky-blue">
        <video controls className="max-w-full max-h-64">
          <source src={`${backendUrl}/api/upload/${artifact.id}`} type={artifact.contentType} />
          Your browser does not support the video element.
        </video>
      </div>
    );
  } else if (artifact.contentType === 'application/pdf') {
    return (
      <div className="flex flex-col items-center bg-sky-blue">
        <iframe 
          src={`${backendUrl}/api/upload/${artifact.id}`}
          className="w-full h-64 border-0"
          title={artifact.name || artifact.label || "PDF document"}
        />
      </div>
    );
  } else {
    // Default display for other file types
    return (
      <div className="flex flex-col items-center">
        <img src={artifact.imageUrl || "/file.png"} alt="File" className="w-16 h-16 mb-2" />
        <p>{artifact.name || artifact.label || 'File attachment'}</p>
      </div>
    );
  }
};

return (
  <div className="rounded-md mb-4 grid justify-center max-w-md mx-auto">
    {renderContent()}
    <h4 className="mb-2 text-center bg-sky-blue px-4 py-2 rounded rounded-t-none wrap-break-word overflow-hidden flex flex-col items-center">
      {artifact.label && (<>{artifact.label}</>)}
      {(artifact.contentType && (artifact.contentType.startsWith('image/') || 
                               artifact.contentType.startsWith('video/') || 
                               artifact.contentType === 'application/pdf')) && (
        <button 
          onClick={handleExpandArtifact} 
          className="text-md mt-1 flex items-center justify-center bg-petrol-blue text-white p-2 rounded hover:bg-oxford-blue transition duration-300" 
          title={`Enlarge ${
            artifact.contentType.startsWith('image/') ? 'image' : 
            artifact.contentType.startsWith('video/') ? 'video' : 'PDF'
          }`}
        >
          <IoExpand />
        </button>
      )}
    </h4>
    
    {isExpanded && (
      <div className="fixed inset-0 bg-black/70 bg-opacity-75 flex flex-col items-center justify-center z-50" onClick={handleCloseArtifact}>
        {artifact.contentType && artifact.contentType.startsWith('image/') ? (
          <img 
            src={artifact.imageUrl}
            alt="Expanded artifact"
            className="max-w-[90%] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        ) : artifact.contentType && artifact.contentType.startsWith('video/') ? (
          <video 
            controls 
            className="max-w-[90%] max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <source src={`${backendUrl}/api/upload/${artifact.id}`} type={artifact.contentType} />
            Your browser does not support the video element.
          </video>
        ) : artifact.contentType && artifact.contentType === 'application/pdf' ? (
          <iframe
            src={`${backendUrl}/api/upload/${artifact.id}`}
            className="w-[90%] h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          />
        ) : null}
        <button onClick={handleCloseArtifact} className="bg-petrol-blue text-white mt-2 px-4 py-2 rounded hover:bg-oxford-blue transition duration-300">Close preview</button>
      </div>
    )}
  </div>
);
};

// eslint-disable-next-line
const expandImage = (imageUrl) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <img src={imageUrl}
        alt="Expanded artifact"
        className="max-w-full max-h-full object-contain"
        onClick={() => {
          const modal = document.querySelector('.fixed.inset-0');
          modal.classList.add('hidden');
        }}
      />
      </div>
  )
}

// Component for drag-and-drop ranking items
const SortableRankingItem = ({ id, text, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    modifiers: [restrictToVerticalAxis],
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center p-2 mb-2 bg-white border border-gray-200 rounded-md shadow-sm"
    >
      <div className="mr-3 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <MdDragIndicator className="text-petrol-blue text-xl" />
      </div>
      <span className="flex-grow">{text}</span>
      <span className="bg-petrol-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm ml-2">
        {index + 1}
      </span>
    </div>
  );
};

const SingleRankingGroup = ({
  group,
  groupId,
  groupIndex,
  initialItems,
  localResponse,
  handleChange,
  sensors
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let sortedItems = [...initialItems];

    if (typeof localResponse === 'object' && localResponse !== null) {
      const groupResponse = groupIndex === 0
        ? localResponse
        : (localResponse[groupId] || {});

      const rankedItems = initialItems.filter(item =>
        groupResponse[item.text] !== undefined
      );

      const unrankedItems = initialItems.filter(item =>
        groupResponse[item.text] === undefined
      );

      rankedItems.sort((a, b) =>
        groupResponse[a.text] - groupResponse[b.text]
      );

      sortedItems = [...rankedItems, ...unrankedItems];
    }

    setItems(sortedItems);
  }, [initialItems, localResponse, groupId]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems(currentItems => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id);
        const newIndex = currentItems.findIndex(item => item.id === over.id);

        const newItems = arrayMove(currentItems, oldIndex, newIndex);

        const newResponse = {};
        newItems.forEach((item, index) => {
          newResponse[item.text] = index + 1;
        });

        setTimeout(() => {
          if (groupIndex === 0 && group.options.length === initialItems.length) {
            handleChange(newResponse);
          } else {
            handleChange(newResponse, groupId);
          }
        }, 0);

        return newItems;
      });
    }
  }, [groupId, group, initialItems, handleChange, groupIndex]);

  return (
    <div key={groupId} className={groupIndex > 0 ? "mb-4" : ""}>
      {groupIndex > 0 && (
        <>
          <p className="text-md text-gray-700 font-semibold mb-1">{group.label || `Group ${groupIndex + 1}`}:</p>
          
        </>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items.map(item => item.id)}>
          <div className="bg-sky-blue p-3 rounded-md touch-none">
            <p className="text-sm text-petrol-blue mb-2">Drag items to rank them from highest (top) to lowest (bottom).</p>
            {items.map((item, index) => (
              <SortableRankingItem
                key={item.id}
                id={item.id}
                text={item.text}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  ); 
};

// Main component
export default function QuestionRenderer({ question, onResponse, currentResponse }) {
  const [localResponse, setLocalResponse] = useState(currentResponse);

  useEffect(() => {
    setLocalResponse(currentResponse);
  }, [currentResponse, question._id]);

  // Sensors for drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  console.log('Question data:', {
    type: question.type,
    id: question._id,
    fullData: question.data,
    currentLocalResponse: localResponse,
  });

  // Add this new function to render artifacts for a question
  const renderArtifacts = () => {
    if (!question.data || !question.data.artifacts || !Array.isArray(question.data.artifacts) || question.data.artifacts.length === 0) {
      return null;
    }
    
    return (
      <div className="artifacts-container mt-4 mb-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] justify-center gap-2">
          {question.data.artifacts.map((artifact, index) => (
            <ArtifactDisplay key={artifact.id || `artifact-${index}`} artifact={artifact} />
          ))}
        </div>
      </div>
    );
  };

  // Now let's update each render function to include artifacts
  // I'll just show an example for one function, and you should apply the pattern to others

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

  const renderTextQuestion = () => {
  const textAreas = question.data?.textAreas;

  if (!Array.isArray(textAreas) || textAreas.length <= 1) {
    const textAreaId = textAreas?.[0]?.id || 'default';
    const singleLabel = textAreas?.[0]?.label || "Input";
    const valueForSingleTextArea = typeof localResponse === 'object' && localResponse !== null 
                                    ? (localResponse[textAreaId] || '') 
                                    : (typeof localResponse === 'string' ? localResponse : '');

    return (
      <div className={commonStyles.questionContainer}>
        
        {/* Add artifacts display */}
        {renderArtifacts()}
        
        <div className="mb-4">
          {textAreas?.[0]?.label && (
            <label htmlFor={textAreaId} className="block text-md text-oxford-blue mb-1 font-semibold">
              {singleLabel}:
            </label>
          )}
          <textarea
            id={textAreaId}
            className="w-full p-3 border-2 border-petrol-blue bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            rows="3"
            value={valueForSingleTextArea}
            onChange={(e) => handleChange(e.target.value, textAreaId)}
            placeholder={`Enter response for ${singleLabel}...`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={commonStyles.questionContainer}>
      
      {/* Add artifacts display */}
      {renderArtifacts()}
      
      {textAreas.map((area) => (
        <div key={area.id} className="mb-4">
          <label htmlFor={area.id} className="block text-md text-oxford-blue mb-1 font-semibold">
            {area.label || `Input for ${area.id}`}:
          </label>
          <textarea
            id={area.id}
            className="w-full p-3 border-2 border-petrol-blue bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
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


  const renderMultiChoiceQuestion = () => {
    const choiceGroups = question.data?.choiceGroups;

    if (Array.isArray(choiceGroups) && choiceGroups.length > 1) {
      return (
        <div className="mb-6">
          
          {/* Add artifacts display */}
          {renderArtifacts()}
          
          {choiceGroups.map((group, groupIndex) => {
            const groupId = group.id || `choiceGroup-${groupIndex}`;
            const options = group.options || [];

            if (options.length === 0) {
              return (
                <div key={groupId} className="mb-4 p-3 border border-gray-200 rounded-md">
                  <p className="text-md text-gray-700 font-semibold mb-1">{group.label || `Group ${groupIndex + 1}`}:</p>
                  <div className="text-sm text-gray-500">No options defined for this choice group.</div>
                </div>
              );
            }

            const currentGroupSelection = (typeof localResponse === 'object' && localResponse !== null)
                                          ? localResponse[groupId]
                                          : undefined;

            return (
              <div key={groupId} className="mb-4 p-3 rounded-md flex flex-col items-center">
                {group.label && <p className="text-md text-oxford-blue font-semibold mb-2">{group.label}:</p>}
                <div className="space-y-2">
                  {options.map((option, optionIndex) => {
                    const optionValue = typeof option === 'string' ? option : option.text;
                    const optionId = option.id || `option-${groupId}-${optionIndex}`;
                    const radioGroupName = `${question._id}_${groupId}`; 
                    return (
                      <label key={optionId} className="px-2 py-1 flex items-center space-x-3 cursor-pointer hover:bg-sky-blue rounded-md transition-colors">
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

  const groupName = (Array.isArray(choiceGroups) && choiceGroups.length === 1)
                    ? choiceGroups[0].label || choiceGroups[0].name
                    : null;

  return (
    <div className="mb-6">
      
      {/* Add artifacts display */}
      {renderArtifacts()}
      
      <div className="mb-4 rounded-md flex flex-col items-center">
        {groupName && (
          <p className="text-md text-oxford-blue font-semibold mb-2">{groupName}:</p>
        )}
        <div className="space-y-2">
          {singleOptions.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.text;
            return (
              <label 
                key={option.id || `option-${singleGroupId}-${index}`} 
                className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue px-2 py-1 rounded-md transition-colors"
              >
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
          
          
          {/* Add artifacts display */}
          {renderArtifacts()}
          
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
              <div key={groupId} className="mb-4 p-3 flex flex-col items-center rounded-md">
                {group.label && <p className="text-md text-oxford-blue font-semibold mb-2">{group.label}:</p>}
                <div className="space-y-2">
                  {groupOptions.map((option, optionIndex) => {
                    const optionValue = typeof option === 'string' ? option : option.text;
                    const optionId = option.id || `option-${groupId}-${optionIndex}`;
                    return (
                      <label key={optionId} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue py-1 px-2 rounded-md transition-colors">
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
  const singleGroupId = checkboxGroups && checkboxGroups.length === 1 
    ? (checkboxGroups[0].id || 'default_checkbox_group') 
    : 'default_checkbox_group';
  
  const groupName = checkboxGroups && checkboxGroups.length === 1 
    ? checkboxGroups[0].label 
    : null;

  return (
    <div className="mb-6">

      {/* Add artifacts display */}
      {renderArtifacts()}
      
      <div className="mb-4 flex flex-col items-center rounded-md">
        {groupName && (
          <p className="text-md text-oxford-blue font-semibold mb-2">{groupName}:</p>
        )}
        <div className="space-y-2">
          {singleGroupOptions.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.text;
            const optionId = option.id || `option-${singleGroupId}-${index}`;
            return (
              <label 
                key={optionId} 
                className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue py-1 px-2 rounded-md transition-colors"
              >
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
  
  // Calculate fill percentage for the slider
  const fillPercentage = currentVal !== undefined && currentVal !== null 
    ? ((currentVal - min) / (max - min)) * 100 
    : 0;

  return (
    <div className="mb-6">
      
      
      {/* Add artifacts display */}
      {renderArtifacts()}
      
      {ratingScale.name && (
        <p className="text-md text-oxford-blue mb-1 font-semibold">{ratingScale.name}:</p>
      )}
      <div className="flex flex-col items-center">
        <div className="w-full">
          <input
            type="range"
            min={min}
            max={max}
            value={currentVal === undefined || currentVal === null ? min : currentVal}
            onChange={(e) => handleChange(parseInt(e.target.value), scaleId)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-petrol-blue) 0%, var(--color-petrol-blue) ${fillPercentage}%, var(--color-sky-blue) ${fillPercentage}%, var(--color-sky-blue) 100%)`
            }}
          />
        </div>
        <div className="flex justify-between w-full px-1 text-md text-oxford-blue">
          <span>{min}</span>
          <span>{max}</span>
        </div>
        <span className="text-lg text-black bg-sky-blue px-3 py-1 rounded">Selected: <span className="font-bold">{displayValue}</span></span>
      </div>
    </div>
  );
}

  return (
    <div className="mb-6">
      {/* Add artifacts display */}
      {renderArtifacts()}
      
      {ratingScales.map((ratingScale, index) => {
        const scaleId = ratingScale.id || `ratingScale-${index}`;
        const min = parseInt(ratingScale.min) || 1;
        const max = parseInt(ratingScale.max) || 5;
        
        const currentScaleResponse = (typeof localResponse === 'object' && localResponse !== null) 
                                     ? localResponse[scaleId] 
                                     : undefined;
        const displayValue = currentScaleResponse !== null && currentScaleResponse !== undefined ? currentScaleResponse : '';
        
        // Calculate fill percentage for each slider
        const fillPercentage = currentScaleResponse !== undefined && currentScaleResponse !== null 
          ? ((currentScaleResponse - min) / (max - min)) * 100 
          : 0;

        return (
          <div key={scaleId} className="mb-4">
            {ratingScale.name && (
              <p className="text-md text-oxford-blue mb-1 font-semibold">{ratingScale.name}:</p>
            )}
            <div className="flex flex-col items-center">
              <div className="w-full">
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={currentScaleResponse === undefined || currentScaleResponse === null ? min : currentScaleResponse}
                  onChange={(e) => handleChange(parseInt(e.target.value), scaleId)}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-petrol-blue) 0%, var(--color-petrol-blue) ${fillPercentage}%, var(--color-sky-blue) ${fillPercentage}%, var(--color-sky-blue) 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between w-full px-1 text-md text-oxford-blue">
                <span>{min}</span>
                <span>{max}</span>
              </div>
              <span className="text-lg text-black bg-sky-blue px-3 py-1 rounded">Selected: <span className="font-bold">{displayValue}</span></span>
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
        
        {/* Add artifacts display */}
        {renderArtifacts()}
        
        <div className="mb-4 p-3 border border-gray-200 rounded-md">
          <label htmlFor={dropdownId} className="block text-md text-oxford-blue font-semibold mb-2">
            {singleDropdown.label || singleDropdown.name || "Selection"}:
          </label>
          <select
            id={dropdownId}
            className="w-full p-3 border-2 border-petrol-blue bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
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
      </div>
    );
  }

  return (
    <div className="mb-6">
      
      {/* Add artifacts display */}
      {renderArtifacts()}
      
      {dropdowns.map((dropdownItem, index) => {
        const dropdownId = dropdownItem.id || `dropdown-${index}`;
        const options = dropdownItem.options || [];
        const currentDropdownValue = (typeof localResponse === 'object' && localResponse !== null)
                                     ? localResponse[dropdownId]
                                     : undefined;
        
        if (options.length === 0) {
          return (
            <div key={dropdownId} className="mb-4 p-3 border rounded-md">
              <p className="text-md text-gray-700 font-semibold mb-1">{dropdownItem.name || `Selection ${index + 1}`}</p>
              <div className="text-sm text-gray-500">No options defined for this selection.</div>
            </div>
          );
        }

        return (
          <div key={dropdownId} className="mb-4 p-3 border border-gray-200 rounded-md">
            <label htmlFor={dropdownId} className="block text-md text-oxford-blue font-semibold mb-2">
              {dropdownItem.label || `Selection ${index + 1}`}:
            </label>
            <select
              id={dropdownId}
              className="w-full p-3 border-2 border-petrol-blue bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
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
    const currentRanking = (typeof localResponse === 'object' && localResponse !== null) ? localResponse : {};

    if (!Array.isArray(rankGroups) || rankGroups.length === 0) {
      return <div className="text-red-500">This ranking question has no ranking groups defined.</div>;
    }

    if (rankGroups.length === 1) {
      const singleGroup = rankGroups[0];
      const groupId = singleGroup.id || 'default_rank_group';
      const options = singleGroup.options || [];

      if (options.length === 0) {
        return <div className="text-red-500">This ranking group has no options.</div>;
      }

      // Transform options into a sorted array for dragging
      const initialItems = options.map(option => ({
        id: option.id || `option-${option.text}`,
        text: option.text
      }));

      return (
        <div className="mb-6">

          {/* Add artifacts display */}
          {renderArtifacts()}

          <label className="block text-md text-oxford-blue font-semibold">
            {singleGroup.label || "Please rank items in this group"}:
          </label>

          <div className="mt-1">
            <SingleRankingGroup
              group={singleGroup}
              groupId={groupId}
              groupIndex={0}
              initialItems={initialItems}
              localResponse={currentRanking}
              //localResponse={localResponse}
              handleChange={handleChange}
              sensors={sensors}
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="mb-6">
        
        {/* Add artifacts display */}
        {renderArtifacts()}
        
        {rankGroups.map((group, groupIndex) => {
          const groupId = group.id || `rankGroup-${groupIndex}`;
          const options = group.options || [];

          if (options.length === 0) {
            return (
              <div key={groupId} className="mb-4 p-3 border rounded-md">
                <p className="text-md text-gray-700 font-semibold mb-1">{group.label || `Group ${groupIndex + 1}`}:</p>
                <div className="text-sm text-gray-500">No options defined for this ranking group.</div>
              </div>
            );
          }
          
          // Transform options into a sorted array for dragging
          const initialItems = options.map(option => ({
            id: option.id || `option-${groupId}-${option.text}`,
            text: option.text
          }));

          return (
            <SingleRankingGroup 
              key={groupId}
              group={group}
              groupId={groupId}
              groupIndex={groupIndex + 1} // +1 because 0 is special-cased for single groups
              initialItems={initialItems}
              localResponse={localResponse}
              handleChange={handleChange}
              sensors={sensors}
            />
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
          
          {/* Add artifacts display */}
          {renderArtifacts()}
          
          <label className="block text-md text-oxford-blue font-semibold mb-2">
            {singleGroup.label || "Please select an option for each item"}:
          </label>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border bg-sky-blue/10"></th>
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
        
        {/* Add artifacts display */}
        {renderArtifacts()}
        
        {matrixGroups.map((group, groupIndex) => {
          const groupId = group.id || `matrixGroup-${groupIndex}`;
          const verticalItems = group.verticalItems || [];
          const horizontalItems = group.horizontalItems || [];

          if (verticalItems.length === 0 || horizontalItems.length === 0) {
            return (
              <div key={groupId} className="mb-4 p-3 border rounded-md">
                <p className="text-md text-gray-700 font-semibold mb-1">{group.name || `Matrix ${groupIndex + 1}`}</p>
                <div className="text-sm text-red-500">Matrix group is missing vertical or horizontal items.</div>
              </div>
            );
          }

          const currentGroupMatrixResponse = (typeof localResponse === 'object' && localResponse !== null && typeof localResponse[groupId] === 'object')
                                            ? localResponse[groupId]
                                            : {};
          return (
            <div key={groupId} className="mb-6 rounded-md">
              <p className="text-md text-oxford-blue font-semibold mb-2">{group.label || `Matrix ${groupIndex + 1}`}:</p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-petrol-blue bg-sky-blue/10"></th>
                      {horizontalItems.map((hItem, hIndex) => (
                        <th key={hItem.id || `h-${groupId}-${hIndex}`} className="p-2 border border-petrol-blue bg-sky-blue text-center font-normal">
                          {hItem.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {verticalItems.map((vItem, vIndex) => (
                      <tr key={vItem.id || `v-${groupId}-${vIndex}`}>
                        <td className="p-2 border border-petrol-blue bg-sky-blue/50">{vItem.text}</td>
                        {horizontalItems.map((hItem, hIndex) => {
                          const isSelected = currentGroupMatrixResponse && currentGroupMatrixResponse[vItem.text] === hItem.text;
                          return (
                            <td key={hItem.id || `h-val-${groupId}-${hIndex}`} className="p-2 border border-petrol-blue text-center">
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
            
            {/* Add artifacts display */}
            {renderArtifacts()}
            
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