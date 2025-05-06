/* eslint-disable */

"use client";
import { useState, useEffect } from "react";
import Header from "@/components/header/Header.jsx";
import SideBar from "@/components/studyCreator/sideBar.jsx";
import CheckboxQuestionBuilder from "@/components/questionTypes/checkboxQ"; // Added
import { useSearchParams,  useRouter } from "next/navigation";
import backendUrl from "environment";
import RatingScaleQuestionBuilder from "@/components/questionTypes/ratingQ"; // Add this import

// These are some dummy questions
const TextQuestionDisplay = ({
  question,
  onQuestionDataChange,
  onFileUpload,
}) => (
  <div className="border p-4 mb-4">
    <h3>Text Input Question</h3>
    <label htmlFor={`prompt-${question.id}`}>Prompt:</label>
    <input
      type="text"
      id={`prompt-${question.id}`}
      className="w-full border rounded p-2 mb-2"
      value={question.data?.prompt || ""}
      onChange={(e) =>
        onQuestionDataChange(question.id, {
          ...question.data,
          prompt: e.target.value,
        })
      }
    />
    <input
      type="file"
      onChange={(e) => onFileUpload(question.id, e.target.files[0])}
    />
    {question.file && <p>Selected File: {question.file.name}</p>}
  </div>
);

const MultipleChoiceQuestionDisplay = ({
  question,
  onQuestionDataChange,
  onFileUpload,
}) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...(question.data?.options || [])];
    newOptions[index] = value;
    onQuestionDataChange(question.id, {
      ...question.data,
      options: newOptions,
    });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.data?.options || []), ""];
    onQuestionDataChange(question.id, {
      ...question.data,
      options: newOptions,
    });
  };

  return (
    <div className="border p-4 mb-4">
      <h3>Multiple Choice Question</h3>
      <label htmlFor={`prompt-${question.id}`}>Prompt:</label>
      <input
        type="text"
        id={`prompt-${question.id}`}
        className="w-full border rounded p-2 mb-2"
        value={question.data?.prompt || ""}
        onChange={(e) =>
          onQuestionDataChange(question.id, {
            ...question.data,
            prompt: e.target.value,
          })
        }
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
      <button
        type="button"
        onClick={handleAddOption}
        className="bg-green-500 text-white rounded px-2 py-1 mt-2"
      >
        Add Option
      </button>
      <input
        type="file"
        onChange={(e) => onFileUpload(question.id, e.target.files[0])}
      />
      {question.file && <p>Selected File: {question.file.name}</p>}
    </div>
  );
};

export default function CreateStudyPage() {
  const [study, setStudy] = useState(null);
  const searchParams = useSearchParams();
  const editStudyId = searchParams.get("studyId");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudyDetails = async () => {
      if (editStudyId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }

          const response = await fetch(
            `${backendUrl}/api/studies/${editStudyId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.clear();
              router.push('/login');
              return;
            }
            throw new Error('Failed to fetch study details for editing');
          }

          const data = await response.json();
          setStudy(data);
          setQuestions(data.questions || []);
          if (data.questions && data.questions.length > 0) {
            setSelectedQuestionIndex(0);
          }
        } catch (error) {
          console.error("Error fetching study details:", error);
          alert("Failed to fetch study details. Please try again.");
        }
      }
    };

    fetchStudyDetails();
  }, [editStudyId, router]);

  const handleAddQuestion = (type) => {
    const newQuestion = { 
      id: Date.now(), 
      type: type, 
      data: { questionText: "", options: [] }, // Added 
      file: null 
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionIndex(questions.length); // Added
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

  /* const handleSaveQuestions = async () => {
    if (!editStudyId) {
      console.error("Study ID not found for saving questions.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${backendUrl}/api/studies/${editStudyId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: questions.map((q) => ({
            _id: q._id,
            id: q.id.toString(),
            type: q.type,
            data: q.data || {},
            file: q.file || null,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.push('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save questions");
      }

      const updatedStudy = await response.json();
      console.log("Questions saved successfully", updatedStudy);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving questions:", error.message);
      alert("Failed to save questions. Please try again.");
    }
  }; */

  if (!editStudyId) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">
          Please select a study to edit from the dashboard.
        </p>
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
        <SideBar
          questions={questions}
          onQuestionSelect={handleQuestionSelect}
          onAddQuestion={handleAddQuestion}
          setQuestions={setQuestions}
        />
        <div className="flex-1 p-4 overflow-auto max-h-[90vh]">
          {/* <h2 className="text-xl font-semibold mb-4">
            Edit Study: {study?.title}
          </h2> */}

          {selectedQuestionIndex !== null &&
            questions[selectedQuestionIndex] && (
              <div>
                {/* <h3 className="text-lg font-semibold mb-2">Question Details</h3> */}
                {questions[selectedQuestionIndex].type === "text" && (
                  <TextQuestionDisplay
                    question={questions[selectedQuestionIndex]}
                    onQuestionDataChange={handleQuestionDataChange}
                    onFileUpload={handleFileUpload}
                  />
                )}
                {questions[selectedQuestionIndex].type === "multipleChoice" && (
                  <MultipleChoiceQuestionDisplay
                    question={questions[selectedQuestionIndex]}
                    onQuestionDataChange={handleQuestionDataChange}
                    onFileUpload={handleFileUpload}
                  />
                )}
                {questions[selectedQuestionIndex].type === "checkbox" && (
                  <CheckboxQuestionBuilder
                    questionData = {questions[selectedQuestionIndex].data}
                    onChange={(updatedData) => 
                      handleQuestionDataChange(questions[selectedQuestionIndex].id, updatedData)
                    }
                  />
                )}
                {questions[selectedQuestionIndex].type === "ratingScale" && (
                  <RatingScaleQuestionBuilder
                    questionData={questions[selectedQuestionIndex].data}
                    onChange={(updatedData) => 
                      handleQuestionDataChange(questions[selectedQuestionIndex].id, updatedData)
                    }
                  />
                )}
              </div>
            )}

          {selectedQuestionIndex === null && questions.length > 0 && (
            <p>
              Select a question from the sidebar to view and edit its details.
            </p>
          )}

          {selectedQuestionIndex === null && questions.length === 0 && (
            <p>Click "Add Item" in the sidebar to add your first question.</p>
          )}

          {/* <button
            type="button"
            onClick={handleSaveQuestions}
            className="mb-4 bg-petrol-blue text-white rounded px-4 py-2 flex items-center justify-center"
          >
            Save Questions
          </button> */}
        </div>
      </div>
    </div>
  );
}
