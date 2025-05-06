"use client";
import Header from 'app/components/header/Header.jsx';
import StudiesList from 'app/components/studiesList/studiesList.jsx';
import { FaPlus } from "react-icons/fa";
import SharePopup from 'app/components/sharePopup/sharePopup.jsx';
import backendUrl from 'environment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Dashboard() {
    const router = useRouter();
    const [shouldRefresh] = useState(false);

    const handleCreateStudy = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // First fetch existing studies to determine the next number
            const studiesResponse = await fetch(`${backendUrl}/api/studies`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!studiesResponse.ok) {
                throw new Error('Failed to fetch studies');
            }

            const existingStudies = await studiesResponse.json();
            
            // Find the highest number in existing "Untitled Study X" titles
            const untitledPattern = /^Untitled Study (\d+)$/;
            let highestNumber = 0;

            existingStudies.forEach(study => {
                const match = study.title.match(untitledPattern);
                if (match) {
                    const number = parseInt(match[1]);
                    highestNumber = Math.max(highestNumber, number);
                }
            });

            // Create new study with incremented number
            const newNumber = highestNumber + 1;
            const response = await fetch(`${backendUrl}/api/studies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: `Untitled Study ${newNumber}`,
                    description: 'No description'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create study');
            }

            const newStudy = await response.json();
            router.push(`/create?studyId=${newStudy._id}`);
        } catch (error) {
            console.error('Error creating study:', error);
            alert(error.message);
        }
    };

    return (
        <div>
            <SharePopup/>
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
    )
}