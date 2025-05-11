import { useState } from 'react';

export default function QuestionRenderer({ question, onResponse, currentResponse }) {
  const [localResponse, setLocalResponse] = useState(currentResponse);

  const handleChange = (value) => {
    setLocalResponse(value);
    onResponse(value);
  };

  const renderTextQuestion = () => (
    <div className="mb-4">
      <label className="block text-lg mb-2">{question.data.prompt || question.data.questionText}</label>
      <textarea
        className="w-full p-2 border rounded-md"
        rows="4"
        value={localResponse || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your answer here..."
      />
    </div>
  );

  const renderNumberQuestion = () => (
    <div className="mb-4">
      <label className="block text-lg mb-2">{question.data.prompt || question.data.questionText}</label>
      <input
        type="number"
        className="w-full p-2 border rounded-md"
        value={localResponse || ''}
        onChange={(e) => handleChange(Number(e.target.value))}
        placeholder="Enter a number"
      />
    </div>
  );

  const renderMultiChoiceQuestion = () => (
    <div className="mb-4">
      <label className="block text-lg mb-2">{question.data.prompt || question.data.questionText}</label>
      <div className="space-y-2">
        {question.data.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={question._id}
              value={option}
              checked={localResponse === option}
              onChange={(e) => handleChange(e.target.value)}
              className="form-radio"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCheckboxQuestion = () => (
    <div className="mb-4">
      <label className="block text-lg mb-2">{question.data.prompt || question.data.questionText}</label>
      <div className="space-y-2">
        {question.data.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              value={option}
              checked={(localResponse || []).includes(option)}
              onChange={(e) => {
                const newResponse = e.target.checked
                  ? [...(localResponse || []), option]
                  : (localResponse || []).filter(item => item !== option);
                handleChange(newResponse);
              }}
              className="form-checkbox"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderRatingQuestion = () => (
    <div className="mb-4">
      <label className="block text-lg mb-2">{question.data.prompt || question.data.questionText}</label>
      <div className="flex items-center space-x-4">
        {Array.from({ length: question.data.maxRating }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleChange(value)}
            className={`w-10 h-10 rounded-full ${
              localResponse === value 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );

  // Add debugging log to check question data
  console.log('Question data:', question);

  switch (question.type) {
    case 'text':
      return renderTextQuestion();
    case 'number':
      return renderNumberQuestion();
    case 'multiChoice':
      return renderMultiChoiceQuestion();
    case 'checkbox':
      return renderCheckboxQuestion();
    case 'ratingScale':
      return renderRatingQuestion();
    default:
      return <div>Unsupported question type: {question.type}</div>;
  }
}