'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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