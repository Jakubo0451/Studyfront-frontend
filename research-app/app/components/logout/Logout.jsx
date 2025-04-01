import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        
        try {
            const response = await fetch("../../api/auth/logout/", {
                method: "POST"
            });

            if (response.ok) {
                router.push("../../login/");
            }
        } catch (error) {
            console.error("Error logging out user", error);
        }

    }
    return (
        <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 hover:border-b hover:cursor-pointer">Logout</button>
    )
}
