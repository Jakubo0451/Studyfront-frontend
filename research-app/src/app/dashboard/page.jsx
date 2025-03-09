"use client";
import Header from '@/components/header/Header.jsx'
import StudiesList from '@/components/studiesList/StudiesList.jsx'

export default function Dashboard() {
    return (
        <div>
            <Header></Header>
            <div className="flex flex-col items-center min-h-screen">
                <h1 className="text-6xl mb-4 mt-4">Your studies</h1>
                <div className="w-full flex justify-center">
                    <button className="bg-petrol-blue text-white rounded px-4 py-2">
                        Click Me
                    </button>
                </div>
                <StudiesList></StudiesList>
            </div>
        </div>
    )
}