"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header"
import { BsPeople, BsBook, BsLightbulb } from 'react-icons/bs';

export default function About() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-petrol-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen">
      <Header/>
      <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        <section className="text-center mb-16 bg-ice-blue p-8 sm:p-12 rounded">
          <h1 className="text-4xl sm:text-5xl text-petrol-blue mb-4">About Studyfront</h1>
          <p className="text-xl text-gray-700">Empowering research through innovative digital solutions</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsPeople className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-2xl text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Studyfront is committed to empowering researchers by providing a versatile platform 
              for creating, distributing, and analyzing studies. We aim to democratize the research 
              process and make data collection both accessible and efficient for academics and organizations alike.
            </p>
          </div>

          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsBook className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-2xl text-gray-800 mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform offers intuitive study creation tools with diverse question types, artifact integration, 
              and flexible distribution options. We provide secure data collection with real-time analytics, 
              demographics tracking, and comprehensive export capabilities to streamline your research workflow.
            </p>
          </div>

          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsLightbulb className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-2xl text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a future where digital research tools are accessible to everyone, regardless of 
              technical expertise. Studyfront strives to continuously innovate, creating solutions that 
              bridge the gap between complex research needs and user-friendly technology.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
