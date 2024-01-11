import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [std, setStd] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
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
    <>
      <div className="flex flex-row m-20 align-center">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className={` m-4 pr-10 pl-10 bg-gray-300 cursor-pointer ${expandedIndex === index ? 'h-auto' : 'h-32 w-32'} transition-all duration-500 ease-in-out rounded-md `}
            onClick={() => handleToggle(index)}
          >
            {subject}
            {expandedIndex === index && (
              <div className="mt-2">
                {subjects.map((subSubject, i) => (
                  <Link key={i} to={`/dashboard/content/${subject}/${subSubject}`} className="block p-4 mb-2 rounded-md text-white">
                    {subSubject}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>

  );
};

export default Content;
