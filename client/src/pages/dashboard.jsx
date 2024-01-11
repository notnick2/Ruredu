import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import landing from '../assets/landing.png';
import content from '../assets/content.svg';
import home from '../assets/home.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';
import tasks from '../assets/tasks.svg';
import admin from '../assets/admin.svg';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [std, setStd] = useState("");
  const [subjects, setSubjects] = useState([]);



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




console.log(subjects);



  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen">
      {/* Sidebar */}
      <div className="col-span-2 row-span-12 bg-gray-100 p-4 flex flex-col items-center justify-between">
        <h1 className="font-poppins font-bold text-5xl text-slate-800 mb-4 pb-10">RUREDU</h1>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-8">
          {/* Home Link */}
          <Link
            to="/dashboard/home"
            className={`flex items-center space-x-2 text-3xl ${
              location.pathname === '/dashboard/home' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
            }`}
          >
            <img src={home} className="w-6 h-6" alt="Home Icon" />
            <span>Home</span>
          </Link>
          
          {/* Content Link */}
          <Link
            to="/dashboard/content"
            className={`flex items-center space-x-2 text-3xl ${
              location.pathname === '/dashboard/content' || location.pathname.startsWith('/dashboard/content/') ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
            }`}
          >
            <img src={content} className="w-6 h-6" alt="Tasks Icon" />
            <span>Content</span>
          </Link>

          {/* Tasks Link */}
          <Link
            to="/dashboard/tasks"
            className={`flex items-center space-x-2 text-3xl ${
              location.pathname === '/dashboard/tasks' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
            }`}
          >
            <img src={tasks} className="w-6 h-6" alt="Tasks Icon" />
            <span>Tasks</span>
          </Link>

          {/* Profile Link */}
          <Link
            to="/dashboard/profile"
            className={`flex items-center space-x-2 text-3xl ${
              location.pathname === '/dashboard/profile' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
            }`}
          >
            <img src={profile} className="w-6 h-6" alt="Profile Icon" />
            <span>Profile</span>
          </Link>

          {isAdmin && (
            /* Admin Link - Render only if the user has admin access */
            <Link
              to="/dashboard/admin"
              className={`flex items-center space-x-2 text-3xl ${
                location.pathname === '/dashboard/admin' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
              }`}
            >
              <img src={admin} className="w-6 h-6" alt="Profile Icon" />
            <span>Admin</span>
            </Link>
          )}
        </nav>

        <div className="flex flex-col items-end">
          {/* Logout Link */}
          <Link
            to="/"
            className={`flex items-center space-x-2 text-3xl ${
              location.pathname === '/dashboard/logout' ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-blue-500 hover:font-bold'
            }`}
          >
            <img src={logout} className="w-6 h-6" alt="Logout Icon" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="col-span-10 row-span-1 bg-gray-100 flex flex-row justify-end items-center pr-10 border-b-2 border-solid border-gray-500">
        <img src={landing} className="w-5 h-5" alt="User Avatar" />
        <h1 className="ml-2">{username}</h1>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
