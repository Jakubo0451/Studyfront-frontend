import { useRouter } from "next/navigation";
//import backendUrl from 'environment';

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/login');
    }
    return (
        <button type="button" onClick={handleLogout} className="text-gray-700 hover:text-gray-900 hover:border-b hover:cursor-pointer">Logout</button>
    )
}
