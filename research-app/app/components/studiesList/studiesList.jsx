'use client';
import React, { useState, useEffect } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { PiDownloadSimpleFill } from "react-icons/pi";
import Link from "next/link";
import DetailsPopup from '../components/detailsPopup/DetailsPopup'; // Import your details popup component

const StudiesList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedStudyDetails, setSelectedStudyDetails] = useState(null);

    useEffect(() => {
        const fetchStudies = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/studies');
                if (!response.ok) {
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
        };
        fetchStudies();
    }, []);

    const openShare = (studyId) => {
        // Logic to open the share popup (you might need to pass the studyId)
        document.querySelector('.sharePopup').style.display = 'flex';
        // You might want to manage this state-based as well
    }

    const openDetails = async (studyId) => {
        setShowDetailsPopup(true);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/studies/${studyId}`);
            if (!response.ok) {
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

    if (loading) {
        return <p>Loading studies...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

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
                            <button onClick={() => openShare(item._id)} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300">Share</button>
                            <button onClick={() => openDetails(item._id)} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center cursor-pointer hover:bg-oxford-blue transition duration-300">Details</button>
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
                <DetailsPopup study={selectedStudyDetails} onClose={closeDetailsPopup} loading={loading} error={error} />
            )}
        </div>
    );
};

export default StudiesList;