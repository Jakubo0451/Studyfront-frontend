'use client'
import { useState } from 'react'
import textanswerStyles from '../../styles/questionTypes/textanswer.module.css'
import commonStyles from '../../styles/questionTypes/common.module.css'
import Artifact from './artifact'
import { FaPlus, FaTrash } from "react-icons/fa";

export default function textanswerQ() {
  // State to manage multiple text answer questions
  const [textQuestions, setTextQuestions] = useState([
    { id: 1, question: '' }
  ]);

  // Function to add a new text question
  const addTextQuestion = () => {
    const newId = textQuestions.length + 1;
    setTextQuestions([...textQuestions, { id: newId, question: '' }]);
  };

  // Function to remove a text question
  const removeTextQuestion = (idToRemove) => {
    // Don't remove if it's the last text question
    if (textQuestions.length <= 1) {
      return;
    }
    
    // Remove the text question with the specified ID
    const filteredTextQuestions = textQuestions.filter(textQuestion => textQuestion.id !== idToRemove);
    
    // Renumber the remaining text questions sequentially
    const renumberedTextQuestions = filteredTextQuestions.map((textQuestion, index) => ({
      ...textQuestion,
      id: index + 1
    }));
    
    setTextQuestions(renumberedTextQuestions);
  };

  // Function to handle input changes
  const handleTextQuestionChange = (id, value) => {
    setTextQuestions(textQuestions.map(textQuestion => 
      textQuestion.id === id ? { ...textQuestion, question: value } : textQuestion
    ));
  };

  return (
    <div className={commonStyles.questionType + " question-type"}>
        <h2>Text answer question</h2>
        <div className={commonStyles.questionName}>
          <label htmlFor="questionName">Question title:</label>
          <input type="text" name="questionName" id="questionName" placeholder="Title" />
        </div>
        
        {/* Use the Artifact component in standalone mode */}
        <Artifact mode="standalone" allowMultiple={true} />
        
        {/* Map through text questions and render each one */}
        {textQuestions.map((textQuestion) => (
          <div key={textQuestion.id} className={commonStyles.itemBox}>
              <div className={commonStyles.itemHeader}>
                <label htmlFor={`textQuestion${textQuestion.id}`}>Text Area {textQuestion.id}:</label>
                <button 
                  type="button" 
                  className={commonStyles.removeBtn}
                  onClick={() => removeTextQuestion(textQuestion.id)}
                  disabled={textQuestions.length <= 1}
                >
                  <FaTrash /> Remove
                </button>
              </div>
              <div className={commonStyles.itemGroup}>
                <label htmlFor={`textQuestion${textQuestion.id}`}>Text area label:</label>
                <input 
                  type="text" 
                  name={`textQuestion${textQuestion.id}`} 
                  id={`textQuestion${textQuestion.id}`} 
                  placeholder="Label"
                  value={textQuestion.question}
                  onChange={(e) => handleTextQuestionChange(textQuestion.id, e.target.value)} 
                />
              </div>
          </div>
        ))}
        <button className={commonStyles.addItemBtn} onClick={addTextQuestion}><FaPlus /> Add another text area</button>
    </div>
  )
};