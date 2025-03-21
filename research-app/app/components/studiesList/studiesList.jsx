import React, { useState, useEffect } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { PiDownloadSimpleFill } from "react-icons/pi";
import Link from "next/link";

const StudiesList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Test data, replace with api call later
        const testData = [
            { header: 'Comparative example study', date: '04.03.2025', numberOfResponses: 28 },
            { header: 'Comparative example study', date: '04.03.2025', numberOfResponses: 28 },
            { header: 'Comparative example study', date: '04.03.2025', numberOfResponses: 28 },
            { header: 'Comparative example study', date: '04.03.2025', numberOfResponses: 28 },
            { header: 'Comparative example study', date: '04.03.2025', numberOfResponses: 28 },
            { header: 'Comparative example study', date: '04.03.2025', numberOfResponses: 28 },
        ];
        setData(testData);
    }, []);

    return (
        <div className="w-1/2 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="bg-sky-blue p-4 rounded shadow">
                        <h2 className="text-2xl mb-2 text-center">{item.header}</h2>
                        <div className="flex justify-between text-lg mb-4">
                            <div className="flex items-center">
                                <CiCalendar className="mr-1" />
                                <p>{item.date}</p>
                            </div>
                            <div className="flex items-center">
                                <IoPersonOutline className="mr-1" />
                                <p>{item.numberOfResponses}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 mb-2">
                            <Link href={`/edit/`} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center">Edit</Link>
                            <Link href={`/share/`} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center">Share</Link>
                        </div>
                        <div className="flex flex-wrap border-petrol-blue border-2 rounded p-1 gap-1">
                            <div className="flex text-petrol-blue grow items-center justify-center">
                                <PiDownloadSimpleFill className="!w-full !h-full"/>
                            </div>
                            <Link href={`/edit/`} className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center">.csv</Link>
                            <Link href={`/edit/`} className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center">.xml</Link>
                            <Link href={`/edit/`} className="bg-petrol-blue text-white rounded px-2 py-1 flex-grow text-center">.json</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudiesList;