'use client';
import { useState, useEffect } from 'react';
import { RiPencilLine } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { IoPlayOutline } from 'react-icons/io5';
import { FaAngleDown } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsPeople, BsCalendar4 } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { fetchStudies, fetchStudyDetails, deleteStudy, startStudy, endStudy, editStudy } from "../../utils/studyActions";
import { fetchStudyResults } from '@/utils/download';

export default function DetailsPopup({ study, onClose, onStudyDeleted, onStudyChange }) {
    const router = useRouter();
    const [studies, setStudies] = useState([]);
    const [responseCount, setResponseCount] = useState(null);
    const [loadingResponses, setLoadingResponses] = useState(false);

    useEffect(() => {
        fetchStudies(router, setStudies, console.error);
    }, [router]);
    
    useEffect(() => {
        if (study?._id) {
            fetchResponseCount(study._id);
        }
    }, [study]);

    const fetchResponseCount = async (studyId) => {
        setLoadingResponses(true);
        try {
            const responses = await fetchStudyResults(studyId);
            setResponseCount(Array.isArray(responses) ? responses.length : 0);
        } catch (error) {
            console.error("Error fetching response count:", error);
            setResponseCount(0);
        } finally {
            setLoadingResponses(false);
        }
    };

    const handleStudyChange = (e) => {
        const selectedStudyId = e.target.value;
        fetchStudyDetails(selectedStudyId, router, onStudyChange, console.error);
    };

    const handleStudyUpdate = () => {
        if (onStudyDeleted) {
            onStudyDeleted();
        }
        onClose();
    };

    const handleDeleteStudy = () => {
        if (window.confirm('Are you sure you want to delete this study?')) {
            deleteStudy(study, router, onClose, onStudyDeleted, (error) => {
                alert('Failed to delete study: ' + error);
            });
        }
    };

    const handleEdit = () => {
        editStudy(study, router);
        onClose();
    };

    const handleStartStudy = () => {
        startStudy(study, handleStudyUpdate, (error) => {
            alert('Failed to start study: ' + error);
        });
    };

    const handleEndStudy = () => {
        endStudy(study, handleStudyUpdate, (error) => {
            alert('Failed to end study: ' + error);
        });
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
                                            <BsPeople />
                                            Total participants
                                        </div>
                                    </td>
                                    <td>
                                        {loadingResponses ? (
                                            <span>Loading...</span>
                                        ) : responseCount !== null ? (
                                            responseCount
                                        ) : (
                                            <span>Unknown</span>
                                        )}
                                    </td>
                                </tr>
                                {study.startedAt && (
                                <tr>
                                    <td>
                                        <div>
                                            <IoPlayOutline />
                                            Study started at:
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(study.startedAt).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                                )}
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
                            <RiPencilLine />
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
};