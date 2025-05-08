"use client";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

export default function QuestionRenderer({ question, onResponse, currentResponse }) {
  const [response, setResponse] = useState(currentResponse || null);

  // Safety checks for required props
  if (!question) {
    return <div className="p-4 text-red-500">Question data is missing</div>;
  }

  if (typeof onResponse !== 'function') {
    return <div className="p-4 text-red-500">Response handler is missing</div>;
  }

  useEffect(() => {
    if (response !== null) {
      onResponse(response);
    }
  }, [response, onResponse]);

  const handleKeyPress = (event, value) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setResponse(value);
    }
  };

  const renderQuestionByType = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${question._id}-label`}>
            <h3 id={`question-${question._id}-label`} className="text-xl font-medium mb-4">{question.text}</h3>
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${idx}`}
                  name={`question-${question._id}`}
                  value={option}
                  checked={response === option}
                  onChange={() => setResponse(option)}
                  className="mr-3"
                  aria-label={option}
                />
                <label htmlFor={`option-${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      
      case "text":
        return (
          <div>
            <h3 id={`question-${question._id}-label`} className="text-xl font-medium mb-4">{question.text}</h3>
            <textarea
              aria-labelledby={`question-${question._id}-label`}
              className="w-full p-3 border border-gray-300 rounded min-h-32"
              value={response || ""}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your answer here..."
            />
          </div>
        );
      
      case "rating": {
        const maxRating = question.maxRating || 5;
        return (
          <div role="radiogroup" aria-labelledby={`question-${question._id}-label`}>
            <h3 id={`question-${question._id}-label`} className="text-xl font-medium mb-4">{question.text}</h3>
            <div className="flex space-x-4 justify-center">
              {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => setResponse(rating)}
                  onKeyPress={(e) => handleKeyPress(e, rating)}
                  aria-label={`Rating ${rating} of ${maxRating}`}
                  aria-pressed={response === rating}
                  className={`w-12 h-12 rounded-full ${
                    response === rating
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        );
      }
      
      case "likert": {
        const scale = question.likertScale || [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree"
        ];
        
        return (
          <div role="radiogroup" aria-labelledby={`question-${question._id}-label`}>
            <h3 id={`question-${question._id}-label`} className="text-xl font-medium mb-4">{question.text}</h3>
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              {scale.map((label, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <button
                    onClick={() => setResponse(idx + 1)}
                    onKeyPress={(e) => handleKeyPress(e, idx + 1)}
                    aria-label={label}
                    aria-pressed={response === idx + 1}
                    className={`w-10 h-10 rounded-full mb-2 ${
                      response === idx + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {idx + 1}
                  </button>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      default:
        return (
          <div className="text-red-500" role="alert">
            Unknown question type: {question.type || "undefined"}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-md">
      {renderQuestionByType()}
    </div>
  );
}

QuestionRenderer.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['multiple_choice', 'text', 'rating', 'likert']).isRequired,
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    maxRating: PropTypes.number,
    likertScale: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onResponse: PropTypes.func.isRequired,
  currentResponse: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};
