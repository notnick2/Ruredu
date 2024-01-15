import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '',
    std: '', // This will store the selected class
    password: '',
    access: false,
  });
  const [userExists, setUserExists] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send registration data to the server
      const response = await axios.post('http://localhost:5000/api/register', formData);
  
      if (response.data.message === 'User already exists') {
        setUserExists(response.data.message);
        console.log('User already exists');
        // Handle user already exists case in the frontend (show an error message, redirect, etc.)
      } else {
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const renderClassOptions = () => {
    // Generate options for classes from 1 to 10
    const classOptions = Array.from({ length: 10 }, (_, index) => index + 1);

    return classOptions.map((classNumber) => (
      <option key={classNumber} value={classNumber}>
        {classNumber}
      </option>
    ));
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white bg-opacity-0 p-8 rounded shadow-md">
        {registrationSuccess ? (
          <div>
            <p className="text-green-500">Registration successful!</p>
            <Link to="/login">
              <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-4">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {userExists.length > 0 && (
            <p className="text-red-500">username already exists.</p>
          )}
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">
                Student Name:
                <input
                  type="text"
                  name="studentName"
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </label>
              <label className="block mb-2">
                Class:
                <select
                  name="std"
                  onChange={handleChange}
                  value={formData.class}
                  required
                  className="border p-2 w-full"
                >
                  <option value="">Select a class</option>
                  {renderClassOptions()}
                </select>
              </label>
              <label className="block mb-2">
                Password:
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </label>
              <button
                type="submit"
                className="mt-3 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
              >
                Register
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
