/* eslint-disable */

"use client";
import { useState, useEffect } from "react";
import Header from "@/components/header/Header.jsx";
import SideBar from "@/components/studyCreator/sideBar.jsx";
import CheckboxQuestionBuilder from "@/components/questionTypes/checkboxQ";
import { useSearchParams, useRouter } from "next/navigation";
import backendUrl from "environment";
import RatingScaleQuestionBuilder from "@/components/questionTypes/ratingQ";
import TextanswerQuestionBuilder from "@/components/questionTypes/textanswerQ";
import MultipleChoiceQuestionBuilder from "@/components/questionTypes/multiplechoiceQ";
import DropdownQuestionBuilder from "@/components/questionTypes/dropdownQ";
import StudyDetails from "@/components/questionTypes/studyDetails";
import { fetchStudyDetails, updateQuestions } from "@/utils/studyActions";

export default function CreateStudyPage() {
  const [study, setStudy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [viewingStudyDetails, setViewingStudyDetails] = useState(false);
  const searchParams = useSearchParams();
  const editStudyId = searchParams.get("studyId");
  const router = useRouter();

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
          studyTitle={study.title}
          questions={questions}
          onQuestionSelect={handleQuestionSelect}
          onAddQuestion={(type) => {
            const newQuestion = {
              id: Date.now(),
              type,
              data: { questionText: "", options: [] },
              file: null,
            };
            setQuestions([...questions, newQuestion]);
            setSelectedQuestionIndex(questions.length);
          }}
          setQuestions={setQuestions}
          onViewStudyDetails={handleViewStudyDetails}
          onChange={handleQuestionsChange}
          selectedQuestionIndex={selectedQuestionIndex}
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
              {selectedQuestionIndex !== null &&
                questions[selectedQuestionIndex] && (
                  <div>
                    {questions[selectedQuestionIndex].type === "text" && (
                      <TextanswerQuestionBuilder
                        question={questions[selectedQuestionIndex]}
                        onQuestionDataChange={(id, data) =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === id ? { ...q, data } : q
                            )
                          )
                        }
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "multipleChoice" && (
                      <MultipleChoiceQuestionBuilder
                        question={questions[selectedQuestionIndex]}
                        onQuestionDataChange={(id, data) =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === id ? { ...q, data } : q
                            )
                          )
                        }
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "checkbox" && (
                      <CheckboxQuestionBuilder
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={(updatedData) =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === questions[selectedQuestionIndex].id
                                ? { ...q, data: updatedData }
                                : q
                            )
                          )
                        }
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "ratingScale" && (
                      <RatingScaleQuestionBuilder
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={(updatedData) =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === questions[selectedQuestionIndex].id
                                ? { ...q, data: updatedData }
                                : q
                            )
                          )
                        }
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "dropdown" && (
                      <DropdownQuestionBuilder
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={(updatedData) =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === questions[selectedQuestionIndex].id
                                ? { ...q, data: updatedData }
                                : q
                            )
                          )
                        }
                      />
                    )}
                  </div>
                )}
              {selectedQuestionIndex === null && questions.length > 0 && (
                <p>
                  Select a question from the sidebar to view and edit its
                  details.
                </p>
              )}
              {selectedQuestionIndex === null && questions.length === 0 && (
                <p>Click "Add Item" in the sidebar to add your first question.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
