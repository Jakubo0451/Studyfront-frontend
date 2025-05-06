import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaBars } from "react-icons/fa";
import logo from "../../../public/logo/logo.png";
import LogoutButton from '../logout/Logout.jsx';


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
                            />
                        </Link>
                    </div>                
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" passHref>
                            <div className="flex items-center space-x-2">
                                <FaBars />
                                <span className="text-gray-700 hover:text-gray-900 hover:border-b">Your studies</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/create" passHref>
                            <div className="flex items-center space-x-2">
                                <FaPlus />
                                <span className="text-gray-700 hover:text-gray-900 hover:border-b">Create a study</span>
                            </div>
                        </Link>
                    </div>
                </li>
                <LogoutButton></LogoutButton>
            </ul>
        </header>
    )   
}