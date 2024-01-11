import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [std, setStd] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleDivClick = (index) => {
    setSelectedSubject(index === selectedSubject ? null : index);
  };

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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to / if there is no token
          navigate('/');
          return;
        }
        // Send a request to the backend to fetch subjects
        const subjectsResponse = await fetch('http://localhost:5000/api/get-subjects', {
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (subjectsResponse.ok) {
          const subjectsData = await subjectsResponse.json();
          setSubjects(subjectsData.subjectNames[0]);
        } else {
          console.error('Error fetching subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };
    fetchSubjects();
  }, []);


  return (
    <div className="flex">
      {subjects.map((subject, index) => (
        <div
          key={index}
          className={`p-4 m-2 rounded-md cursor-pointer transition-transform transform ${
            selectedSubject === index ? 'scale-150' : 'scale-100'
          } bg-${index % 5 + 1}00`}
          onClick={() => handleDivClick(index)}
        >
          <span className="text-xl">{subject}</span>
          {selectedSubject === index && (
            <img
              src="/path/to/logo.png" // Replace with the actual path to your logo
              alt="Logo"
              className="h-8 w-8 ml-2"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Content;
