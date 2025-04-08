"use client";
import React, { useState } from "react";
import Header from '../components/header/Header.jsx'
import SideBar from "../components/studyCreator/sideBar.jsx";
import StudyCreationForm from '../components/studyCreationForm/studyCreation.jsx';
import RatingQ from '../components/questionTypes/ratingQ.jsx';

export default function page() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex h-full flex-row">
        <SideBar />
        <RatingQ />
      </div>
      <StudyCreationForm />
    </div>
  );
}