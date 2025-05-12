"use client";
import Header from 'app/components/header/Header.jsx';
import StudiesList from 'app/components/studiesList/studiesList.jsx';
import { FaPlus } from "react-icons/fa";
import SharePopup from 'app/components/sharePopup/sharePopup.jsx';
import { createStudy } from 'app/utils/studyActions.js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Dashboard() {
    const router = useRouter();
    const [shouldRefresh] = useState(false);
    const [createdStudy, setCreatedStudy] = useState(null);

    const handleStudyChange = (study) => {
        setCreatedStudy(study);
    };

    const handleCreateStudy = () => {
        createStudy(router, (errorMessage) => {
            alert(errorMessage);
        });
    };

    return (
        <div>
            <SharePopup study={createdStudy} onStudyChange={handleStudyChange} />
            <Header/>
            <div className="flex flex-col items-center h-full">
                <h1 className="text-6xl mb-10 mt-10">Your studies</h1>
                <div className="w-full flex justify-center mb-10">
                    <button 
                        type="button"
                        onClick={handleCreateStudy}
                        className="bg-petrol-blue text-white rounded px-4 py-2 flex items-center hover:bg-oxford-blue transition duration-300"
                    >
                        <FaPlus className="mr-2"/>
                        Create new study
                    </button>
                </div>
                <StudiesList refreshTrigger={shouldRefresh} />
            </div>
        </div>
    );
}