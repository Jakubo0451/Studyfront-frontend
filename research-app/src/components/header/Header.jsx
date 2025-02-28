import Link from "next/link";

export default function Header() {
    return (
        <header>
            <ul>
                <li><Link href="/">Homepage</Link></li>
                <li><Link href="/studies">Your studies</Link></li>
                <li><Link href="/create">Create a study</Link></li>
                <li><Link href="/logout">Logout</Link></li>
            </ul>
        </header>
    )
}