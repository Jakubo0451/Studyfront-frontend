'use client'
import React from 'react'
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

function closePopup() {
  document.querySelector('.detailsPopup').style.display = 'none';
}

export default function detailsPopup() {
  return (
    <div className="detailsPopup">
      <div className="closePopupBackground" onClick={closePopup}></div>
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
            <p><CiCalendar />Study created: 04.03.2025</p>
            <table>
              <tbody>
                <tr>
                  <td>Finished participants</td>
                  <td>26</td>
                </tr>
                <tr>
                  <td>Unfinished participants</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>Total participants</td>
                  <td>28</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Options</p>
          <div className="details-options">
            <button className="defaultBtn"><MdEdit />Edit study</button>
            <button className="yellowBtn"><FaPowerOff />End study</button>
            <button className="redBtn"><FaRegTrashAlt />Delete study</button>
          </div>
        </div>
        <div onClick={closePopup}>
          <button className="closeBtn" onClick={closePopup}><IoIosClose /></button>
        </div>
      </div>
    </div>
  )
}
