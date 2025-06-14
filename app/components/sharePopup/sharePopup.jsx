'use client'
import { useState, useEffect, useRef } from 'react';
import { FaRegCopy } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import backendUrl from 'environment';

export default function SharePopup({ study, onStudyChange }) {
  const router = useRouter();
  const [studies, setStudies] = useState([]);
  const [currentStudy, setCurrentStudy] = useState(study);
  /* eslint-disable-next-line */
  const [studyDetails, setStudyDetails] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const pendingStudyIdRef = useRef(null);

  // Fetch studies whenever visibility changes to true
  useEffect(() => {
    if (isVisible) {
      fetchStudies();
    }
  }, [isVisible]);

  // Make openPopup function available globally but safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store the original function if it exists
      const originalFunction = window.openSharePopup;
      
      // Create our new function
      window.openSharePopup = (studyId) => {
        const popup = document.querySelector('.sharePopup');
        if (popup) {
          popup.style.display = 'flex';
          setIsVisible(true);
          pendingStudyIdRef.current = studyId; // Store ID to select after fetching
        }
      };
      
      // Cleanup function to restore original or remove ours
      return () => {
        if (typeof window !== 'undefined') {
          if (originalFunction) {
            window.openSharePopup = originalFunction;
          } else {
            delete window.openSharePopup;
          }
        }
      };
    }
  }, []);

  const fetchStudies = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${backendUrl}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch studies');
      }

      const data = await response.json();
      setStudies(data);
      
      // Handle the pending study ID if one was requested
      if (pendingStudyIdRef.current) {
        const studyToSelect = data.find(s => s._id === pendingStudyIdRef.current);
        if (studyToSelect) {
          setCurrentStudy(studyToSelect);
          fetchStudyDetails(studyToSelect._id);
        }
        pendingStudyIdRef.current = null; // Clear the pending ID
      }
      // Otherwise use the study prop or default to first active study
      else if (study) {
        setCurrentStudy(study);
        fetchStudyDetails(study._id);
      } else {
        const firstActiveStudy = data.find(s => s.active);
        if (firstActiveStudy) {
          setCurrentStudy(firstActiveStudy);
          fetchStudyDetails(firstActiveStudy._id);
        }
      }
    } catch (error) {
      console.error('Error fetching studies:', error);
    }
  };

  const fetchStudyDetails = async (studyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/studies/${studyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch study details');
      const details = await response.json();
      setStudyDetails(details);
    } catch (error) {
      console.error('Error fetching study details:', error);
    }
  };

  const handleStudyChange = (e) => {
    const selectedStudyId = e.target.value;
    const selectedStudy = studies.find(s => s._id === selectedStudyId);
    if (selectedStudy) {
      setCurrentStudy(selectedStudy);
      fetchStudyDetails(selectedStudyId);
      if (onStudyChange) {
        onStudyChange(selectedStudy);
      }
    }
  };

  function closePopup() {
    if (typeof window !== 'undefined') {
      const popup = document.querySelector('.sharePopup');
      if (popup) popup.style.display = 'none';
      setIsVisible(false);
    }
  }

  function copyLink() {
    // Ensure this code runs only on the client side
    if (typeof window !== "undefined") {
        const link = document.getElementById("share-link");
        link.select();
        link.setSelectionRange(0, 99999);
        document.execCommand("copy");

        // Show "Copied!" message after copying
        const copyButton = document.querySelector(".copyBtn");
        if (copyButton) {
            copyButton.classList.add("copiedLink");
            setTimeout(() => {
                copyButton.classList.remove("copiedLink");
            }, 3000);
        }
    }
  }

  return (
    <div className="sharePopup">
      <div className="closePopupBackground" onClick={closePopup}></div>
      <div>
        <div className="shareStudy">
          <h1>Share study</h1>
          <div className="dropDownIcon"><FaAngleDown /></div>
          <select 
            name="study" 
            id="study-select"
            value={currentStudy?._id || ''}
            onChange={handleStudyChange}
          >
            {studies.filter(s => s.active).length > 0 ? (
              studies.filter(s => s.active).map((s) => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))
            ) : (
              <option value="">No active studies available</option>
            )}
          </select>
          <label htmlFor="share-link">Sharable link</label>
          <div className="share-link">
            <input 
              type="text" 
              id="share-link" 
              value={
                typeof window !== "undefined" && currentStudy?._id
                  ? `${window.location.origin}/study/${currentStudy._id}`
                  : ""
              } 
              readOnly 
            />
            <button type="button" className="copyBtn" title="Copy link" onClick={copyLink}>
              <FaRegCopy />
            </button>
          </div>
          {/* <label htmlFor="share-email">Share by email</label>
          <div className="share-email">
            <textarea type="email" id="share-email" placeholder="participant1@example.com participant2@example.com" />
            <button type="button" className="sendBtn" title="Send invite(s)" onClick={sendEmails}><IoSend /></button>
          </div> */}
        </div>
        <div onClick={closePopup}>
          <button type="button" className="closeBtn" title="Close menu" onClick={closePopup}><IoIosClose /></button>
        </div>
      </div>
    </div>
  );
}
