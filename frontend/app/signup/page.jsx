"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import backendUrl from 'environment';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      router.push("../dashboard/");
    } else if (!res.ok) {
      alert("Failed to create user");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="w-full max-w-lg p-12 space-y-8" onSubmit={handleSubmit}>
        <div className="flex justify-center mb-8">
          <Image
            className="h-10"
            src={"/logo/logo.png"}
            alt="Logo"
            height={40}
            width={40}
            layout="intrinsic"
          />
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="username">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm bg-color-green-400 focus:outline-none sm:text-sm" name="username" placeholder="Username" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm focus:outline-none sm:text-sm" name="email" placeholder="Email" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm focus:outline-none sm:text-sm" type="password" name="password" placeholder="Password" required />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 mb-0">
          <p className="text-sm text-zinc-700">Already have an account?</p>
          <a href="./login" className="text-sm font-medium text-petrol-blue">Log in!</a>
        </div>
        <button id="button" type="submit" className="w-full px-4 py-3 mt-4 text-white bg-petrol-blue rounded cursor-pointer">Sign up</button>
      </form>
    </div>
  );
}
