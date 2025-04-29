import React, { useState } from "react";

export default function CheckboxQuestionBuilder({ onChange }) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([""]);

  const updateParent = (newQuestion, newOptions) => {
    onChange({
      type: "checkbox",
      questionText: newQuestion,
      options: newOptions,
    });
  };

  const handleQuestionTextChange = (e) => {
    setQuestionText(e.target.value);
    updateParent(e.target.value, options);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updateParent(questionText, newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    updateParent(questionText, newOptions);
  };

  return (
    <div>
      <label>
        Question:
        <input
          type="text"
          value={questionText}
          onChange={handleQuestionTextChange}
          placeholder="Enter your question"
        />
      </label>

      <fieldset>
        <legend>Options:</legend>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <button type="button" onClick={() => removeOption(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption}>
          Add Option
        </button>
      </fieldset>
    </div>
  );
}
