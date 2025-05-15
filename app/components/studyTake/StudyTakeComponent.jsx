"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import backendUrl from "environment";
import QuestionRenderer from "./QuestionRenderer";
import DemographicForm from "./DemographicForm";
// import { transform } from "next/dist/build/swc/generated-native";

const transformDemographics = (demoObj) => {
  if (!demoObj) return null;
  return Object.entries(demoObj).map(([field, value]) => ({
    field,
    value,
    timestamp: new Date().toISOString()
  }));
};

// Add previewMode to props
export default function StudyTakeComponent({ study, previewMode = false }) {
  if (!study?._id) {
    return <div className="p-8">Invalid study configuration.</div>;
  }

  const [hasStarted, setHasStarted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showDemographics, setShowDemographics] = useState(false);
  const [demographics, setDemographics] = useState(null);

  const [responses, setResponses] = useState(() => {
    const initial = {};
    if (study && study.questions) {
      study.questions.forEach(q => {
        const qType = q.type?.toLowerCase();
        if (qType === 'text' && q.data?.textAreas?.length > 1) {
          initial[q._id] = {};
        } else if (
          (qType === 'ratingscale' || qType === 'rating' || qType === 'rating scale') &&
          q.data?.ratingScales?.length > 1
        ) {
          initial[q._id] = {};
        } else if (qType === 'checkbox') {
          if (q.data?.checkboxGroups?.length > 1) {
            initial[q._id] = {};
          } else {
            initial[q._id] = [];
          }
        } else if (qType === 'ranking' || qType === 'matrix') {
          if (q.data?.matrixGroups?.length > 1) {
            initial[q._id] = {};
          } else {
            initial[q._id] = {};
          }
        } else {
          initial[q._id] = null;
        }
      });
    }
    return initial;
  });

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(30);
  const router = useRouter();
  const generateParticipantId = () => {
    return `p_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  };

  const [participantId] = useState(() => generateParticipantId());
  const [startTime] = useState(() => new Date().toISOString());

  const questions = study?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercentage = Math.min(
    ((currentQuestionIndex) / Math.max(1, questions.length - 1)) * 100,
    100
  );

  /* eslint-disable-next-line */
  const validateResponse = (response, questionType) => {
    if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
      if (questionType === 'checkbox' || questionType === 'text' || questionType === 'ratingscale' || questionType === 'rating' || questionType === 'rating scale') {
        return Object.values(response).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value.trim() !== '';
          return value !== null && value !== undefined;
        });
      }
    }
    if (Array.isArray(response)) return response.length > 0;
    if (typeof response === 'string') return response.trim() !== '';
    if (typeof response === 'number') return true;
    return response !== null && response !== undefined;
  };

  const handleResponse = (questionId, responseFromChild) => {
    const question = questions.find(q => q._id === questionId);
    if (!question) return;

    // For preview mode, ensure we don't have issues with null responses
    if (previewMode && responseFromChild === null) {
      responseFromChild = ""; // Use empty string instead of null in preview
    }

    console.log(`PARENT StudyTakeComponent: Setting response for Q_ID ${questionId}:`, JSON.stringify(responseFromChild));
    setResponses(prev => ({
      ...prev,
      [questionId]: responseFromChild
    }));
  };

  const handleNext = async () => {
    if (!currentQuestion?._id) return;

    const currentQuestionDetails = questions.find(q => q._id === currentQuestion._id);
    /* eslint-disable-next-line */
    const currentQType = currentQuestionDetails?.type?.toLowerCase();

    const responseForCurrentQuestion = responses[currentQuestion._id];
    let isCurrentQuestionAnswered = false;
    if (typeof responseForCurrentQuestion === 'object' && responseForCurrentQuestion !== null && !Array.isArray(responseForCurrentQuestion)) {
      isCurrentQuestionAnswered = Object.keys(responseForCurrentQuestion).length > 0 &&
        Object.values(responseForCurrentQuestion).some(val =>
          Array.isArray(val) ? val.length > 0 : (val !== null && val !== '' && val !== undefined)
        );
    } else if (Array.isArray(responseForCurrentQuestion)) {
      isCurrentQuestionAnswered = responseForCurrentQuestion.length > 0;
    } else {
      isCurrentQuestionAnswered = responseForCurrentQuestion !== null && responseForCurrentQuestion !== undefined && responseForCurrentQuestion !== '';
    }

    if (!isCurrentQuestionAnswered) {
      alert("Please answer the current question before proceeding.");
      return;
    }

    if (isLastQuestion) {
      await handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handle demographic form completion
  const handleDemographicFormComplete = (data) => {
    console.log("Demographic form completed with data:", data); // Debugging log
    setDemographics(() => data);
    setShowDemographics(false);
    setHasStarted(true);
  };

  // Modify the handleSubmit function to handle preview mode
  const handleSubmit = async () => {
    if (!study._id) return;

    const unansweredQuestions = questions.filter(q => {
      const response = responses[q._id];
      /* eslint-disable-next-line */
      const qType = q.type?.toLowerCase();

      if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
        return !Object.values(response).some(val => Array.isArray(val) ? val.length > 0 : (val !== null && val !== '' && val !== undefined));
      }
      if (Array.isArray(response)) {
        return response.length === 0;
      }
      return response === null || response === undefined || response === '';
    });

    if (unansweredQuestions.length > 0) {
      const unansweredTitles = unansweredQuestions.map((q) => q.data?.title || `Question ${study.questions.findIndex(sq => sq._id === q._id) + 1}`).join(', ');
      alert(`Please answer all questions before submitting. Missing: ${unansweredTitles}`);
      return;
    }

    setSubmitting(true);
    
    // If in preview mode, don't actually submit the data
    if (previewMode) {
      // Just simulate success
      setTimeout(() => {
        setSubmitting(false);
        setCompleted(true);
      }, 1000);
      return;
    }

    try {
      const responsesArray = Object.entries(responses).map(([questionId, response]) => ({
        questionId,
        response,
        timestamp: new Date().toISOString()
      }));

      console.log("Aboout to submit demographics:", demographics); // Debugging log

      /*
      if (demographics) {
        responsesArray.unshift({
          questionId: "demographics",
          response: demographics,
          timestamp: new Date().toISOString()
        });
      }
      */
      
      if (!demographics) {
        console.warn("Demopgraphics is null before submission!"); // Debugging log
      }

      const submissionData = {
        studyId: study._id,
        participantId,
        startTime,
        endTime: new Date().toISOString(),
        responses: responsesArray,
        demographics: transformDemographics(demographics)
      };

      console.log("Final submission data:", submissionData); // Debugging log
      
      const result = await fetch(`${backendUrl}/api/responses/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || 'Submission failed');
      }
      
      setCompleted(true);
    } catch (err) {
      console.error("Error submitting responses:", err);
      alert(err.message || "There was an error submitting your responses. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Find the useEffect with the completed countdown timer
  useEffect(() => {
    if (completed) {
      // Move the state update and navigation to separate effects
      const timer = setInterval(() => {
        setRedirectCountdown(prev => prev > 0 ? prev - 1 : 0); // Just update the counter
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [completed]);

  // Add a separate effect just for navigation
  useEffect(() => {
    if (completed && redirectCountdown === 0) {
      // Delay navigation slightly to ensure state updates are complete
      const navigationTimer = setTimeout(() => {
        router.push('/login');
      }, 100);
      
      return () => clearTimeout(navigationTimer);
    }
  }, [completed, redirectCountdown, router]);

  // Handle starting the study
  const handleStartStudy = () => {
    // If there are terms, only start if they've been accepted
    if (study.hasTermsAndConditions && !termsAccepted) {
      return;
    }
    setShowDemographics(true);
  };

  // Render the welcome screen with study information
  const renderWelcomeScreen = () => {
    return (
      <div className="mt-[1rem] w-[60%]">
        <img src="/logo/logo.png" className="mx-auto mb-10" width={80} height={80} alt="Studyfront Logo" />
        <h1 className="text-4xl text-center font-bold mb-[3rem] text-petrol-blue">{study.title}</h1>
        
        {/* Description */}
        <div className="bg-sky-blue/20 p-4 rounded-md max-h-60 overflow-y-auto mb-4 border border-sky-blue">
          <h2 className="text-xl text-oxford-blue font-semibold mb-2">About this study</h2>
          <p className="text-oxford-blue whitespace-pre-line">{study.description}</p>
        </div>
        
        {/* Terms and Conditions */}
        {study.hasTermsAndConditions && (
          <div className="mb-8">
            <p className="mt-[1.5rem] mb-[1rem] text-oxford-blue">This study requires you to accept Terms and Conditions before starting.</p>
            <div className="bg-sky-blue/20 p-4 rounded-md max-h-60 overflow-y-auto mb-4 border border-sky-blue">
              <h2 className="text-xl text-oxford-blue font-semibold mb-2">Terms and Conditions</h2>
              <p className="text-gray-700 whitespace-pre-line">{study.termsAndConditions}</p>
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="accept-terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="accept-terms" className="text-gray-700">
                I have read and accept the terms and conditions
              </label>
            </div>
          </div>
        )}
        
        <button
          type="button"
          onClick={handleStartStudy}
          disabled={study.hasTermsAndConditions && !termsAccepted}
          className={`mx-auto block px-6 py-2 rounded-md text-white text-lg transition-colors duration-300 ${
            study.hasTermsAndConditions && !termsAccepted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-petrol-blue hover:bg-oxford-blue"
          }`}
        >
          Begin Study
        </button>
      </div>
    );
  };

  // Add a preview banner at the top when in preview mode
  if (previewMode) {
    return (
      <div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Preview Mode</p>
          <p>This is a preview of your study. Responses will not be saved.</p>
        </div>
        
        {/* Render the appropriate content based on state */}
        {!hasStarted && !showDemographics ? (
          renderWelcomeScreen()
        ) : showDemographics ? (
          <DemographicForm onComplete={handleDemographicFormComplete} />
        ) : completed ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You for Your Participation!</h2>
            <p className="mb-6">This was a preview - your responses were not submitted.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">{study.title}</h1>
            
            <div className="mb-4">
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {currentQuestion && (
              <div>
                <h3 className="text-xl font-medium mb-4">
                  {currentQuestion.data?.title || `Question ${currentQuestionIndex + 1}`}
                </h3>
                <div className="question-container">
                  <QuestionRenderer
                    question={currentQuestion}
                    onResponse={(response) => handleResponse(currentQuestion._id, response)}
                    currentResponse={responses[currentQuestion._id]}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLastQuestion ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (completed) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You for Your Participation!</h2>
        <p className="mb-6">Your responses have been submitted successfully.</p>
        <div className="my-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(redirectCountdown / 30) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-600">
            Redirecting in {redirectCountdown} seconds...
          </p>
        </div>
      </div>
    );
  }

  if (!study || questions.length === 0) {
    return <div className="p-8">No questions available for this study.</div>;
  }

  // Show demographic form after welcome screen
  if (showDemographics) {
    return(
      <div className="bg-white rounded-lg shadow-md p-6">
        <DemographicForm onComplete={handleDemographicFormComplete} />
      </div>
    ) 
  }

  // Show welcome screen if the study hasn't started yet
  if (!hasStarted) {
    return renderWelcomeScreen();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{study.title}</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {currentQuestion && (
        <div>
          <h3 className="text-xl font-medium mb-4">
            {currentQuestion.data?.title || `Question ${currentQuestionIndex + 1}`}
          </h3>
          <div className="question-container">
            <QuestionRenderer
              question={currentQuestion}
              onResponse={(response) => handleResponse(currentQuestion._id, response)}
              currentResponse={responses[currentQuestion._id]}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!responses[currentQuestion?._id] || submitting}
          className={`px-4 py-2 rounded ${
            !responses[currentQuestion?._id] || submitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {submitting 
            ? "Submitting..." 
            : isLastQuestion 
              ? "Submit" 
              : "Next"}
        </button>
      </div>
    </div>
  );
}