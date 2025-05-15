"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header/Header.jsx";
import SideBar from "@/components/studyCreator/sideBar.jsx";
import CheckboxQuestionBuilder from "@/components/questionTypes/checkboxQ";
import { useSearchParams, useRouter } from "next/navigation";
import backendUrl from "environment";
import RatingScaleQuestionBuilder from "@/components/questionTypes/ratingQ";
import TextanswerQuestionBuilder from "@/components/questionTypes/textanswerQ";
import MultipleChoiceQuestionBuilder from "@/components/questionTypes/multiplechoiceQ";
import DropdownQuestionBuilder from "@/components/questionTypes/dropdownQ";
import RankQuestionBuilder from "@/components/questionTypes/rankQ";
import MatrixQuestionBuilder from "@/components/questionTypes/matrixQ";
import StudyDetails from "@/components/questionTypes/studyDetails";
import { updateQuestions, updateQuestion, addQuestion, deleteQuestion } from "@/utils/studyActions";
import { debounce, throttle } from "lodash";

const defaultQuestionData = {
  checkbox: {
    title: "",
    checkboxGroups: [
      {
        id: `${Date.now()}-cg-initial`,
        label: "",
        options: [{ id: `${Date.now()}-opt-initial`, text: "" }],
      },
    ],
    artifacts: [], // Add this line
  },
  ratingScale: {
    title: "",
    ratingScales: [
      { id: `${Date.now()}-rs-initial`, name: "", min: "", max: "" },
    ],
    artifacts: [], // Add this line
  },
  text: {
    title: "",
    textAreas: [{ id: `${Date.now()}-ta-initial`, label: "" }],
    artifacts: [], // Add this line
  },
  // Add artifacts array to all other question types as well
  multipleChoice: {
    title: "",
    choiceGroups: [
      {
        id: `${Date.now()}-mcg-initial`,
        label: "",
        options: [{ id: `${Date.now()}-mco-initial`, text: "" }],
      },
    ],
    artifacts: [],
  },
  dropdown: {
    title: "",
    dropdowns: [
      {
        id: `${Date.now()}-dd-initial`,
        label: "",
        options: [{ id: `${Date.now()}-ddo-initial`, text: "" }],
      },
    ],
    artifacts: [],
  },
  ranking: {
    title: "",
    rankGroups: [
      {
        id: `${Date.now()}-rg-initial`,
        label: "",
        options: [{ id: `${Date.now()}-ro-initial`, text: "" }],
      },
    ],
    artifacts: [],
  },
  matrix: {
    title: "",
    matrixGroups: [
      {
        id: `${Date.now()}-mg-initial`,
        label: "",
        horizontalItems: [{ id: `${Date.now()}-mgh-initial`, text: "" }],
        verticalItems: [{ id: `${Date.now()}-mgv-initial`, text: "" }],
      },
    ],
    artifacts: [],
  },
};

export default function CreateStudyPage() {
  const [study, setStudy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [viewingStudyDetails, setViewingStudyDetails] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const searchParams = useSearchParams();
  const editStudyId = searchParams.get("studyId");
  const router = useRouter();

  const debouncedSave = useCallback(
    debounce((studyId, questionId, dataToSave, onSuccess, onError) => {
      updateQuestion(studyId, questionId, dataToSave, onSuccess, onError);
    }, 1000),
    []
  );

  /* eslint-disable-next-line */
  const throttledSave = throttle(async (currentQuestion) => {
    if (!study?._id || !currentQuestion) return;

    try {
      if (!currentQuestion._id) {
        await addQuestion(
          study._id,
          currentQuestion,
          (updatedStudy) => {
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

          let response = await fetch(
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

          const initializedQuestions = data.questions.map((q) => ({
            ...q,
            _id: q._id || `${Date.now()}-q-${Math.random()}`,
            data: {
              ...q.data,
              ratingScales:
                q.data?.ratingScales?.map((rs, index) => ({
                  ...rs,
                  id: rs.id || `${Date.now()}-rs-${index}`,
                })) ||
                (q.type === "ratingScale"
                  ? defaultQuestionData.ratingScale.ratingScales
                  : undefined),
              checkboxGroups:
                q.data?.checkboxGroups?.map((cg, cgIdx) => ({
                  ...cg,
                  id: cg.id || `${Date.now()}-cg-${cgIdx}`,
                  options:
                    cg.options?.map((opt, optIdx) => ({
                      ...opt,
                      id: opt.id || `${Date.now()}-cg-${cgIdx}-opt-${optIdx}`,
                    })) ||
                    defaultQuestionData.checkbox.checkboxGroups[0].options,
                })) ||
                (q.type === "checkbox"
                  ? defaultQuestionData.checkbox.checkboxGroups
                  : undefined),
              textAreas:
                q.data?.textAreas?.map((ta, index) => ({
                  ...ta,
                  id: ta.id || `${Date.now()}-ta-${index}`,
                })) ||
                (q.type === "text"
                  ? defaultQuestionData.text.textAreas
                  : undefined),
              artifacts: q.data?.artifacts?.map(artifact => ({
                id: artifact.id,
                name: artifact.name,
                imageUrl: artifact.imageUrl,
                contentType: artifact.contentType || 'image',
                title: artifact.title !== undefined && artifact.title !== null ? artifact.title : 
                       artifact.label !== undefined && artifact.label !== null ? artifact.label : 
                       artifact.name,
                label: artifact.label !== undefined && artifact.label !== null ? artifact.label : 
                       artifact.title !== undefined && artifact.title !== null ? artifact.title : 
                       artifact.name
              })) || []
            },
          }));

          console.log("Fetched study details:", data);
          setStudy(data);
          setQuestions(initializedQuestions);
          if (initializedQuestions.length > 0) {
            setSelectedQuestionIndex(0);
          }
        } catch (error) {
          console.error("Error fetching study details:", error);
          alert("Failed to fetch study details. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchStudyDetails();
  }, [editStudyId, router]);

  const handleViewStudyDetails = () => {
    setViewingStudyDetails(true);
  };

  const handleQuestionSelect = (index) => {
    setSelectedQuestionIndex(index);
    setViewingStudyDetails(false);
  };

  const handleStudyUpdate = useCallback((updatedFields) => {
    setStudy((prevStudy) => {
      if (!prevStudy) return null;
      const newStudyState = { ...prevStudy, ...updatedFields };
      return newStudyState;
    });

    setSaveStatus("Study information updated!");
    setTimeout(() => setSaveStatus(""), 3000);
  }, []);

  const handleQuestionsChange = (updatedQuestions) => {
    if (!Array.isArray(updatedQuestions)) {
        return;
    }
    
    setQuestions(updatedQuestions);
    
    updateQuestions(
        study._id,
        updatedQuestions,
        () => {
            setSaveStatus("Questions saved successfully!");
            setTimeout(() => setSaveStatus(""), 3000);
        },
        (error) => {
            console.error("Failed to save questions:", error);
            setSaveStatus("Failed to save questions!");
            setTimeout(() => setSaveStatus(""), 3000);
        }
    );
};

  const handleQuestionDataChange = useCallback(
  (updatedDataFromChild) => {
    if (selectedQuestionIndex === null) return;
    
    const nextQuestions = questions.map((q, index) => {
      if (index === selectedQuestionIndex) {
        return {
          ...q,
          data: updatedDataFromChild,
        };
      }
      return q;
    });

    // Only update if data has changed
    const currentQuestionData = questions[selectedQuestionIndex]?.data || {};
    if (JSON.stringify(currentQuestionData) !== JSON.stringify(updatedDataFromChild)) {
      setQuestions(nextQuestions);
    }

    const questionToSave = nextQuestions[selectedQuestionIndex];

    if (study?._id && questionToSave?._id) {
      
      // Send the data properly formatted for the backend
      debouncedSave(
        study._id,
        questionToSave._id,
        { data: updatedDataFromChild },
        // eslint-disable-next-line
        (updatedData) => {
          setSaveStatus("Question saved!");
          setTimeout(() => setSaveStatus(""), 3000);
        },
        (error) => {
          console.error("Failed to save question data:", error);
          setSaveStatus("Failed to save question");
          setTimeout(() => setSaveStatus(""), 3000);
        }
      );
    }
  },
  [selectedQuestionIndex, questions, study, debouncedSave]
);

  if (!editStudyId && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">
          Please select a study to edit from the dashboard, or create a new one.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">Loading study details...</p>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">Study data not available or failed to load.</p>
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
            if (
              selectedQuestionIndex !== null &&
              questions[selectedQuestionIndex]
            ) {
              const currentQuestion = questions[selectedQuestionIndex];
              if (
                currentQuestion &&
                study &&
                currentQuestion._id &&
                currentQuestion.data
              ) {
                await new Promise((resolve, reject) => {
                  debouncedSave(
                    study._id,
                    currentQuestion._id,
                    currentQuestion.data,
                    () => {
                      resolve();
                    },
                    (error) => {
                      console.error(
                        "Failed to save unsaved changes for current question:",
                        error
                      );
                      reject(error);
                    }
                  );
                });
              }
            }

            const newQuestionClientId = `${Date.now()}-q-${Math.random().toString(36).substring(2, 11)}`;

            const newQuestionPayload = {
              id: newQuestionClientId,
              type,
              data: defaultQuestionData[type] || {},
            };
            if (!study?._id) {
              console.error("Cannot add question: study ID is missing.");
              alert("Cannot add question: study information is missing. Please reload.");
              return;
            }

            setViewingStudyDetails(false);

            addQuestion(
              study._id,
              newQuestionPayload,
              (updatedStudy) => {
                const newQuestionsFromServer = updatedStudy.questions.map((qFromServer) => {
                  const anId = qFromServer.id || qFromServer._id || newQuestionClientId;
                  return {
                    ...qFromServer,
                    id: anId,
                    _id: anId,
                  };
                });
                setQuestions(newQuestionsFromServer);
                setSelectedQuestionIndex(newQuestionsFromServer.length - 1);
                setSaveStatus("New question added!");
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
          deleteQuestion={(questionId) => {
            if (!study?._id) {
              console.error("Cannot delete question: study ID is missing.");
              return;
            }
            deleteQuestion(
              study._id,
              questionId,
              (updatedStudy) => {
                setQuestions(
                  updatedStudy.questions.map((q) => ({
                    ...q,
                    _id: q._id || q.id,
                  }))
                );
                setSelectedQuestionIndex(null);
                setSaveStatus("Question deleted.");
                setTimeout(() => setSaveStatus(""), 3000);
              },
              (error) => {
                console.error("Failed to delete question:", error);
                alert("Failed to delete question.");
              }
            );
          }}
          saveStatus={saveStatus}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
        />
        <div className="flex-1 p-4 overflow-auto max-h-[90vh]">
          {viewingStudyDetails ? (
            <StudyDetails
              studyId={study._id}
              studyName={study.title}
              studyDescription={study.description}
              studyTermsEnabled={study.hasTermsAndConditions}
              studyTerms={study.termsAndConditions}
              onStudyUpdated={handleStudyUpdate}
              timedStudy={study.timedStudy}
              endDate={study.endDate}
              studyDemographicsEnabled={study.hasDemographics}
            />
          ) : (
            <div>
              {selectedQuestionIndex !== null &&
                questions?.[selectedQuestionIndex] && (
                  <div>
                    {questions[selectedQuestionIndex].type === "text" && (
                        <TextanswerQuestionBuilder
                          key={
                            questions[selectedQuestionIndex]._id ||
                            `text-${selectedQuestionIndex}`
                          }
                          questionData={questions[selectedQuestionIndex].data}
                          onChange={handleQuestionDataChange}
                          study={study}
                        />
                    )}
                    {questions[selectedQuestionIndex].type ===
                      "multipleChoice" && (
                      <MultipleChoiceQuestionBuilder
                        key={
                          questions[selectedQuestionIndex]._id ||
                          `mc-${selectedQuestionIndex}`
                        }
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={handleQuestionDataChange}
                        study={study}
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "checkbox" && (
                      <CheckboxQuestionBuilder
                        key={
                          questions[selectedQuestionIndex]._id ||
                          `checkbox-${selectedQuestionIndex}`
                        }
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={handleQuestionDataChange}
                        study={study}
                      />
                    )}
                    {questions[selectedQuestionIndex].type ===
                      "ratingScale" && (
                      <RatingScaleQuestionBuilder
                        key={
                          questions[selectedQuestionIndex]._id ||
                          `rating-${selectedQuestionIndex}`
                        }
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={handleQuestionDataChange}
                        study={study}
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "dropdown" && (
                      <DropdownQuestionBuilder
                        key={
                          questions[selectedQuestionIndex]._id ||
                          `dropdown-${selectedQuestionIndex}`
                        }
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={handleQuestionDataChange}
                        study={study}
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "ranking" && (
                      <RankQuestionBuilder
                        key={
                          questions[selectedQuestionIndex]._id ||
                          `ranking-${selectedQuestionIndex}`
                        }
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={handleQuestionDataChange}
                        study={study}
                      />
                    )}
                    {questions[selectedQuestionIndex].type === "matrix" && (
                      <MatrixQuestionBuilder
                        key={
                          questions[selectedQuestionIndex]._id ||
                          `matrix-${selectedQuestionIndex}`
                        }
                        questionData={questions[selectedQuestionIndex].data}
                        onChange={handleQuestionDataChange}
                        study={study}
                      />
                    )}
                  </div>
                )}
              {selectedQuestionIndex === null && questions?.length > 0 && (
                <p>
                  Select a question from the sidebar to view and edit its
                  details.
                </p>
              )}
              {selectedQuestionIndex === null &&
                (!questions || questions.length === 0) && (
                  <p>
                    Click "Add Question" in the sidebar to add your first question,
                    or click "Study Information" to edit the Information about
                    the study.
                  </p>
                )}
            </div>
          )}
          {previewMode && study && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col">
                <div className="bg-petrol-blue text-white p-3 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Study Preview</h3>
                  <button 
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className="text-white hover:text-red-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="bg-gray-100 p-2 text-center text-petrol-blue font-semibold">
                  PREVIEW MODE - Responses will not be saved
                </div>
                
                <div className="flex-grow" style={{height: "80vh"}}>
                  <iframe 
                    src={`/study/${study._id}?preview=true`} 
                    className="w-full h-full"
                    title="Study Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}