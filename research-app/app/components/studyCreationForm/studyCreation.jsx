'use client';
import { useState } from 'react';

export default function StudyCreationForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [studyId, setStudyId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreationSuccess(false);
    setStudyId(null);

    try {
      const response = await fetch('/api/studyCreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setLoading(false);
        const studyData = await response.json();
        setCreationSuccess(true);
        setStudyId(studyData.id); // Store the newly created study ID
        // Optionally clear the form
        setTitle('');
        setDescription('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create study.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setLoading(false);
      console.error('Error creating study:', err);
    }
  };

  return (
    <div>
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

      {creationSuccess && studyId && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          Study created successfully! You can now add questions and upload files for study ID: {studyId}
        </div>
      )}

      {/* Here you will later add the UI for adding questions and uploading files */}
    </div>
  );
}