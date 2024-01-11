import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import landing from '../assets/landing.png';
import content from '../assets/content.svg';
import home from '../assets/home.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';
import tasks from '../assets/tasks.svg';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen">
      {/* Sidebar */}
      <sidebar className="col-span-2 row-span-12 bg-gray-100 p-4 flex flex-col items-center justify-between">
        <h1 className="font-poppins font-bold text-5xl text-slate-800 mb-4 pb-10">RUREDU</h1>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-8">
          {/* Home Link */}
          <Link
            to="/home"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:font-bold p-2 text-3xl"
          >
            <img src={home} className="w-6 h-6" alt="Home Icon" />
            <span>Home</span>
          </Link>

          {/* Content Link */}
          <Link
            to="/dashboard/content"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:font-bold p-2 text-3xl"
          >
            <img src={content} className="w-6 h-6 pt-1" alt="Content Icon" />
            <span>Content</span>
          </Link>

          {/* Tasks Link */}
          <Link
            to="/dashboard/tasks"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:font-bold p-2 text-3xl"
          >
            <img src={tasks} className="w-6 h-6" alt="Tasks Icon" />
            <span>Tasks</span>
          </Link>

          {/* Profile Link */}
          <Link
            to="/dashboard/profile"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:font-bold p-2 text-3xl"
          >
            <img src={profile} className="w-6 h-6" alt="Profile Icon" />
            <span>Profile</span>
          </Link>
        </nav>

        <div className="flex flex-col items-end">
          {/* Logout Link */}
          <Link
            to="/dashboard/logout"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:font-bold p-2 text-3xl"
          >
            <img src={logout} className="w-6 h-6" alt="Logout Icon" />
            <span>Logout</span>
          </Link>
        </div>
      </sidebar>

      {/* Top Navigation Bar */}
      <nav className="col-span-10 row-span-1 bg-gray-100 flex flex-row justify-end items-center pr-10 border-b-2 border-solid border-gray-500">
        <img src={landing} className="w-5 h-5" alt="User Avatar"></img>
        <h1 className="ml-2">Student Name</h1>
      </nav>
      <main>
        <Outlet/>
      </main>
    </div>
  );
};

export default Dashboard;
