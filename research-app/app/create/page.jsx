"use client";
import React, { useState } from "react";
import Header from '../components/header/Header.jsx';
import SideBar from "../components/studyCreator/sideBar.jsx";
import StudyCreationForm from '../components/studyCreationForm/studyCreation.jsx';

export default function CreateStudyPage() {
  const [studyId, setStudyId] = useState(null);
  const [studyCreated, setStudyCreated] = useState(false);

  const handleStudyCreated = (newStudyId) => {
    setStudyId(newStudyId);
    setStudyCreated(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex h-full flex-row">
        <SideBar />
        <div className="flex-1 p-4">
          {!studyCreated ? (
            <StudyCreationForm onStudyCreated={handleStudyCreated} />
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Questions and Files to Study ID: {studyId}</h2>
              {/* UI for choosing question type and adding questions will go here */}
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
                Add Question
              </button>
              {/* Placeholder for displaying added questions */}
              <div className="mt-4">
                {/* List of added question components will be rendered here */}
              </div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Save Study
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}