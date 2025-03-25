'use client'
import React from 'react'
import { FaRegCopy } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

function closePopup() {
  document.querySelector('.sharePopup').style.display = 'none';
}

export default function sharePopup() {
  return (
    <div className="sharePopup">
      <div>
        <div  className="shareStudy">
          <h1>Share study</h1>
          <select name="study" id="study-select">
            <option value="study1">Comparative example study</option>
            <option value="study2">Study 2</option>
            <option value="study3">Study 3</option>
          </select>
          <label htmlFor="share-link">Sharable link</label>
          <div className="share-link">
            <input type="text" id="share-link" value="https://studyfront.com/study/1" readOnly />
            <button className="copyBtn"><FaRegCopy /></button>
          </div>
          <label htmlFor="share-email">Share by email</label>
          <div className="share-email">
            <textarea type="email" id="share-email" placeholder="participant1@example.com participant2@example.com" />
            <button className="sendBtn"><IoSend /></button>
          </div>
        </div>
        <div>
          <button className="closeBtn" onClick={closePopup}><IoIosClose /></button>
        </div>
      </div>
    </div>
  )
}
