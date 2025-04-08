// components/detailsPopup/DetailsPopup.jsx
'use client';
import React from 'react';
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { BsCalendar4 } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { BsPersonX } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { useRouter } from 'next/navigation';

const DetailsPopup = ({ study, onClose, onStudyDeleted }) => {
  const router = useRouter();

  if (!study) {
    return null;
  }

  const handleDeleteStudy = async () => {
    if (!window.confirm(`Are you sure you want to delete the study "${study.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/studies/${study._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Study "${study.title}" deleted successfully.`);
        onClose(); // Close the popup
        if (onStudyDeleted) {
          onStudyDeleted(); // Notify the parent component to refresh the study list
        }
      } else {
        const errorData = await response.json();
        console.error('Error deleting study:', errorData.error || 'Failed to delete study.');
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting study:', error);
      // Optionally display an error message to the user
    }
  };

  const handleEditStudy = () => {
    router.push(`/create?edit=${study._id}`); // Redirect to the create page with the study ID for editing
    onClose(); // Close the popup
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(5px)',
      backgroundColor: 'transparent',
      zIndex: 50, // Ensure it's on top of other elements
    }}>
      <div className="bg-white p-8 rounded shadow-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <IoIosClose size={24} />
        </button>
        <div className="studyDetails">
          <h1>Study details</h1>
          <h2>Information</h2>
          <div className="study-info">
            <p><BsCalendar4 />Study created: {new Date(study.createdAt).toLocaleDateString()}</p>
            <table>
              <tbody>
                <tr><td><div><BsPersonCheck />Finished participants</div></td><td>{study.finishedParticipants || 'N/A'}</td></tr>
                <tr><td><div><BsPersonX />Unfinished participants</div></td><td>{study.unfinishedParticipants || 'N/A'}</td></tr>
                <tr><td><div><BsPeople />Total participants</div></td><td>{study.totalParticipants || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
          <p>Options</p>
          <div className="details-options">
            <button className="defaultBtn" onClick={handleEditStudy}><MdEdit />Edit study</button>
            <button className="yellowBtn"><FaPowerOff />End study</button>
            <button className="redBtn" onClick={handleDeleteStudy}><FaRegTrashAlt />Delete study</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPopup;