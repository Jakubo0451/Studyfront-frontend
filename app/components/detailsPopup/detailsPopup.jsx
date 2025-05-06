'use client';
import { useState, useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { BsCalendar4 } from "react-icons/bs";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsPersonCheck, BsPersonX, BsPeople } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { fetchStudies, fetchStudyDetails, deleteStudy, startStudy, endStudy, editStudy } from "../../utils/studyActions";

export default function DetailsPopup({ study, onClose, onStudyDeleted, onStudyChange }) {
    const router = useRouter();
    const [studies, setStudies] = useState([]);

    useEffect(() => {
        fetchStudies(router, setStudies, console.error);
    }, [router]);

    const handleStudyChange = (e) => {
        const selectedStudyId = e.target.value;
        fetchStudyDetails(selectedStudyId, router, onStudyChange, console.error);
    };

    const handleDeleteStudy = () => {
        deleteStudy(study, router, onClose, onStudyDeleted, console.error);
    };

    const handleEdit = () => {
        editStudy(study, router);
        onClose();
    };

    const handleStartStudy = () => {
        startStudy(study, (updatedStudy) => {
            onStudyChange(updatedStudy);
        }, console.error);
    };

    const handleEndStudy = () => {
        endStudy(study, (updatedStudy) => {
            onStudyChange(updatedStudy);
        }, console.error);
    };

    return (
        <div className="detailsPopup" style={{ display: 'flex' }}>
            <div className="closePopupBackground" onClick={onClose}></div>
            <div>
                <div className="studyDetails">
                    <h1>Study details</h1>
                    <div htmlFor="study-select" className="dropDownIcon"><FaAngleDown /></div>
                    <select
                        name="study"
                        id="study-select"
                        value={study._id}
                        onChange={handleStudyChange}
                    >
                        {studies.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.title}
                            </option>
                        ))}
                    </select>
                    <h2>Information</h2>
                    <div className="study-info">
                        <p>
                            <BsCalendar4 />
                            Study created: {new Date(study.createdAt).toLocaleDateString()}
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
                            onClick={handleEdit}
                            className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center hover:bg-oxford-blue transition duration-300"
                        >
                            Edit Study
                        </button>
                        {study.active ? (
                            <button
                                type="button"
                                className="yellowBtn"
                                onClick={handleEndStudy}
                            >
                                <FaPowerOff />
                                End study
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="greenBtn"
                                onClick={handleStartStudy}
                            >
                                <FaPowerOff />
                                Start study
                            </button>
                        )}
                        <button type="button" onClick={handleDeleteStudy} className="redBtn"><FaRegTrashAlt />Delete study</button>
                    </div>
                </div>
                <div onClick={onClose}>
                    <button type="button" className="closeBtn" onClick={onClose}><IoIosClose /></button>
                </div>
            </div>
        </div>
    );
}