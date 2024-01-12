import React, { useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [studentName, setStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login or handle unauthorized access
        console.error('Unauthorized access - Token missing');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/update-profile',
        { studentName, password },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMessage('Profile updated successfully');
      } else {
        setMessage('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile', error);
      setMessage('Error updating profile');
    }
  };

  return (
    <div className=" mt-10 ml-10 ">
      <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Student Name</label>
        <input
          type="text"
          className="mt-1 p-2 border rounded-md w-80"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          className="mt-1 p-2 border rounded-md w-80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        onClick={handleUpdateProfile}
      >
        Update Profile
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default Profile;
