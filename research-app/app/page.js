import Link from 'next/link';
import Image from "next/image";
import logo from "./../../public/logo/logo.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-80 space-y-8 flex flex-col items-center justify-center">
        <Image
            className="flex justify-center items-center"
            src={logo}
            alt="Logo"
            height={50}
            layout="intrinsic"
          />
        <h1 className="flex flex-col items-center justify-center text-center text-2xl">Simple and powerful research tool for your studies</h1>
        <div className="w-full flex flex-grow space-x-4 mb-2">
          <Link href={`/signup`} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center">Sign Up</Link>
          <Link href={`/login`} className="bg-petrol-blue text-white rounded px-4 py-2 flex-grow text-center">Login</Link>
        </div>
      </div>
    </div>
  );
}
