'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logo from "./../../../public/logo/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Form className="w-full max-w-lg p-12 space-y-8" action={handleLogin}>
        <div className="flex justify-center mb-8">
          <Image
            className="h-10"
            src={logo}
            alt="Logo"
            height={40}
            layout="intrinsic"
          />
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="Email">Email</label>
            <input className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm bg-color-green-400 focus:outline-none sm:text-sm" name="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="password">Password</label>
            <input className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm focus:outline-none sm:text-sm" type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 mb-0">
          <p className="text-sm text-zinc-700">Don't have an account?</p>
          <a href="./signup" className="text-sm font-medium text-petrol-blue">Sign up!</a>
        </div>
        <button id="button" type="submit" className="w-full px-4 py-3 mt-4 text-white bg-petrol-blue rounded cursor-pointer">Login</button>
      </Form>
    </div>
  );
}
