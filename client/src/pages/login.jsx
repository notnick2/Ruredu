// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login data to the server
      const response = await axios.post('http://localhost:5000/api/login', formData);

      // Assuming the server returns a JWT token upon successful login
      const { token } = response.data;

      

      // Store the token in localStorage or a global state management solution
      localStorage.setItem('token', token);

      // Redirect to the dashboard page
      navigate('/dashboard/home');
    } catch (error) {
      console.error('Login failed', error);
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
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
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
          >
            Login
          </button>
        </form>
        {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
        <p className="mt-4">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
