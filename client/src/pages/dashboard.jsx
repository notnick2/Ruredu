import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import content from '../assets/content.svg';
import home from '../assets/home.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';
import tasks from '../assets/tasks.svg';
import admin from '../assets/admin.svg';
import user from '../assets/user.png';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  

  useEffect(() => {
    const checkTokenAndFetchAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to / if there is no token
          navigate('/');
          return;
        }

        // Send a request to the backend to fetch access information
        const response = await fetch('http://localhost:5000/api/get-access', {
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.access);
          setUsername(data.studentName);
          setStd(data.std);
        } else {
          // Handle error fetching access information
          console.error('Error fetching access information');
        }
      } catch (error) {
        console.error('Error fetching access information', error);
      } finally {
        setLoading(false);
      }
    };

    checkTokenAndFetchAccess();
  }, [navigate]);

  return (
    <div className="grid grid-cols-12 grid-rows-12 min-h-screen">
      {/* Sidebar */}
{/* Sidebar */}
<div className="md:flex col-span-2 row-span-12 bg-gray-100 p-4 flex-col items-center justify-between">

  {/* Responsive RUREDU */}
  <h1 className="relative text-2xl mt-2 font-poppins font-bold md:text-5xl text-slate-800 mb-4 pb-2 sm:text-3xl z-1000">
    RUREDU
  </h1>

  {/* Sidebar Links */}
  <nav className="flex flex-col space-y-4 sm:space-y-8">

    {/* Home Link */}
    <Link
      to="/dashboard/home"
      className={`flex items-center space-x-2 text-xl sm:text-3xl ${
        location.pathname === '/dashboard/home' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
      }`}
    >
      <img src={home} className={`sm:w-8 sm:h-8 sm:mt-0 mt-[200px]
      ${
        location.pathname === '/dashboard/home' ? 'w-12 h-12 ' : 'w-9 h-9'
      }`
    }alt="home Icon" />
      {/* Use the image directly for small devices */}
      <span className="hidden sm:inline">Home</span>
    </Link>

    {/* Content Link */}
    <Link
      to="/dashboard/content"
      className={`flex items-center space-x-2 text-xl sm:text-3xl ${
        location.pathname === '/dashboard/content' || location.pathname.startsWith('/dashboard/content/') ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
      }`}
    >
      <img src={content} className={`sm:w-8 sm:h-8
       ${
        location.pathname === '/dashboard/content' ? 'w-12 h-12 ' : 'w-9 h-9'
      }`} alt="Tasks Icon" />
      {/* Use the image directly for small devices */}
      <span className="hidden sm:inline">Content</span>
    </Link>

    {/* Tasks Link */}
    <Link
      to="/dashboard/tasks"
      className={`flex items-center space-x-2 text-xl sm:text-3xl ${
        location.pathname === '/dashboard/tasks' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
      }`}
    >
      <img src={tasks} className={` sm:w-8 sm:h-8
       ${
        location.pathname === '/dashboard/tasks' ? 'w-12 h-12 ' : 'w-9 h-9'
      }`} alt="Tasks Icon" />
      {/* Use the image directly for small devices */}
      <span className="hidden sm:inline">Tasks</span>
    </Link>

    {/* Profile Link */}
    <Link
      to="/dashboard/profile"
      className={`flex items-center space-x-2 text-xl sm:text-3xl ${
        location.pathname === '/dashboard/profile' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
      }`}
    >
      <img src={profile} className={`sm:w-8 sm:h-8
       ${
        location.pathname === '/dashboard/profile' ? 'w-12 h-12 ' : 'w-9 h-9'
      }`} alt="Profile Icon" />
      {/* Use the image directly for small devices */}
      <span className="hidden sm:inline">Profile</span>
    </Link>

    {isAdmin && (
      /* Admin Link - Render only if the user has admin access */
      <Link
        to="/dashboard/admin"
        className={`flex items-center space-x-2 text-xl sm:text-3xl ${
          location.pathname === '/dashboard/admin' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
        }`}
      >
        <img src={admin} className={`sm:w-8 sm:h-8
         ${
          location.pathname === '/dashboard/admin' ? 'w-12 h-12 ' : 'w-9 h-9'
        }`} alt="Profile Icon" />
        {/* Use the image directly for small devices */}
        <span className="hidden sm:inline">Admin</span>
      </Link>
    )}
  </nav>

  <div className="flex flex-col items-end">

    {/* Logout Link */}
    <Link
      to="/"
      className={`flex items-center space-x-2 text-xl sm:text-3xl ${
        location.pathname === '/dashboard/logout' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
      }`}
    >
      <img
        src={logout}
        className={` sm:w-8 sm:h-8 mt-5 sm:mt-0  mr-[11px] ml-[2px] sm:mr-0
        ${
          location.pathname === '/dashboard/logout' ? 'w-12 h-12 ' : 'w-9 h-9'
        }`}
        alt="Logout Icon"
      />      {/* Use the image directly for small devices */}
      <span className="hidden sm:inline">Logout</span>
    </Link>

  </div>
</div>


      {/* Top Navigation Bar */}
      <nav className="col-span-10 row-span-1 bg-gray-100 flex flex-row justify-end items-center pr-10 border-b-2 border-solid border-gray-500">
        <img src={user} className="w-7 h-7" alt="User Avatar" />
        <h1 className="ml-2">{username}</h1>
      </nav>

      {/* Main Content */}
      <div className="col-span-10 row-span-11">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
