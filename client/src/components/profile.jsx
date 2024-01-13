import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [studentName, setUpdatedStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/get-profile', {
          headers: { Authorization: token },
        });
        console.log(response.data)
        const userProfile = response.data.user;
        console.log(userProfile)
        setUpdatedStudentName(userProfile.studentName);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put('/api/update-profile', {
        studentName,
        password,
      }, {
        headers: { Authorization: token },
      });

      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="mt-10 ml-10">
      <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Student Name</label>
        <input
          type="text"
          className="mt-1 p-2 border rounded-md w-80"
          value={studentName}
          onChange={(e) => setUpdatedStudentName(e.target.value)}
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
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default Profile;
