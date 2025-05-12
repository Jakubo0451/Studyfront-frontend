"use client"
import Header from "@/components/header/Header"
import { BsPeople, BsBook, BsLightbulb } from 'react-icons/bs';

export default function About() {
  return (
    <main className="min-h-screen">
      <Header/>
      <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        <section className="text-center mb-16 bg-ice-blue p-8 sm:p-12 rounded">
          <h1 className="text-4xl sm:text-5xl text-petrol-blue mb-4">About StudyFront</h1>
          <p className="text-xl text-gray-700">Empowering research through innovative digital solutions</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsPeople className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-2xl text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
              vitae felis vel magna faucibus varius. Suspendisse potenti. 
              Vestibulum ante ipsum primis in faucibus.
            </p>
          </div>

          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsBook className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-2xl text-gray-800 mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsLightbulb className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-2xl text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse 
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
              cupidatat non proident.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
