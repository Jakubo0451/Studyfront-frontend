"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://www.omlet.co.uk/images/cache/850/564/Cat-Cat_Guide-Two_young_kittens_playing_together_outside_on_the_grass.webp')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >      
      <div className="flex flex-row space-x-4 -translate-y-30">
        <div className="relative rounded-lg text-black bg-white p-4 shadow-lg before:content-[''] before:absolute before:top-full before:left-10 before:border-8 before:border-transparent before:border-t-white">
          I told you we took a wrong turn!
        </div>
        <div className="relative rounded-lg text-black bg-white p-4 shadow-lg left-45 before:content-[''] before:absolute before:top-full before:left-10 before:border-8 before:border-transparent before:border-t-white">
          <Link href="/dashboard" className="">Let's go back <span className="text-blue-500">home</span></Link>
        </div>
      </div>
    </div>
  );
}