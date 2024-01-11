import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectNames, setSubjectNames] = useState([]);
  const [unitNames, setUnitNames] = useState([]);
  const [topicNames, setTopicNames] = useState([]);
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
          const data = await subjectsResponse.json();
          const subjects = data.subjects;
          const Subject = subjects.map(subject => subject.name.map(sub => sub.subject_name)).flat();
          const Unit = subjects.map(subject => subject.name.flatMap(unit => unit.units.map(u => u.unit_name))).flat();
          const Topic = subjects.map(subject => subject.name.flatMap(unit => unit.units.flatMap(t => t.topics.map(topic => topic.topic_name)))).flat();
        
          setSubjectNames(Subject);
          setUnitNames(Unit)
          setTopicNames(Topic)
        
        } else {
          console.error('Error fetching subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Log state values after they are updated
    console.log('Subject Names:', subjectNames);
    console.log('Unit Names:', unitNames);
    console.log('Topic Names:', topicNames);
  }, [subjectNames, unitNames, topicNames]);

  const handleSubjectClick = (subject) => {
    setIsExpanded(!isExpanded);
    setSelectedSubject(subject);
  };

  return (
    <>
      <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Subjects</h1>
      <div className="grid grid-cols-3 gap-4">
        {subjectNames.map((subject, index) => (
          <div
            key={index}
            className={`bg-blue-200 p-4 rounded cursor-pointer transition-all ${
              isExpanded && selectedSubject === subject ? 'col-span-3' : 'col-span-1'
            }`}
            onClick={() => handleSubjectClick(subject)}
          >
            <h2 className="text-xl font-bold mb-2">{subject}</h2>
            {isExpanded && selectedSubject === subject && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Unit Names:</h3>
                <ul>
                  {unitNames.map((unit, unitIndex) => (
                    <li key={unitIndex} className="mb-2">
                      <a href={`/dashboard/content/${subject}/${unit}`} className="text-blue-500 hover:underline">{unit}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>

  );
};

export default Content;
