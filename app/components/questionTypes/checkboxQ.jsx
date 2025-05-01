import { useState } from "react";

export default function CheckboxQuestionBuilder({ onChange }) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([""]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async (updatedQuestionText, updatedOptions) => {
    const questionData = {
      type: "checkbox",
      questionText: updatedQuestionText,
      options: updatedOptions,
    };

    try {
      const response = await fetch("/api/save-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save question");
      }

      const result = await response.json();
      console.log("Question saved successfully:", result);
      setSuccessMessage("Question saved successfully");
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const updateParent = (newQuestion, newOptions) => {
    onChange({
      type: "checkbox",
      questionText: newQuestion,
      options: newOptions,
    });
  };

  const handleQuestionTextChange = (e) => {
    const updatedQuestionText = e.target.value;
    setQuestionText(updatedQuestionText);
    updateParent(updatedQuestionText, options);
    handleSave(updatedQuestionText, options); // Automatically save changes
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    updateParent(questionText, updatedOptions);
    handleSave(questionText, updatedOptions); // Automatically save changes
  };

  const addOption = () => {
    const updatedOptions = [...options, ""];
    setOptions(updatedOptions);
    handleSave(questionText, updatedOptions); // Automatically save changes
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    handleSave(questionText, updatedOptions); // Automatically save changes
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your question"
        value={questionText}
        onChange={handleQuestionTextChange}
      />
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          <button onClick={() => removeOption(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addOption}>Add Option</button>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}