import Link from "next/link";
import Image from "next/image";
import styles from './Header.module.css';
import { FaPlus, FaBars } from "react-icons/fa";
import logo from "../../../public/logo/logo.png";

export default function Header() {
    return (
        <header className={styles.header}>
            <ul className={styles.header_nav}>
                <li className={`${styles.header_nav_item} ${styles.header_nav_logo}`}>
                    <Link href="/dashboard" className={styles.header_nav_link}> 
                        <Image
                            src={logo}
                            alt="Logo"
                            height={40}
                            layout="intrinsic"
                        />
                    </Link>
                </li>
                <li className={`${styles.header_nav_item} ${styles.header_nav_center}`}>
                    <div className={styles.header_nav_center_item}> 
                        <FaPlus />
                        <Link href="/dashboard" className={styles.header_nav_link}>Your studies</Link>
                    </div>
                    <div className={styles.header_nav_center_item}>
                        <FaBars />
                        <Link href="/create" className={styles.header_nav_link}>Create a study</Link>
                    </div>
                </li>
                <li className={styles.header_nav_item}>
                    <Link href="/login" className={styles.header_nav_link}>Logout</Link>
                </li>
            </ul>
        </header>
    )
}