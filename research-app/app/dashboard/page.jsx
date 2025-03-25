"use client";
import Header from '../components/header/Header.jsx'
import StudiesList from '../components/studiesList/studiesList.jsx'
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import SharePopup from '../components/sharePopup/sharePopup.jsx'

export default function Dashboard() {
    return (
        <div>
            <SharePopup></SharePopup>
            <Header></Header>
            <div className="flex flex-col items-center h-full">
                <h1 className="text-6xl mb-10 mt-10">Your studies</h1>
                <div className="w-full flex justify-center mb-10">
                    <Link href="/create" className="bg-petrol-blue text-white rounded px-4 py-2 flex items-center">
                        <FaPlus className="mr-2"/>
                        Create new study
                    </Link>
                </div>
                <StudiesList></StudiesList>
            </div>
        </div>
    )
}