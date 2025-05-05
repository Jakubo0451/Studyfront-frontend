'use client';
import { useState } from 'react';
import backendUrl from 'environment';

export default function StudyCreationForm({ onStudyCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createStudy = async (studyData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${backendUrl}/api/studies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studyData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create study');
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const studyData = await createStudy({ title, description });
      setLoading(false);
      if (onStudyCreated) {
        onStudyCreated(studyData.id);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
      console.error('Error creating study:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create New Study</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Study'}
        </button>
      </form>
    </div>
  );
}