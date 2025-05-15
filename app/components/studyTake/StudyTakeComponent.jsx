"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import backendUrl from "environment";
import QuestionRenderer from "./QuestionRenderer";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import DemographicForm from "./DemographicForm";

// Add previewMode to props
export default function StudyTakeComponent({ study, previewMode = false }) {
  if (!study?._id) {
    return <div className="p-8">Invalid study configuration.</div>;
  }

  // Session key for storing progress during page refreshes
  const sessionKey = `study_progress_${study._id}`;
  
  // Initialize state with values from session storage
  const [hasStarted, setHasStarted] = useState(() => {
    if (typeof window === 'undefined' || previewMode) return false;
    try {
      const savedSession = sessionStorage.getItem(sessionKey);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        return parsedSession.hasStarted || false;
      }
    } catch (error) {
      console.error("Error reading session:", error);
    }
    return false;
  });

  const [showDemographics, setShowDemographics] = useState(() => {
    if (typeof window === 'undefined' || previewMode) return false;
    try {
      const savedSession = sessionStorage.getItem(sessionKey);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        return parsedSession.showDemographics || false;
      }
    } catch (error) {
      console.error("Error reading session:", error);
    }
    return false;
  });

  const [demographics, setDemographics] = useState(() => {
    if (typeof window === 'undefined' || previewMode) return null;
    try {
      const savedSession = sessionStorage.getItem(sessionKey);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        return parsedSession.demographics || null;
      }
    } catch (error) {
      console.error("Error reading session:", error);
    }
    return null;
  });

  const [termsAccepted, setTermsAccepted] = useState(() => {
    if (typeof window === 'undefined' || previewMode) return false;
    try {
      const savedSession = sessionStorage.getItem(sessionKey);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        return parsedSession.termsAccepted || false;
      }
    } catch (error) {
      console.error("Error reading session:", error);
    }
    return false;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    if (typeof window === 'undefined' || previewMode) return 0;
    try {
      const savedSession = sessionStorage.getItem(sessionKey);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        return parsedSession.currentQuestionIndex || 0;
      }
    } catch (error) {
      console.error("Error reading session:", error);
    }
    return 0;
  });

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [responses, setResponses] = useState(() => {
    // First try to get saved responses from session storage
    if (typeof window !== 'undefined' && !previewMode) {
      try {
        const savedSession = sessionStorage.getItem(sessionKey);
        if (savedSession) {
          const parsedSession = JSON.parse(savedSession);
          if (parsedSession.responses && Object.keys(parsedSession.responses).length > 0) {
            console.log("Restored responses from session:", parsedSession.responses);
            return parsedSession.responses;
          }
        }
      } catch (error) {
        console.error("Error reading responses from session:", error);
      }
    }

    // Fall back to initializing empty responses
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
  
  // Generate a device fingerprint for uniquely identifying participants
  const [fingerprint, setFingerprint] = useState('');
  const [participantId, setParticipantId] = useState('');
  const startTime = new Date().toISOString();

  const transformDemographics = (data) => {
    if (!data) return null;

    return {
      age: data.age || '',
      gender: data.gender || '',
      education: data.education || '',
      occupation: data.occupation || ''
    };
  };

  // Initialize fingerprint on component mount
  useEffect(() => {
    if (previewMode) {
      setLoading(false);
      return;
    }
    
    const initializeFingerprint = async () => {
      try {
        // Load FingerprintJS
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        
        // Use the visitorId as the fingerprint
        const visitorId = result.visitorId;
        setFingerprint(visitorId);
        
        // Create a participantId that combines fingerprint with timestamp
        const generatedId = `p_${visitorId.substring(0, 10)}_${Date.now()}`;
        setParticipantId(generatedId);
        
        // Check if this participant has already completed this study
        await checkParticipationStatus(study._id, visitorId);
      } catch (error) {
        console.error("Error generating fingerprint:", error);
        // Fallback to a random ID if fingerprinting fails
        const fallbackId = `p_fallback_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
        setParticipantId(fallbackId);
        setLoading(false);
      }
    };
    
    initializeFingerprint();
  }, [previewMode, study._id]);
  
  // Simplified checkParticipationStatus function
  const checkParticipationStatus = async (studyId, visitorId) => {
    try {
      // Server-side check using fingerprint and cookies
      const response = await fetch(`${backendUrl}/api/responses/check-participation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studyId, visitorId }),
        credentials: 'include' // Include cookies in the request
      });
      
      const data = await response.json();
      
      if (data.hasParticipated) {
        setAlreadyCompleted(true);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error checking participation status:", error);
      setLoading(false);
    }
  };

  // Save session state when it changes
  useEffect(() => {
    if (typeof window === 'undefined' || previewMode || completed) {
      return;
    }
    
    try {
      const sessionData = {
        responses,
        currentQuestionIndex,
        hasStarted,
        termsAccepted,
        demographics,
        showDemographics
      };
      
      sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }, [responses, currentQuestionIndex, hasStarted, termsAccepted, demographics, showDemographics, completed, previewMode, sessionKey]);

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
    document.querySelector("#pleaseAnswer").style.display = "none";
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
      // alert("Please answer the current question before proceeding.");
      document.querySelector("#pleaseAnswer").style.display = "block";
      return;
    }

    if (isLastQuestion) {
      await handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    document.querySelector("#pleaseAnswer").style.display = "none";
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handle demographic form completion
  const handleDemographicFormComplete = (data) => {
    setDemographics(() => data);
    setShowDemographics(false);
    setHasStarted(true);
  };

  // Simplified handleSubmit function - remove redundant localStorage saving
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
      
      const submissionData = {
        studyId: study._id,
        participantId,
        visitorId: fingerprint,
        startTime,
        endTime: new Date().toISOString(),
        responses: responsesArray,
        demographics: transformDemographics(demographics)
      };
      
      const result = await fetch(`${backendUrl}/api/responses/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
        credentials: 'include' // Important for cookies
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || data.error || 'Submission failed');
      }
      
      setCompleted(true);
      
      // Clear session data since study is now complete
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(sessionKey);
      }
    } catch (err) {
      console.error("Error submitting responses:", err);
      alert(`Failed to submit responses: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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

    if (study.hasDemographics) {
      setShowDemographics(true);
    } else {
      setShowDemographics(false);
      setHasStarted(true);
    }
    
  };

  // Render already completed message
  const renderAlreadyCompletedMessage = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-petrol-blue">You've Already Completed This Study</h2>
        <p className="mb-6 text-gray-600">
          Our records show that you have already submitted responses for this study.
          Each participant can only complete a study once.
        </p>
        <button
          onClick={() => router.push('/login')}
          type="button"
          className="bg-petrol-blue text-white px-6 py-2 rounded hover:bg-oxford-blue transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    );
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

  // If still loading, show loading state
  if (loading && !previewMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-petrol-blue"></div>
      </div>
    );
  }

  // If already completed, show message (unless in preview mode)
  if (alreadyCompleted && !previewMode) {
    return renderAlreadyCompletedMessage();
  }

  // Add a preview banner at the top when in preview mode
  if (previewMode) {
    return (
      <div>
        {/* Preview mode UI remains unchanged */}
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
            {/* Rest of the preview mode UI */}
            {/* ... */}
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
    <div className="w-[70%]">
      <h1 className="text-3xl mb-6 text-center text-petrol-blue">{study.title}</h1>
      
      <div className="mb-4">
        <p className="text-gray-600 text-center mb-1">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="w-full bg-sky-blue rounded-full h-2.5">
          <div 
            className="bg-petrol-blue h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {currentQuestion && (
        <div>
          <h3 className="text-2xl text-center mb-4 mt-8">
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
      <p className="text-right text-red-500 hidden" id="pleaseAnswer">Please answer the question before continuing.</p>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded flex items-center ${
            currentQuestionIndex === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-sky-blue hover:brightness-90 text-black"
          }`}
        >
          <FaArrowLeft className="mr-1" /> Previous question
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!responses[currentQuestion?._id] || submitting}
          className={`px-4 py-2 rounded flex items-center ${
            !responses[currentQuestion?._id] || submitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-petrol-blue hover:bg-oxford-blue text-white"
          }`}
        >
          {submitting 
            ? "Submitting..." 
            : isLastQuestion 
              ? "Submit study" 
              : (<>Next question <FaArrowRight className="ml-1" /></>)
          }
        </button>
      </div>
    </div>
  );
}