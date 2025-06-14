'use client';
import { useState, useEffect, useCallback } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { PiDownloadSimpleFill } from "react-icons/pi";
import DetailsPopup from '../detailsPopup/detailsPopup.jsx';
import backendUrl from 'environment';
import Loading from "@/loading.js";
import { useRouter } from 'next/navigation';
import { downloadAsCSV, downloadAsJSON, fetchStudyResults } from "@/utils/download.js";
import { startStudy, editStudy, endStudy } from "@/utils/studyActions.js";

const StudiesList = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedStudyDetails, setSelectedStudyDetails] = useState(null);
    const [responseCounts, setResponseCounts] = useState({});
    const [loadingResponses, setLoadingResponses] = useState({});
    const router = useRouter();

    const fetchResponseCounts = useCallback(async (studies) => {
        if (!Array.isArray(studies)) return;

        const counts = {};
        const loadingStatus = {};

        studies.forEach(study => {
            loadingStatus[study._id] = true;
        });

        setLoadingResponses(loadingStatus);

        await Promise.all(
            studies.map(async (study) => {
                try {
                    const responses = await fetchStudyResults(study._id);
                    counts[study._id] = Array.isArray(responses) ? responses.length : 0;
                } catch (error) {
                    console.error(`Error fetching responses for study ${study._id}:`, error);
                    counts[study._id] = 0;
                } finally {
                    setLoadingResponses(prev => ({
                        ...prev,
                        [study._id]: false
                    }));
                }
            })
        );

        setResponseCounts(counts);
    }, []);

    const fetchStudies = useCallback(async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/studies`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch studies');
            }

            const studies = await response.json();
            
            const currentDate = new Date();
            // eslint-disable-next-line no-unused-vars
            const updatedStudies = [...studies];
            
            const endDatePromises = studies
                .filter(study => 
                    study.active && 
                    !study.completed && 
                    study.endDate && 
                    new Date(study.endDate) < currentDate
                )
                .map(async (expiredStudy) => {
                    try {
                        await endStudy(expiredStudy, 
                            (updatedStudy) => {
                                setData(prevData => 
                                    prevData.map(study => 
                                        study._id === updatedStudy._id ? updatedStudy : study
                                    )
                                );
                                console.log(`Study ${expiredStudy.title} automatically marked as completed (past end date)`);
                            },
                            (error) => {
                                console.error(`Failed to auto-complete study ${expiredStudy.title}:`, error);
                            }
                        );
                        
                        return {
                            ...expiredStudy,
                            active: false,
                            completed: true
                        };
                    } catch (err) {
                        console.error(`Error processing study ${expiredStudy.title}:`, err);
                        return expiredStudy;
                    }
                });
                
            if (endDatePromises.length > 0) {
                await Promise.all(endDatePromises);
                fetchStudies();
            } else {
                setData(studies);
            }

            fetchResponseCounts(studies);
        } catch (err) {
            console.error("Error fetching studies:", err);
            setError('Failed to load studies.');
        } finally {
            setLoading(false);
        }
    }, [router, fetchResponseCounts]);

    useEffect(() => {
        fetchStudies();
    }, [fetchStudies, refreshTrigger]);

    const openShare = (studyId) => {
        if (typeof window !== 'undefined' && window.openSharePopup) {
            window.openSharePopup(studyId);
        } else {
            const sharePopup = document.querySelector('.sharePopup');
            if (sharePopup) {
                sharePopup.style.display = 'flex';
                
                const selectElement = sharePopup.querySelector('#study-select');
                if (selectElement && studyId) {
                    selectElement.value = studyId;
                    const event = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(event);
                }
            }
        }
    };

    const openDetails = async (studyId) => {
        setShowDetailsPopup(true);
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${backendUrl}/api/studies/${studyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    router.push('/login');
                    return;
                }
                throw new Error(`Failed to fetch study details for ID: ${studyId}`);
            }

            const details = await response.json();
            setSelectedStudyDetails(details);
        } catch (err) {
            console.error("Error fetching study details:", err);
            setError('Failed to load study details.');
            setSelectedStudyDetails(null);
        } finally {
            setLoading(false);
        }
    };

    const closeDetailsPopup = () => {
        setShowDetailsPopup(false);
        setSelectedStudyDetails(null);
        setError(null);
    };

    const handleStudyDeleted = useCallback(() => {
        fetchStudies();
    }, [fetchStudies]);

    const handleStudyUpdated = (updatedStudy) => {
        setData((prevData) =>
            prevData.map((study) =>
                study._id === updatedStudy._id ? updatedStudy : study
            )
        );
    };

    return (
        <div className="w-1/2 p-4">
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="text-center text-red-500">
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    {/* Active Studies Section */}
                    {data.some((item) => item.active) && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Active Studies</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-2 border-petrol-blue rounded p-4">
                                {data
                                    .filter((item) => item.active)
                                    .map((item, index) => (
                                        <div key={index} className="bg-sky-blue p-4 rounded shadow">
                                            <h2 className="text-2xl mb-2 text-center">{item.title}</h2>
                                            <div className="flex justify-between text-lg mb-4">
                                                <div className="flex items-center">
                                                    <CiCalendar className="mr-1" />
                                                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <IoPersonOutline className="mr-1" />
                                                    <p>
                                                        {loadingResponses[item._id] ? (
                                                            <span className="text-gray-500 text-sm">Loading...</span>
                                                        ) : responseCounts[item._id] !== undefined ? (
                                                            responseCounts[item._id]
                                                        ) : (
                                                            0
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openShare(item._id)}
                                                    className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300"
                                                >
                                                    Share
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openDetails(item._id)}
                                                    className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300"
                                                >
                                                    Options
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap border-petrol-blue border-2 rounded p-1 gap-1">
                                                <div className="flex text-petrol-blue grow items-center justify-center">
                                                    <PiDownloadSimpleFill className="!w-full !h-full" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => downloadAsCSV(item._id)}
                                                    className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300"
                                                >
                                                    .csv
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => downloadAsJSON(item._id)}
                                                    className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300"
                                                >
                                                    .json
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Inactive Studies Section */}
                    {data.some((item) => !item.active) && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Inactive Studies</h2>
                            <div className="border-2 border-petrol-blue rounded p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data
                                        .filter((item) => !item.active)
                                        .map((item, index) => (
                                            <div key={index} className="bg-sky-blue p-4 rounded shadow">
                                                <h2 className="text-2xl mb-2 text-center">{item.title}</h2>

                                                {item.completed ? (
                                                    <div className="flex items-center justify-center bg-green-500 rounded-sm mb-2">
                                                        <p className="text-white">Completed</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                    </div>
                                                )}

                                                <div className="flex justify-between text-lg mb-4">
                                                    <div className="flex items-center">
                                                        <CiCalendar className="mr-1" />
                                                        <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <IoPersonOutline className="mr-1" />
                                                        <p>
                                                            {loadingResponses[item._id] ? (
                                                                <span className="text-gray-500 text-sm">Loading...</span>
                                                            ) : responseCounts[item._id] !== undefined ? (
                                                                responseCounts[item._id]
                                                            ) : (
                                                                0
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 mb-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => editStudy(item, router)}
                                                        className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDetails(item._id)}
                                                        className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300"
                                                    >
                                                        Options
                                                    </button>
                                                </div>
                                                {item.completed ? (
                                                    <div className="flex flex-wrap border-petrol-blue border-2 rounded p-1 gap-1">
                                                    <div className="flex text-gray-500 grow items-center justify-center">
                                                        <PiDownloadSimpleFill className="!w-full !h-full" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadAsCSV(item._id, `${item.title || "study"}.csv`)}
                                                        className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300"
                                                    >
                                                        .csv
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadAsJSON(item._id, `${item.title || "study"}.json`)}
                                                        className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300"
                                                    >
                                                        .json
                                                    </button>
                                                    </div>
                                                ):(
                                                    <div className="flex w-full">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                startStudy(item, (updatedStudy) => {
                                                                    setData((prevData) =>
                                                                        prevData.map((study) =>
                                                                            study._id === updatedStudy._id ? updatedStudy : study
                                                                        )
                                                                    );
                                                                }, (error) => {
                                                                    console.error("Failed to start study:", error);
                                                                });
                                                            }}
                                                            className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300"
                                                        >
                                                            Publish Study
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showDetailsPopup && selectedStudyDetails && (
                <DetailsPopup
                study={selectedStudyDetails}
                onClose={closeDetailsPopup}
                onStudyDeleted={handleStudyDeleted}
                onStudyChange={(updatedStudy) => {
                    handleStudyUpdated(updatedStudy);
                    setSelectedStudyDetails(updatedStudy);
                }}
            />
            )}
        </div>
    );
};

export default StudiesList;