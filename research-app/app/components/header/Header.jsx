import Link from "next/link";

export default function Header() {
    return (
        <header>
            <h2>Hello user</h2>
            <ul>
                <li><Link href="/dashboard">Your studies</Link></li>
                <li><Link href="/create">Create a study</Link></li>
                <li><Link href="/login">Logout</Link></li>
            </ul>
        </header>
    )   
}