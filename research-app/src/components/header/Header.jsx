import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaBars } from "react-icons/fa";
import logo from "../../../public/logo/logo.png";

export default function Header() {
    return (
        <header className="bg-sky-blue shadow-md p-4">
            <ul className="flex justify-between items-center">
                <li className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" passHref>
                            <Image
                                src={logo}
                                alt="Logo"
                                height={40}
                                layout="intrinsic"
                            />
                        </Link>
                    </div>                
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" passHref>
                            <div className="flex items-center space-x-2">
                                <FaPlus />
                                <span className="text-gray-700 hover:text-gray-900 hover:font-bold w-24">Your studies</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/create" passHref>
                            <div className="flex items-center space-x-2">
                                <FaBars />
                                <span className="text-gray-700 hover:text-gray-900 hover:font-bold w-32">Create a study</span>
                            </div>
                        </Link>
                    </div>
                </li>
                <li>
                    <Link href="/login" passHref>
                        <span className="text-gray-700 hover:text-gray-900 hover:font-bold w-16">Logout</span>
                    </Link>
                </li>
            </ul>
        </header>
    )
}