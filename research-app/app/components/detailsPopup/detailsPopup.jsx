'use client'
import React from 'react'
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { BsCalendar4 } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { BsPersonX } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import {useRouter} from 'next/navigation';

export default function DetailsPopup({study, onClose, onStudyDeleted}) {
  const router = useRouter();
  
  const handleDeleteStudy = async () => {
    if (!study?._id) {
      console.error("Study ID is missing for deletion.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the study "${study.title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/studies/${study._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log(`Study "${study.title}" deleted successfully.`);
          onClose();
          if (onStudyDeleted) {
            onStudyDeleted();
          }
        } else {
          const errorData = await response.json();
          console.error('Error deleting study:', errorData.error || 'Failed to delete study.');
        }
      } catch (error) {
        console.error('Error deleting study:', error);
      }
    }
  };

  return (
    <div className="detailsPopup" style={{display: 'flex'}}>
      <div className="closePopupBackground" onClick={onClose}></div>
      <div>
        <div className="studyDetails">
          <h1>Study details</h1>
          <div htmlFor="study-select" className="dropDownIcon"><FaAngleDown /></div>
          <select name="study" id="study-select">
            <option value="study1">Comparative example study</option>
            <option value="study2">Study 2</option>
            <option value="study3">Study 3</option>
          </select>
          <h2>Information</h2>
          <div className="study-info">
            <p><BsCalendar4 />Study created: 04.03.2025</p>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <BsPersonCheck />
                      Finished participants
                    </div>
                  </td>
                  <td>26</td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <BsPersonX />
                      Unfinished participants
                    </div>
                  </td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <BsPeople />
                      Total participants
                    </div>
                  </td>
                  <td>28</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Options</p>
          <div className="details-options">
            <button className="defaultBtn"><MdEdit />Edit study</button>
            <button className="yellowBtn"><FaPowerOff />End study</button>
            <button onClick={handleDeleteStudy} className="redBtn"><FaRegTrashAlt />Delete study</button>
          </div>
        </div>
        <div onClick={onClose}>
          <button className="closeBtn" onClick={onClose}><IoIosClose /></button>
        </div>
      </div>
    </div>
  )
}