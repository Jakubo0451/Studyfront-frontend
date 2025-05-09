'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import backendUrl from 'environment';
import StudyTakeComponent from 'app/components/studyTake/StudyTakeComponent';

export default function TakeStudyPage() {
  const params = useParams();
  const router = useRouter();
  const [study, setStudy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
        
        // Validate study ID format (24 character hex string)
        const isValidId = /^[0-9a-fA-F]{24}$/.test(params.id);
        if (!isValidId) {
          setError('Invalid study ID format');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/studies/public/${params.id}`);
        
        if (response.data) {
          if (!response.data.questions || response.data.questions.length === 0) {
            setError('This study has no questions');
            return;
          }
          setStudy(response.data);
        }
      } catch (err) {
        console.error('Error fetching study:', err.response?.data || err);
        
        if (err.response?.status === 404) {
          setError('Study not found: ' + (err.response?.data?.message || 'This study does not exist'));
        } else if (err.response?.status === 400) {
          setError('Invalid study: ' + (err.response?.data?.message || 'Invalid study ID format'));
        } else {
          setError('Error: ' + (err.response?.data?.message || 'Unable to load study'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Loading study...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">{error}</div>
        <button 
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return <StudyTakeComponent study={study} />;
}