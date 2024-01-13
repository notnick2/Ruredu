// Landing.jsx

import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import landing from '../assets/landing.png';

const Landing = () => {
  // State to manage pop-up visibility
  const [isRegisterPopUpVisible, setIsRegisterPopUpVisible] = useState(false);
  const [isLoginPopUpVisible, setIsLoginPopUpVisible] = useState(false);

  // Function to show the Register pop-up
  const showRegisterPopUp = () => {
    setIsRegisterPopUpVisible(true);
  };

  // Function to hide the Register pop-up
  const hideRegisterPopUp = () => {
    setIsRegisterPopUpVisible(false);
  };

  // Function to show the Login pop-up
  const showLoginPopUp = () => {
    setIsLoginPopUpVisible(true);
  };

  // Function to hide the Login pop-up
  const hideLoginPopUp = () => {
    setIsLoginPopUpVisible(false);
  };

  return (
    <>
      <div className="relative h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-start p-8">
        
        <div className="flex">
        <div className="text-white flex-1 pt-20 text-center sm:text-left">
        <h1 className="text-6xl font-extrabold mb-4 pt-20">RUREDU</h1>
        <p className="text-3xl mb-8">
          An educational platform for rural empowerment, breaking barriers to bring quality learning to every child, regardless of geographical constraints.
        </p>
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <Link
            to="/login"
            onClick={showLoginPopUp}
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded mb-4 sm:mb-0 sm:mr-4"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={showRegisterPopUp}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
          >
            Register
          </Link>
        </div>
      </div>


          <div className="flex-1 hidden sm:block">
            <img src={landing} alt="landing-png" className="max-w-full h-auto" />
          </div>
        </div>
      </div>
     
      {isRegisterPopUpVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md">
            
            <button
              onClick={hideRegisterPopUp}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 "
            >
              Close Register Pop-up
            </button>
            <Outlet />
            
            
          </div>
        </div>
      )}

    
      {isLoginPopUpVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md">
           
            <button
              onClick={hideLoginPopUp}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Close Login Pop-up
            </button>
            <Outlet />
            
            
          </div>
        </div>
      )}
    </>
  );
};



export default Landing;
