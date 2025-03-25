'use client'
import React from 'react'
import { IoIosClose } from "react-icons/io";

function closePopup() {
  document.querySelector('.detailsPopup').style.display = 'none';
}

export default function detailsPopup() {
  return (
    <div className="detailsPopup">
      <div>
        <div className="studyDetails">
          <h1>Study details</h1>
          <select name="study" id="study-select">
            <option value="study1">Comparative example study</option>
            <option value="study2">Study 2</option>
            <option value="study3">Study 3</option>
          </select>
          <h2>Information</h2>
          <div className="study-info">
            <p>Created: 04.03.2025</p>
            <p>Participants that finished: 26</p>
            <p>Participants that did not finish: 2</p>
            <p>Total participants: 28</p>
          </div>
          <p>Options</p>
          <div className="share-email">
            <button className="defaultBtn">Edit</button>
            <button className="yellowBtn">End study</button>
            <button className="redBtn">Delete study</button>
          </div>
        </div>
        <div>
          <button className="closeBtn" onClick={closePopup}><IoIosClose /></button>
        </div>
      </div>
    </div>
  )
}
