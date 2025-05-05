'use client';
import { useState, useEffect, useCallback } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { PiDownloadSimpleFill } from "react-icons/pi";
import Link from "next/link";
import DetailsPopup from '../detailsPopup/detailsPopup.jsx';
import backendUrl from 'environment';
import { useRouter } from 'next/navigation';

const StudiesList = ({ refreshTrigger }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedStudyDetails, setSelectedStudyDetails] = useState(null);
    const router = useRouter();

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
            setData(studies);
        } catch (err) {
            console.error("Error fetching studies:", err);
            setError('Failed to load studies.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchStudies();
    }, [fetchStudies, refreshTrigger]);

    const openShare = () => {
        document.querySelector('.sharePopup').style.display = 'flex';
    }

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
    }

    const closeDetailsPopup = () => {
        setShowDetailsPopup(false);
        setSelectedStudyDetails(null);
        setError(null);
    }

    const handleStudyDeleted = useCallback(() => {
        fetchStudies();
    }, [fetchStudies]);

    return (
        <div className="w-1/2 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="bg-sky-blue p-4 rounded shadow">
                        <h2 className="text-2xl mb-2 text-center">{item.title}</h2>
                        <div className="flex justify-between text-lg mb-4">
                            <div className="flex items-center">
                                <CiCalendar className="mr-1" />
                                <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center">
                                <IoPersonOutline className="mr-1" />
                                <p>{item.questions ? item.questions.length : 0}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 mb-2">
                            <button type="button" onClick={() => openShare(item._id)} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300">Share</button>
                            <button type="button" onClick={() => openDetails(item._id)} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300">Details</button>
                        </div>
                        <div className="flex flex-wrap border-petrol-blue border-2 rounded p-1 gap-1">
                            <div className="flex text-petrol-blue grow items-center justify-center">
                                <PiDownloadSimpleFill className="!w-full !h-full"/>
                            </div>
                            <Link href={`/csvDownloadLink/`} className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300">.csv</Link>
                            <Link href={`/xmlDownloadLink/`} className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300">.xml</Link>
                            <Link href={`/jsonDownloadLink/`} className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center hover:bg-oxford-blue transition duration-300">.json</Link>
                        </div>
                    </div>
                ))}
            </div>

            {showDetailsPopup && selectedStudyDetails && (
                <DetailsPopup
                    study={selectedStudyDetails}
                    onClose={closeDetailsPopup}
                    onStudyDeleted={handleStudyDeleted}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
};

export default StudiesList;