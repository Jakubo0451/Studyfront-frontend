'use client'
import Form from "next/form";
import Image from "next/image";
import logo from "./../../../public/logo/logo.png";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Form className="w-full max-w-lg p-12 space-y-8" action="/dashboard">
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
            <label className="block text-sm font-medium text-zinc-800" htmlFor="username">Username</label>
            <input className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm bg-color-green-400 focus:outline-none sm:text-sm" name="username" placeholder="Username" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="password">Password</label>
            <input className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm focus:outline-none sm:text-sm" type="password" name="password" placeholder="Password" required />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 mb-0">
          <p className="text-sm text-zinc-700">Don't have an account?</p>
          <a href="./login" className="text-sm font-medium text-petrol-blue">Sign up!</a>
        </div>
        <button onClick={() => { console.log('clicked') }} id="button" type="submit" className="w-full px-4 py-3 mt-4 text-white bg-petrol-blue rounded cursor-pointer">Login</button>
      </Form>
    </div>
  );
}