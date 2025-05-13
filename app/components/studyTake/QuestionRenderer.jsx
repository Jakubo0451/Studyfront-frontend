import { useState } from 'react';

export default function QuestionRenderer({ question, onResponse, currentResponse }) {
  const [localResponse, setLocalResponse] = useState(currentResponse);

  const handleChange = (value) => {
    setLocalResponse(value);
    onResponse(value);
  };

  const renderTextQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">{question.data.prompt || question.data.questionText}</label>
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
      <label className="block text-lg text-petrol-blue mb-3">{question.data.prompt || question.data.questionText}</label>
      <input
        type="number"
        className="w-full p-3 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
        value={localResponse || ''}
        onChange={(e) => handleChange(Number(e.target.value))}
        placeholder="Enter a number"
      />
    </div>
  );

  const renderMultiChoiceQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">{question.data.prompt || question.data.questionText}</label>
      <div className="space-y-3">
        {question.data.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-2 rounded-md transition-colors">
            <input
              type="radio"
              name={question._id}
              value={option}
              checked={localResponse === option}
              onChange={(e) => handleChange(e.target.value)}
              className="form-radio text-petrol-blue focus:ring-petrol-blue h-5 w-5"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCheckboxQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">{question.data.prompt || question.data.questionText}</label>
      <div className="space-y-3">
        {question.data.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-sky-blue p-2 rounded-md transition-colors">
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
              className="form-checkbox text-petrol-blue focus:ring-petrol-blue h-5 w-5"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderRatingQuestion = () => (
    <div className="mb-6">
      <label className="block text-lg text-petrol-blue mb-3">{question.data.prompt || question.data.questionText}</label>
      <div className="flex items-center space-x-4">
        {Array.from({ length: question.data.maxRating }, (_, i) => i + 1).map((value) => (
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