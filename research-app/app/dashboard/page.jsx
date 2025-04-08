// app/dashboard/page.jsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header/Header.jsx';
import StudiesList from '../components/studiesList/studiesList.jsx';
import { FaPlus } from "react-icons/fa";
import SharePopup from '../components/sharePopup/sharePopup.jsx';
import DetailsPopup from '../components/detailsPopup/detailsPopup.jsx';

const Dashboard = () => {
  const [studies, setStudies] = useState([]);
  const [showCreateStudyPopup, setShowCreateStudyPopup] = useState(false);
  const [newStudyTitle, setNewStudyTitle] = useState('');
  const [newStudyDescription, setNewStudyDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/studies');
      if (!response.ok) {
        throw new Error('Failed to fetch studies');
      }
      const data = await response.json();
      setStudies(data);
    } catch (err) {
      console.error('Error fetching studies:', err);
      setError('Failed to load studies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleOpenCreateStudyPopup = () => {
    setShowCreateStudyPopup(true);
    setNewStudyTitle('');
    setNewStudyDescription('');
  };

  const handleCloseCreateStudyPopup = () => {
    setShowCreateStudyPopup(false);
  };

  const handleSaveNewStudy = async () => {
    try {
      const response = await fetch('/api/studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newStudyTitle, description: newStudyDescription }),
      });

      if (response.ok) {
        console.log('Study created successfully');
        handleCloseCreateStudyPopup();
        fetchStudies(); // Refresh the study list
      } else {
        const errorData = await response.json();
        console.error('Error creating study:', errorData.error || 'Failed to create study.');
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error('Error creating study:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div>
      <SharePopup />
      <DetailsPopup />
      <Header />
      <div className="flex flex-col items-center h-full">
        <h1 className="text-6xl mb-10 mt-10">Your studies</h1>
        <div className="w-full flex justify-center mb-10">
          <button
            onClick={handleOpenCreateStudyPopup}
            className="bg-petrol-blue text-white rounded px-4 py-2 flex items-center hover:bg-oxford-blue transition duration-300"
          >
            <FaPlus className="mr-2" />
            Create new study
          </button>
        </div>
        <StudiesList onStudiesUpdated={fetchStudies} />

        {showCreateStudyPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 backdrop-filter bg-opacity-20">
            <div className="bg-white p-8 rounded shadow-md">
              <h2 className="text-xl font-semibold mb-4">Create New Study</h2>
              <label htmlFor="title" className="block mb-2">Title:</label>
              <input
                type="text"
                id="title"
                className="w-full border rounded p-2 mb-4"
                value={newStudyTitle}
                onChange={(e) => setNewStudyTitle(e.target.value)}
              />
              <label htmlFor="description" className="block mb-2">Description:</label>
              <textarea
                id="description"
                className="w-full border rounded p-2 mb-4"
                value={newStudyDescription}
                onChange={(e) => setNewStudyDescription(e.target.value)}
              />
              <div className="flex justify-end">
                <button onClick={handleCloseCreateStudyPopup} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Cancel</button>
                <button onClick={handleSaveNewStudy} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;