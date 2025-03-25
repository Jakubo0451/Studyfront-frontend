'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudyCreationForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/studyCreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setLoading(false);
        const studyData = await response.json();
        router.push(`/studies/${studyData.id}`);
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
  );
}