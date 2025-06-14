"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import backendUrl from 'environment';
import validator from "validator";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isLength(name, { min: 1, max: 50 })) {
      alert("Name must be between 1 and 50 characters.");
      return;
    }
    if (!validator.isEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (
      !validator.isLength(password, { min: 8 }) ||
      !/\d/.test(password)
    ) {
      alert("Password must be at least 8 characters and include a number.");
      return;
    }

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
            height={80}
            width={80}
            layout="intrinsic"
          />
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-md text-zinc-800" htmlFor="username">Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 mt-2 bg-white text-black rounded shadow-sm bg-color-green-400 focus:outline-3 focus:outline-petrol-blue sm:text-md" name="username" placeholder="Username" required />
          </div>
          <div>
            <label className="block text-md text-zinc-800" htmlFor="email">Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 mt-2 bg-white text-black rounded shadow-sm focus:outline-3 focus:outline-petrol-blue sm:text-md" name="email" placeholder="Email" required />
          </div>
          <div>
            <label className="block text-md text-zinc-800" htmlFor="password">Password:</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 mt-2 bg-white text-black rounded shadow-sm focus:outline-3 focus:outline-petrol-blue sm:text-md" type="password" name="password" placeholder="Password" required />
          </div>
        </div>
        <div className="flex items-center mt-4 mb-0">
          <p className="text-md text-zinc-700 mr-2">Already have an account?</p>
          <a href="./login" className="text-md text-petrol-blue hover:text-oxford-blue">Log in!</a>
        </div>
        <button id="button" type="submit" className="w-full px-4 py-3 mt-4 text-white bg-petrol-blue rounded cursor-pointer hover:bg-oxford-blue transition duration-300">Sign up</button>
      </form>
    </div>
  );
}
