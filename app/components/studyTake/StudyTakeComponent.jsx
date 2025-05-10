"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import backendUrl from "environment";
import QuestionRenderer from "./QuestionRenderer";

export default function StudyTakeComponent({ study }) {
  // Add validation for study prop
  if (!study?._id) {
    return <div className="p-8">Invalid study configuration.</div>;
  }

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
    if (!validateResponse(response)) return;
    setResponses(prev => ({
      ...prev,
      [questionId]: response
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
      
      const result = await fetch(`${backendUrl}/api/studies/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No Authorization header needed since this is a public endpoint
        },
        body: JSON.stringify(submissionData)
      });

      if (!result.ok) {
        throw new Error('Submission failed');
      }
      
      if (result.status === 201) {
        setCompleted(true);
      } else {
        throw new Error(result.data?.error || 'Submission failed');
      }
    } catch (err) {
      console.error("Error submitting responses:", err);
      alert("There was an error submitting your responses. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    useEffect(() => {
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
    }, [router]);

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
        <QuestionRenderer
          question={currentQuestion}
          onResponse={(response) => handleResponse(currentQuestion._id, response)}
          currentResponse={responses[currentQuestion._id]}
        />
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