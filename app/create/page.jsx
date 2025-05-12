/* eslint-disable */

"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header/Header.jsx";
import SideBar from "@/components/studyCreator/sideBar.jsx";
import CheckboxQuestionBuilder from "@/components/questionTypes/checkboxQ";
import { useSearchParams, useRouter } from "next/navigation";
import backendUrl from "environment";
import RatingScaleQuestionBuilder from "@/components/questionTypes/ratingQ";
import StudyDetails from "@/components/questionTypes/studyDetails";
import { fetchStudyDetails, updateQuestions, updateQuestion, addQuestion, deleteQuestion } from "@/utils/studyActions";
import { debounce, throttle } from "lodash";

const defaultQuestionData = {
  checkbox: { title: "", options: ['',] },
  ratingScale: { title: "", ratingScales: ['',] },
};

export default function CreateStudyPage() {
  const [study, setStudy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [viewingStudyDetails, setViewingStudyDetails] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const searchParams = useSearchParams();
  const editStudyId = searchParams.get("studyId");
  const router = useRouter();

const debouncedSave = useCallback(
  debounce((studyId, questionId, updatedData, onSuccess, onError) => {
    console.log("Debounced save triggered:", { studyId, questionId, updatedData });
    const payload = { data: updatedData };
    updateQuestion(studyId, questionId, payload, onSuccess, onError);
  }, 1000),
  []
);

const throttledSave = throttle(async (currentQuestion) => {
  if (!study?._id || !currentQuestion) return;

  try {
    if (!currentQuestion._id) {
      await addQuestion(
        study._id,
        currentQuestion,
        (updatedStudy) => {
          console.log("New question added successfully:", updatedStudy.questions);
          setQuestions(updatedStudy.questions);
          setSaveStatus("Study saved successfully!");
          setTimeout(() => setSaveStatus(""), 3000);
        },
        (error) => {
          console.error("Failed to add the new question:", error);
          alert("Failed to add the new question. Please try again.");
        }
      );
    } else {
      await updateQuestion(
        study._id,
        currentQuestion._id,
        currentQuestion.data,
        (updatedStudy) => {
          console.log("Current question updated successfully slowed:", updatedStudy);
          setSaveStatus("Study saved successfully!");
          setTimeout(() => setSaveStatus(""), 3000);
        },
        (error) => {
          console.error("Failed to update the current question:", error);
          alert("Failed to update the current question. Please try again.");
        }
      );
    }
  } catch (error) {
    console.error("Error saving question:", error);
    alert("Failed to save the question. Please try again.");
  }
}, 2000);


  useEffect(() => {
    const fetchStudyDetails = async () => {
      if (editStudyId) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            router.push("/login");
            return;
          }

          const response = await fetch(
            `${backendUrl}/api/studies/${editStudyId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.clear();
              router.push("/login");
              return;
            }
            throw new Error("Failed to fetch study details for editing");
          }

          const data = await response.json();

          const flattenedQuestions = data.questions;

          setStudy(data);
          setQuestions(flattenedQuestions);
          if (flattenedQuestions.length > 0) {
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

  const handleViewStudyDetails = () => {
    setViewingStudyDetails(true);
  };

  const handleBackToQuestions = () => {
    setViewingStudyDetails(false);
  };

  const handleQuestionSelect = (index) => {
    setSelectedQuestionIndex(index);
    setViewingStudyDetails(false);
  };

  const handleStudyUpdate = () => {
    if (editStudyId) {
      fetchStudyDetails(editStudyId);
    }
  };

  const handleQuestionsChange = (updatedQuestions) => {
    setQuestions(updatedQuestions);
    updateQuestions(
        study._id,
        updatedQuestions,
        (savedQuestions) => {
            console.log("Questions saved successfully:", savedQuestions);
        },
        (error) => {
            console.error("Failed to save questions:", error);
        }
    );
  };

  const handleSaveQuestions = async () => {
    if (selectedQuestionIndex === null || !questions[selectedQuestionIndex]) return;
    const currentQuestion = questions[selectedQuestionIndex];
    throttledSave(currentQuestion);
  };

  const handleQuestionDataChange = useCallback(
    (updatedData) => {
      setQuestions((prev) =>
        prev.map((q, index) =>
          index === selectedQuestionIndex
            ? {
                ...q,
                data: {
                  ...q.data, // Preserve existing fields
                  ...updatedData, // Merge updated fields
                },
              }
            : q
        )
      );

      // Save the updated question to the backend
      const currentQuestion = questions[selectedQuestionIndex];
      if (currentQuestion && study) {
        const updatedQuestion = {
          ...currentQuestion,
          data: {
            ...currentQuestion.data, // Preserve existing fields
            ...updatedData, // Merge updated fields
          },
        };

        debouncedSave(
          study._id,
          updatedQuestion._id, // Use the question's _id
          { data: updatedQuestion.data }, // Wrap updatedData in a "data" key
          (updatedStudy) => {
            console.log("Question updated successfully:", updatedStudy);
            setSaveStatus("Study saved successfully!"); // Update save status
            setTimeout(() => setSaveStatus(""), 3000); // Clear the message after 3 seconds
          },
          (error) => {
            console.error("Failed to update the question:", error);
            alert("Failed to update the question. Please try again.");
          }
        );
      }
    },
    [selectedQuestionIndex, study?._id] // Add a null-safe check for study._id
  );


  const handleCheckboxQuestionChange = useCallback(
    (updatedData) => {
      setQuestions((prev = []) =>
        prev.map((q, index) =>
          index === selectedQuestionIndex
            ? { ...q, data: { ...q.data, ...updatedData } }
            : q
        )
      );

      const currentQuestion = questions[selectedQuestionIndex];
      if (currentQuestion && study) {
        const updatedQuestion = {
          ...currentQuestion,
          data: { ...currentQuestion.data, ...updatedData },
        };

        debouncedSave(
          study._id,
          updatedQuestion._id,
          updatedQuestion.data,
          (updatedStudy) => {
            console.log("Checkbox question saved successfully:", updatedStudy);
          },
          (error) => {
            console.error("Failed to save the checkbox question:", error);
          }
        );
      }
    },
    [selectedQuestionIndex, questions, study, debouncedSave]
  );
  
  const handleRatingScaleQuestionChange = useCallback(
    (updatedData) => {
      setQuestions((prev = []) =>
        prev.map((q, index) =>
          index === selectedQuestionIndex
            ? { ...q, data: { ...q.data, ...updatedData } }
            : q
        )
      );

      const currentQuestion = questions[selectedQuestionIndex];
      if (currentQuestion && study) {
        const updatedQuestion = {
          ...currentQuestion,
          data: { ...currentQuestion.data, ...updatedData },
        };

        debouncedSave(
          study._id,
          updatedQuestion._id,
          updatedQuestion.data,
          (updatedStudy) => {
          console.log("Rating scale question saved successfully:", updatedStudy);
        },
        (error) => {
          console.error("Failed to save the rating scale question:", error);
        }
      );
    }
  },
  [selectedQuestionIndex, questions, study, debouncedSave]
);

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
          study={study}
          studyTitle={study.title}
          questions={questions}
          onQuestionSelect={handleQuestionSelect}
          onAddQuestion={async (type) => {
            if (selectedQuestionIndex !== null && questions[selectedQuestionIndex]) {
              const currentQuestion = questions[selectedQuestionIndex];
              if (currentQuestion && study) {
                const updatedQuestion = {
                  ...currentQuestion,
                  data: { ...currentQuestion.data },
                };
          
                await new Promise((resolve, reject) => {
                  debouncedSave(
                    study._id,
                    updatedQuestion._id,
                    updatedQuestion.data,
                    () => {
                      console.log("Unsaved changes saved successfully.");
                      resolve();
                    },
                    (error) => {
                      console.error("Failed to save unsaved changes:", error);
                      reject(error);
                    }
                  );
                });
              }
            }
          
            const newQuestion = {
              id: Date.now(),
              type,
              data: defaultQuestionData[type] || {},
              file: null,
            };

            addQuestion(
              study._id,
              newQuestion,
              (updatedStudy) => {
                console.log("New question added successfully:", updatedStudy.questions);
                setQuestions(updatedStudy.questions);
                setSelectedQuestionIndex(updatedStudy.questions.length - 1);
                setSaveStatus("Study saved successfully!");
                setTimeout(() => setSaveStatus(""), 3000);
              },
              (error) => {
                console.error("Failed to add the new question:", error);
                alert("Failed to add the new question. Please try again.");
              }
            );
          }}
          setQuestions={setQuestions}
          onViewStudyDetails={handleViewStudyDetails}
          onChange={handleQuestionsChange}
          selectedQuestionIndex={selectedQuestionIndex}
          deleteQuestion={deleteQuestion}
          saveStatus={saveStatus}
        />
        <div className="flex-1 p-4 overflow-auto max-h-[90vh]">
          {viewingStudyDetails ? (
              <StudyDetails
                studyId={study._id}
                studyName={study.title}
                studyDescription={study.description}
                onStudyUpdated={handleStudyUpdate}
              />
          ) : (
            <div>
              {selectedQuestionIndex !== null && questions?.[selectedQuestionIndex] && (
                <div>
                  {questions[selectedQuestionIndex].type === "text" && (
                    <TextQuestionDisplay
                      question={questions[selectedQuestionIndex]}
                      onQuestionDataChange={(id, data) =>
                        setQuestions((prev) =>
                          prev.map((q) => (q.id === id ? { ...q, data } : q))
                        )
                      }
                    />
                  )}
                  {questions[selectedQuestionIndex].type === "multipleChoice" && (
                    <MultipleChoiceQuestionDisplay
                      question={questions[selectedQuestionIndex]}
                      onQuestionDataChange={(id, data) =>
                        setQuestions((prev) =>
                          prev.map((q) => (q.id === id ? { ...q, data } : q))
                        )
                      }
                    />
                  )}
                  {questions[selectedQuestionIndex].type === "checkbox" && (
                    <CheckboxQuestionBuilder
                      key={questions[selectedQuestionIndex]._id}
                      questionData={questions[selectedQuestionIndex].data}
                      onChange={handleCheckboxQuestionChange}
                    />
                  )}
                  {questions[selectedQuestionIndex].type === "ratingScale" && (
                    <RatingScaleQuestionBuilder
                      key={questions[selectedQuestionIndex]._id}
                      questionData={questions[selectedQuestionIndex].data}
                      onChange={handleRatingScaleQuestionChange}
                    />
                  )}
                </div>
              )}
              {selectedQuestionIndex === null && questions?.length > 0 && (
                <p>
                  Select a question from the sidebar to view and edit its details.
                </p>
              )}
              {selectedQuestionIndex === null && (!questions || questions.length === 0) && (
                <p>
                  Click "Add Item" in the sidebar to add your first question, or click
                  "Study Information" to edit the Information about the study.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
