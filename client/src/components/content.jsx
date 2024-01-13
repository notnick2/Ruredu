import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectNames, setSubjectNames] = useState([]);
  const [unitNames, setUnitNames] = useState({});
  const [topicNames, setTopicNames] = useState([]);

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

          // Using map to transform the data into arrays
          const subjectNames = data.subjects.map(subject => subject.name.map(sub => sub.subject_name)).flat();
          const unitNamesObj = {};
          const topicNamesObj = {};
          
          data.subjects.forEach(subject => {
            const subjectName = subject.name.map(sub => sub.subject_name)[0];
          
            // Extracting unit names for the current subject
            const unitName = subject.name.flatMap(sub => sub.units.map(u => u.unit_name));
          
            if (!unitNamesObj[subjectName]) {
              unitNamesObj[subjectName] = unitName;
            } else {
              unitNamesObj[subjectName] = [...unitNamesObj[subjectName], ...unitName];
            }
          
            // Extracting topic names for the current subject
            const topics = subject.name.flatMap(sub => sub.units.flatMap(unit => unit.topics.map(topic => topic.topic_name)));
          
            if (!topicNamesObj[subjectName]) {
              topicNamesObj[subjectName] = topics;
            } else {
              topicNamesObj[subjectName] = [...topicNamesObj[subjectName], ...topics];
            }
          });
          
          // Update state
          setSubjectNames(subjectNames);
          setUnitNames(unitNamesObj);
          setTopicNames(topicNamesObj);
          
          
        } else {
          console.error('Error fetching subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };

    fetchSubjects();
  }, [navigate]);

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
                    {unitNames[subject]?.map((unit, unitIndex) => (
                      <li key={unitIndex} className="mb-2">
                        <a href={`/dashboard/content/${subject}/${unit}`} className="text-blue-500 hover:underline">
                          {unit}
                        </a>
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
