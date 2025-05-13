"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import backendUrl from "environment";
import QuestionRenderer from "./QuestionRenderer";

export default function StudyTakeComponent({ study }) {
  if (!study?._id) {
    return <div className="p-8">Invalid study configuration.</div>;
  }

  const [hasStarted, setHasStarted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
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

  const validateResponse = (response) => {
    if (!response) return false;
    if (typeof response === 'string' && !response.trim()) return false;
    return true;
  };

  const handleResponse = (questionId, response) => {
    // Ensure type consistency based on question type
    const question = questions.find(q => q._id === questionId);
    if (!question) return;

    let formattedResponse = response;

    // Ensure checkbox responses are always arrays
    if (question.type?.toLowerCase() === 'checkbox' && !Array.isArray(response)) {
      formattedResponse = response ? [response] : [];
    }

    if (!validateResponse(formattedResponse)) return;
    
    setResponses(prev => ({
      ...prev,
      [questionId]: formattedResponse
    }));
  };

  const handleNext = async () => {
    if (!currentQuestion?._id || !responses[currentQuestion._id]) {
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

  // Update the handleSubmit function
  const handleSubmit = async () => {
    if (!study._id) return;
    
    const unansweredQuestions = questions.filter(q => !responses[q._id]);
    if (unansweredQuestions.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const submissionData = {
        studyId: study._id,
        participantId,
        startTime,
        endTime: new Date().toISOString(),
        responses: Object.entries(responses).map(([questionId, response]) => ({
          questionId,
          response,
          timestamp: new Date().toISOString()
        }))
      };
      
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

  useEffect(() => {
    if (completed) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [completed, router]);

  // Handle starting the study
  const handleStartStudy = () => {
    // If there are terms, only start if they've been accepted
    if (study.hasTermsAndConditions && !termsAccepted) {
      return;
    }
    setHasStarted(true);
  };

  // Render the welcome screen with study information
  const renderWelcomeScreen = () => {
    return (
      <div className="mt-[2rem] w-[60%]">
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
              <h2 className="text-xl font-semibold mb-2">Terms and Conditions</h2>
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
          className={`mx-auto block px-6 py-3 rounded-md text-white font-medium text-lg transition-colors duration-300 ${
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