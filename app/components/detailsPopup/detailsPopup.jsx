'use client';
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { BsCalendar4 } from "react-icons/bs";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsPersonCheck, BsPersonX, BsPeople } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { deleteStudy, startStudy, endStudy, editStudy } from "../../utils/studyActions";

export default function DetailsPopup({ study, onClose, onStudyDeleted, onStudyUpdated }) {
    const router = useRouter();

    return (
        <div className="detailsPopup" style={{ display: "flex" }}>
            <div className="closePopupBackground" onClick={onClose}></div>
            <div>
                <div className="studyDetails">
                    <h1>Study details</h1>
                    <div htmlFor="study-select" className="dropDownIcon">
                        <FaAngleDown />
                    </div>
                    <select name="study" id="study-select">
                        <option value="study1">{study.title}</option>
                        <option value="study2">Study 2</option>
                        <option value="study3">Study 3</option>
                    </select>
                    <h2>Information</h2>
                    <div className="study-info">
                        <p>
                            <BsCalendar4 />
                            Study created: 04.03.2025
                        </p>
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
                    <div className="details-options flex space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={() => editStudy(study, router)}
                            className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center hover:bg-oxford-blue transition duration-300"
                        >
                            Edit Study
                        </button>

                        {study.active ? (
                            <button
                                type="button"
                                className="yellowBtn"
                                onClick={() => endStudy(study, onStudyUpdated, console.error)}
                            >
                                <FaPowerOff />
                                End study
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="greenBtn"
                                onClick={() => startStudy(study, onStudyUpdated, console.error)}
                            >
                                <FaPowerOff />
                                Start study
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => deleteStudy(study, onStudyDeleted, console.error)}
                            className="redBtn"
                        >
                            <FaRegTrashAlt />
                            Delete study
                        </button>
                    </div>
                </div>
                <div onClick={onClose}>
                    <button type="button" className="closeBtn" onClick={onClose}>
                        <IoIosClose />
                    </button>
                </div>
            </div>
        </div>
    );
}