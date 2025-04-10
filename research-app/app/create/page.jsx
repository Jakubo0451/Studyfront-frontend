"use client";
import React, { useState, useEffect } from "react";
import Header from '../components/header/Header.jsx';
import SideBar from "../components/studyCreator/sideBar.jsx";
import { useSearchParams, useRouter } from 'next/navigation';

// These are some dummy questions
const TextQuestionDisplay = ({ question, onQuestionDataChange, onFileUpload }) => (
  <div className="border p-4 mb-4">
    <h3>Text Input Question</h3>
    <label htmlFor={`prompt-${question.id}`}>Prompt:</label>
    <input
      type="text"
      id={`prompt-${question.id}`}
      className="w-full border rounded p-2 mb-2"
      value={question.data?.prompt || ''}
      onChange={(e) => onQuestionDataChange(question.id, { ...question.data, prompt: e.target.value })}
    />
    <input type="file" onChange={(e) => onFileUpload(question.id, e.target.files[0])} />
    {question.file && <p>Selected File: {question.file.name}</p>}
  </div>
);

const MultipleChoiceQuestionDisplay = ({ question, onQuestionDataChange, onFileUpload }) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...(question.data?.options || [])];
    newOptions[index] = value;
    onQuestionDataChange(question.id, { ...question.data, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.data?.options || []), ''];
    onQuestionDataChange(question.id, { ...question.data, options: newOptions });
  };

  return (
    <div className="border p-4 mb-4">
      <h3>Multiple Choice Question</h3>
      <label htmlFor={`prompt-${question.id}`}>Prompt:</label>
      <input
        type="text"
        id={`prompt-${question.id}`}
        className="w-full border rounded p-2 mb-2"
        value={question.data?.prompt || ''}
        onChange={(e) => onQuestionDataChange(question.id, { ...question.data, prompt: e.target.value })}
      />
      <label>Options:</label>
      {(question.data?.options || []).map((option, index) => (
        <input
          key={index}
          type="text"
          className="w-full border rounded p-2 mb-1"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <button onClick={handleAddOption} className="bg-green-500 text-white rounded px-2 py-1 mt-2">Add Option</button>
      <input type="file" onChange={(e) => onFileUpload(question.id, e.target.files[0])} />
      {question.file && <p>Selected File: {question.file.name}</p>}
    </div>
  );
};

export default function CreateStudyPage() {
  const [study, setStudy] = useState(null);
  const searchParams = useSearchParams();
  const editStudyId = searchParams.get('studyId');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudyDetails = async () => {
      if (editStudyId) {
        try {
          const response = await fetch(`/api/studies/${editStudyId}`);
          if (response.ok) {
            const data = await response.json();
            setStudy(data);
            setQuestions(data.question || []);
            if (data.question && data.question.length > 0) {
              setSelectedQuestionIndex(0);
            }
          } else {
            console.error('Failed to fetch study details for editing');
          }
        } catch (error) {
          console.error('Error fetching study details:', error);
        }
      }
    };

    fetchStudyDetails();
  }, [editStudyId]);

  const handleAddQuestion = (type) => {
    const newQuestion = { id: Date.now(), type: type, data: {}, file: null };
    setQuestions([...questions, newQuestion]);
    if (questions.length === 0) {
      setSelectedQuestionIndex(0);
    }
  };

  const handleQuestionSelect = (index) => {
    setSelectedQuestionIndex(index);
  };

  const handleQuestionDataChange = (questionId, newData) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, data: newData } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleFileUpload = (questionId, file) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, file: file } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleSaveQuestions = async () => {
    if (!editStudyId) {
      console.error('Study ID not found for saving questions.');
      return;
    }

    try {
      const response = await fetch(`/api/studies/${editStudyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questions }),
      });

      if (response.ok) {
        console.log('Questions saved successfully');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Error saving questions:', errorData.error || 'Failed to save questions.');
      }
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };

  if (!editStudyId) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">Please select a study to edit from the dashboard.</p>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">Loading study details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex h-full flex-row">
        <SideBar questions={questions} onQuestionSelect={handleQuestionSelect} onAddQuestion={handleAddQuestion} />
        <div className="flex-1 p-4">
          <h2 className="text-xl font-semibold mb-4">Edit Study: {study.title}</h2>

          {selectedQuestionIndex !== null && questions[selectedQuestionIndex] && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Question Details</h3>
              {questions[selectedQuestionIndex].type === 'text' && (
                <TextQuestionDisplay
                  question={questions[selectedQuestionIndex]}
                  onQuestionDataChange={handleQuestionDataChange}
                  onFileUpload={handleFileUpload}
                />
              )}
              {questions[selectedQuestionIndex].type === 'multipleChoice' && (
                <MultipleChoiceQuestionDisplay
                  question={questions[selectedQuestionIndex]}
                  onQuestionDataChange={handleQuestionDataChange}
                  onFileUpload={handleFileUpload}
                />
              )}
            </div>
          )}

          {selectedQuestionIndex === null && questions.length > 0 && (
            <p>Select a question from the sidebar to view and edit its details.</p>
          )}

          {selectedQuestionIndex === null && questions.length === 0 && (
            <p>Click "Add Item" in the sidebar to add your first question.</p>
          )}

          <button onClick={handleSaveQuestions} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Save Questions
          </button>
        </div>
      </div>
    </div>
  );
}