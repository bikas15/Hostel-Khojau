import React from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUsImage from '../assets/AboutUsImage.jpg'; 

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="py-6 sm:py-12">
      <div className="grid items-center gap-5 sm:gap-8 md:grid-cols-2 bg-gray-50 p-5 sm:p-8 rounded-lg shadow-sm">
        <div className="min-w-0">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">About Us</h2>
          <p className="text-gray-600 sm:text-lg font-poppins">
            Hostel Hub is your go-to platform for finding the best hostels in Kathmandu and beyond. 
            We connect students and hostel owners together with one another. 
            Our mission is to make hostel searching easy, reliable, and hassle-free.
          </p>
          
        </div>
        <div className="min-w-0">
          <img
            src={AboutUsImage}
            alt="About Hostel Khojau"
            className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;