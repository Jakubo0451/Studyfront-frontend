import { useState, useEffect } from 'react';

export default function QuestionRenderer({ question, onResponse, currentResponse }) {
  const [localResponse, setLocalResponse] = useState(currentResponse);

  useEffect(() => {
    // Only update if values are different and not just because of reference changes
    if (JSON.stringify(localResponse) !== JSON.stringify(currentResponse)) {
      // Direct assignment is fine since we're using the prop value directly
      setLocalResponse(currentResponse);
    }
  }, [currentResponse, question._id]);

  // Better logging to diagnose the exact issue
  console.log('Question data:', {
    type: question.type,
    id: question._id,
    fullData: question.data,
  });

  const handleChange = (value) => {
    setLocalResponse(value);
    onResponse(value);
  };

  // Improved data access with fallbacks for multiple data structures
  const getPrompt = () => {
    if (!question.data) return "Question text not available";
    
    return question.data.title || 
           question.data.prompt || 
           question.data.questionText || 
           `Question ${question._id}`;
  };

  const renderTextQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
      <textarea
        className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
        rows="4"
        value={localResponse || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your answer here..."
      />
    </div>
  );

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
    const options = extractOptions(question, 'multipleChoice');
    
    if (!options || options.length === 0) {
      return <div className="text-red-500">This multiple choice question has no options.</div>;
    }
    
    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-2 rounded-md transition-colors">
              <input
                type="radio"
                name={question._id}
                value={typeof option === 'string' ? option : option.text}
                checked={localResponse === (typeof option === 'string' ? option : option.text)}
                onChange={(e) => handleChange(e.target.value)}
                className="form-radio text-petrol-blue focus:ring-petrol-blue h-5 w-5"
              />
              <span className="text-gray-700">{typeof option === 'string' ? option : option.text}</span>
            </label>
          ))}
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
    const options = extractOptions(question, 'checkbox');
    
    if (!options || options.length === 0) {
      return <div className="text-red-500">This checkbox question has no options.</div>;
    }
    
    // Ensure localResponse is always an array for checkbox questions
    const responseArray = Array.isArray(localResponse) ? localResponse : [];
    
    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        <div className="space-y-3">
          {options.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.text;
            
            return (
              <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-2 rounded-md transition-colors">
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
    // Check if we have valid rating scale data
    if (!question.data?.ratingScales || !question.data.ratingScales.length) {
      return (
        <div className="text-red-500">
          This rating question has no rating scales defined.
        </div>
      );
    }
  
    // Get the first rating scale
    const ratingScale = question.data.ratingScales[0];
    const min = parseInt(ratingScale.min) || 1;
    const max = parseInt(ratingScale.max) || 5;
    
    // Create an array of possible values
    const ratingValues = Array.from(
      { length: max - min + 1 },
      (_, i) => i + min
    );
  
    return (
      <div className="mb-6">
        <label className="block text-lg text-petrol-blue mb-3">{getPrompt()}</label>
        {ratingScale.name && (
          <p className="text-gray-600 mb-2">{ratingScale.name}</p>
        )}
        <div className="flex items-center space-x-2 flex-wrap">
          {ratingValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange(value)}
              className={`w-12 h-12 rounded-full transition-colors duration-300 ${
                localResponse === value
                  ? 'bg-petrol-blue text-white hover:bg-oxford-blue'
                  : 'bg-gray-200 text-gray-700 hover:bg-sky-blue'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDropdownQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">
        {question.data.title || question.data.prompt || "Select an option"}
      </label>
      <select
        className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
        value={localResponse || ''}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">-- Select an option --</option>
        {question.data.dropdowns && question.data.dropdowns[0]?.options?.map((option, index) => (
          <option key={index} value={option.text}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );

  const renderRankingQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">
        {question.data.title || question.data.prompt || "Rank the following items"}
      </label>
      {question.data.rankGroups && question.data.rankGroups[0]?.options?.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-500">Drag items to rank them in order of preference</p>
          <div className="bg-sky-blue p-3 rounded-md">
            {/* For simplicity, we'll just show numbered inputs instead of drag/drop */}
            {question.data.rankGroups[0].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 mb-2">
                <input
                  type="number"
                  min="1"
                  max={question.data.rankGroups[0].options.length}
                  value={(localResponse && localResponse[option.text]) || ""}
                  onChange={(e) => {
                    const newRanking = { ...(localResponse || {}) };
                    newRanking[option.text] = parseInt(e.target.value);
                    handleChange(newRanking);
                  }}
                  className="w-16 p-1 border border-gray-300 rounded"
                />
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMatrixQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">
        {question.data.title || question.data.prompt || "Matrix Question"}
      </label>
      {question.data.matrixGroups && question.data.matrixGroups[0] && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border"></th>
                {question.data.matrixGroups[0].horizontalItems.map((item, index) => (
                  <th key={index} className="p-2 border bg-sky-blue text-center">
                    {item.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.data.matrixGroups[0].verticalItems.map((vItem, vIndex) => (
                <tr key={vIndex}>
                  <td className="p-2 border font-medium bg-sky-blue/30">{vItem.text}</td>
                  {question.data.matrixGroups[0].horizontalItems.map((hItem, hIndex) => {
                    const isSelected = 
                      localResponse && 
                      localResponse[vItem.text] === hItem.text;
                    
                    return (
                      <td key={hIndex} className="p-2 border text-center">
                        <input
                          type="radio"
                          name={`matrix_${vItem.text}`}
                          checked={isSelected}
                          onChange={() => {
                            const newResponse = { ...(localResponse || {}) };
                            newResponse[vItem.text] = hItem.text;
                            handleChange(newResponse);
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
      )}
    </div>
  );

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