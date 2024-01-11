import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [std, setStd] = useState("");
  const [newStd, setNewStd] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [subjectNames, setSubjectNames] = useState([]);
  const [unitNames, setUnitNames] = useState([]);
  const [topicNames, setTopicNames] = useState([]);
  const [add, setAdd] = useState(false);

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
      }
    };

    checkTokenAndFetchAccess();
  }, [navigate]);

  useEffect(() => {
    const fetchSubjects = async (selectedStd) => {
      try {
        console.log("nan gelkinaru!!");
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to / if there is no token
          navigate('/');
          return;
        }

        // Send a request to the backend to fetch subjects for the selected class
        const subjectsResponse = await fetch(`http://localhost:5000/api/get-class-details?std=${selectedStd}`, {
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
          setUnitNames(Unit);
          setTopicNames(Topic);
        } else {
          console.error('Error fetching subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects', error);
      }
    };

    if (std) {
      // Fetch subjects for the default selected class
      fetchSubjects(std);
    }
    setAdd(false);
  }, [std, navigate, add]);

  useEffect(() => {
    // Log state values after they are updated
    console.log('Subject Names:', subjectNames);
    console.log('Unit Names:', unitNames);
    console.log('Topic Names:', topicNames);
    console.log('student class:', std);
  }, [subjectNames, unitNames, topicNames, std]);

  const handleAddStd = () => {
    // Handle adding a new class to the backend
    console.log('Adding new class:', newStd);
    setNewStd('');
  };

  const handleAddSubject = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to / if there is no token
        navigate('/');
        return;
      }

      // Send a request to the backend to add a new subject
      const response = await fetch('http://localhost:5000/api/add-subject', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          std,
          subject: newSubject,
        }),
      });

      if (response.ok) {
        console.log('Subject added successfully!');
        // Refetch subjects to update the dropdown
        
      } else {
        console.error('Error adding subject');
      }
    } catch (error) {
      console.error('Error adding subject', error);
    }
  };

  const handleAddUnit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to / if there is no token
        navigate('/');
        return;
      }

      // Send a request to the backend to add a new unit
      const response = await fetch('http://localhost:5000/api/add-unit', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          std,
          subject: selectedSubject,
          unit: newUnit,
        }),
      });

      if (response.ok) {
        console.log('Unit added successfully!');
        // Refetch units to update the dropdown
        
      } else {
        console.error('Error adding unit');
      }
    } catch (error) {
      console.error('Error adding unit', error);
    }
  };

  const handleAddTopic = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to / if there is no token
        navigate('/');
        return;
      }

      // Send a request to the backend to add a new topic
      const response = await fetch('http://localhost:5000/api/add-topic', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          std,
          subject: selectedSubject,
          unit: selectedUnit,
          topic: newTopic,
        }),
      });

      if (response.ok) {
        console.log('Topic added successfully!');
        // Refetch topics to update the dropdown
        
      } else {
        console.error('Error adding topic');
      }
    } catch (error) {
      console.error('Error adding topic', error);
    }
  };

  return (
    <>
      <div>
        <h2>Select or Add Class:</h2>
        <p>Selected Class: {std}</p>
        <select onChange={(e) => setStd(e.target.value)} value={std}>
          <option value="">Select Class</option>
          {[...Array(10)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <input type="text" value={newStd} onChange={(e) => setNewStd(e.target.value)} placeholder="New Class" />
        <button onClick={handleAddStd}>Add Class</button>
      </div>

      {std && (
        <>
          <div>
            <h2>Select or Add Subject:</h2>
            <p>Selected Subject: {selectedSubject}</p>
            <select onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjectNames.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="New Subject" />
            <button onClick={() => { handleAddSubject(); setAdd(true); }}>Add Subject</button>

          </div>

          <div>
            <h2>Select or Add Unit:</h2>
            <p>Selected Unit: {selectedUnit}</p>
            <select onChange={(e) => setSelectedUnit(e.target.value)}>
              <option value="">Select Unit</option>
              {unitNames.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <input type="text" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="New Unit" />
            <button onClick={() => { handleAddUnit(); setAdd(true); }}>Add unit</button>

          </div>

          <div>
            <h2>Select or Add Topic:</h2>
            <p>Selected Topic: {selectedTopic}</p>
            <select onChange={(e) => setSelectedTopic(e.target.value)}>
              <option value="">Select Topic</option>
              {topicNames.map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="New Topic" />
            <button onClick={() => { handleAddTopic(); setAdd(true); }}>Add topic</button>

          </div>

          <div>
            <h2>Upload PDF Document:</h2>
            {/* Add file upload input and button */}
          </div>
        </>
      )}
    </>
  );
};

export default Content;
