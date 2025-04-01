'use client'
import React from 'react'
import { FaRegCopy } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";

function closePopup() {
  document.querySelector('.sharePopup').style.display = 'none';
}

function copyLink() {
  // selects the input field with the sharable link and copies it
  const link = document.getElementById('share-link');
  link.select();
  link.setSelectionRange(0, 99999);
  document.execCommand('copy');
  // show Copied! message after copying
  document.querySelector('.copyBtn').classList.add('copiedLink');
  setTimeout(() => {
    document.querySelector('.copyBtn').classList.remove('copiedLink');
  }, 3000);
}

function sendEmails() {
  // after emails have successfully been sent
  document.querySelector('.sendBtn').classList.add('sentEmails');
  setTimeout(() => {
    document.querySelector('.sendBtn').classList.remove('sentEmails');
  }, 3000);
}

export default function sharePopup() {
  return (
    <div className="sharePopup">
      <div className="closePopupBackground" onClick={closePopup}></div>
      <div>
        <div  className="shareStudy">
          <h1>Share study</h1>
          <div htmlFor="study-select" className="dropDownIcon"><FaAngleDown /></div>
          <select name="study" id="study-select">
            <option value="study1">Comparative example study</option>
            <option value="study2">Study 2</option>
            <option value="study3">Study 3</option>
          </select>
          <label htmlFor="share-link">Sharable link</label>
          <div className="share-link">
            <input type="text" id="share-link" value="https://studyfront.com/study/1" readOnly />
            <button className="copyBtn" title="Copy link" onClick={copyLink}><FaRegCopy /></button>
          </div>
          <label htmlFor="share-email">Share by email</label>
          <div className="share-email">
            <textarea type="email" id="share-email" placeholder="participant1@example.com participant2@example.com" />
            <button className="sendBtn" title="Send invite(s)" onClick={sendEmails}><IoSend /></button>
          </div>
        </div>
        <div onClick={closePopup}>
          <button className="closeBtn" title="Close menu" onClick={closePopup}><IoIosClose /></button>
        </div>
      </div>
    </div>
  )
}
