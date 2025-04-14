"use client";
import Header from 'app/components/header/Header.jsx';
import StudiesList from 'app/components/studiesList/studiesList.jsx';
import { FaPlus } from "react-icons/fa";
import SharePopup from 'app/components/sharePopup/sharePopup.jsx';
import backendUrl from 'environment';

export default function Dashboard() {
    const handleCreateStudy = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/studies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Untitled Study',
                    description: 'No description'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create study');
            }

            window.location.reload();

        } catch (error) {
            console.error('Error creating study:', error);
        }
    };

    return (
        <div>
            <SharePopup></SharePopup>
            <Header></Header>
            <div className="flex flex-col items-center h-full">
                <h1 className="text-6xl mb-10 mt-10">Your studies</h1>
                <div className="w-full flex justify-center mb-10">
                    <button 
                        onClick={handleCreateStudy}
                        className="bg-petrol-blue text-white rounded px-4 py-2 flex items-center hover:bg-oxford-blue transition duration-300"
                    >
                        <FaPlus className="mr-2"/>
                        Create new study
                    </button>
                </div>
                <StudiesList></StudiesList>
            </div>
        </div>
    )
}