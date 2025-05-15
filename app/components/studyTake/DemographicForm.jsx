"use client";
import { useState } from "react";

export default function DemographicForm({ onComplete }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    education: "",
    occupation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-petrol-blue">Demographic Information</h2>
      <p className="mb-4 text-gray-600">
        Please provide the following demographic information. This helps us better understand our study participants.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="age" className="block text-md text-gray-700 mb-1">
            Age Group
          </label>
          <select
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            required
          >
            <option value="">Please select</option>
            <option value="under_18">Under 18</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65 or older</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-md text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            required
          >
            <option value="">Please select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="education" className="block text-md text-gray-700 mb-1">
            Education
          </label>
          <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full p-2 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            required
          >
            <option value="">Please select</option>
            <option value="high_school">High School</option>
            <option value="associate">Associate's degree</option>
            <option value="bachelor">Bachelor's degree</option>
            <option value="master">Master's degree</option>
            <option value="doctoral">Doctoral degree</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="occupation" className="block text-md text-gray-700 mb-1">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full p-2 border-2 border-petrol-blue rounded-md focus:outline-none focus:ring-2 focus:ring-petrol-blue"
            placeholder="Your occupation"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-petrol-blue text-white py-2 px-4 rounded-md hover:bg-oxford-blue transition-colors duration-300"
        >
          Continue to Study
        </button>
      </form>
    </div>
  );
}