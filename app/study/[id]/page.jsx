'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import backendUrl from 'environment';
import StudyTakeComponent from 'app/components/studyTake/StudyTakeComponent';

export default function TakeStudyPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [study, setStudy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(30);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        // Check if we're in preview mode
        const isPreview = searchParams.get('preview') === 'true';
        
        // Normal fetch code
        const response = await fetch(`${backendUrl}/api/studies/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch study');
        }

        const data = await response.json();
        console.log('Fetched study data:', data);
        
        // If we're in preview mode, make sure the study is allowed to be taken
        if (isPreview) {
          // Force the study to be active in preview mode
          data.active = true;
        }
        
        setStudy(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching study:', error);
        setError('Failed to load study');
        setLoading(false);
      }
    };

    fetchStudy();
  }, [params.id]);

  useEffect(() => {
    if (study && !study.active) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [study, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ice-blue p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petrol-blue"></div>
        <div className="text-xl text-petrol-blue ml-[1rem]">Loading study...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sky-blue p-8 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-petrol-blue text-white rounded hover:bg-oxford-blue transition-colors duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!study?.active) {
    return (
      <div className="min-h-screen bg-sky-blue p-8 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-petrol-blue mb-4">Study Has Ended</h2>
          <p className="mb-6 text-gray-600">
            Thank you for your interest, but this study is no longer accepting responses.
          </p>
          <div className="my-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-petrol-blue h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${(redirectCountdown / 30) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              Redirecting in {redirectCountdown} seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ice-blue p-8 flex justify-center">
      <StudyTakeComponent 
        study={study} 
        previewMode={searchParams.get('preview') === 'true'} 
      />
    </div>
  );
}