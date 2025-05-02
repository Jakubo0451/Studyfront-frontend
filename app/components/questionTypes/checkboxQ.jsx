import { useState, useEffect } from "react";

const DEFAULT_QUESTION_DATA = { questionText: "", options: [""] };

export default function CheckboxQuestionBuilder({
  onChange,
  questionData = DEFAULT_QUESTION_DATA,
}) {
  const [questionText, setQuestionText] = useState(
    questionData.questionText || ""
  );
  const [options, setOptions] = useState(questionData.options || [""]);

  useEffect(() => {
    setQuestionText((prev) =>
      questionData.questionText !== prev
        ? questionData.questionText || ""
        : prev
    );
    setOptions((prev) =>
      JSON.stringify(questionData.options) !== JSON.stringify(prev)
        ? questionData.options || [""]
        : prev
    );
  }, [questionData]);

  const handleQuestionTextChange = (e) => {
    const updatedQuestionText = e.target.value;
    setQuestionText(updatedQuestionText);
    onChange({ type: "checkbox", questionText: updatedQuestionText, options });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    onChange({ type: "checkbox", questionText, options: updatedOptions });
  };

  const addOption = () => {
    const updatedOptions = [...options, ""];
    setOptions(updatedOptions);
    onChange({ type: "checkbox", questionText, options: updatedOptions });
  };

  const removeOption = (index) => {
    if (options.length <= 1) return; // Prevent removing the last option
  
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    onChange({ type: "checkbox", questionText, options: updatedOptions });
  };
  

  return (
    <div className="border p-4 mb-4">
      <h3>Checkbox Question</h3>
      <label htmlFor="questionText">Question:</label>
      <input
        type="text"
        id="questionText"
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter your question"
        value={questionText}
        onChange={handleQuestionTextChange}
      />
      <label>Options:</label>
      {options.length > 0 &&
        options.map((option, index) => (
          <div key={index} className="flex items-center mb-1">
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      <button
        type="button"
        onClick={addOption}
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
      >
        Add Option
      </button>
    </div>
  );
}
