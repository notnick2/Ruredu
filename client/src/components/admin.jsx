import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [topicDescription, setTopicDescription] = useState([]);
  const [add, setAdd] = useState(false);
  const [file, setFile] = useState(null);

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


  const handleAddTopicDescription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to / if there is no token
        navigate('/');
        return;
      }

      // Send a request to the backend to add a new topic description
      const response = await fetch('http://localhost:5000/api/add-topic-description', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          std,
          subject: selectedSubject,
          unit: selectedUnit,
          topic: selectedTopic,
          topic_description: topicDescription,

        }),
      });

      if (response.ok) {
        console.log('Topic description added successfully!',topicDescription);
        // Refetch topics to update the dropdown
        
      } else {
        console.error('Error adding topic description');
      }
    } catch (error) {
      console.error('Error adding topic description', error);
    }
  };


//pdf upload

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleFileUpload = async () => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('std', std);
  formData.append('Subject', selectedSubject);
  formData.append('Unit', selectedUnit);
  formData.append('Topic', selectedTopic);
  formData.append('topic_description', topicDescription);
  console.log(formData);
  try {
    await axios.post('http://localhost:5000/api/upload', formData);
    console.log('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

return (
  <div className="h-825  flex flex-col flex-wrap gap-4 ml-8">
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Select or Add Class:</h2>
      <p className="mb-2">Selected Class: {std}</p>
      <select className="mr-2 p-2 border border-gray-300 rounded" onChange={(e) => setStd(e.target.value)} value={std}>
        <option value="">Select Class</option>
        {[...Array(10)].map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
    </div>

    {std && (
      <>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Select or Add Subject:</h2>
          <p className="mb-2">Selected Subject: {selectedSubject}</p>
          <select className="mr-2 p-2 border border-gray-300 rounded" onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjectNames.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="New Subject"
            className="mr-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => {
              handleAddSubject();
              setAdd(true);
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add Subject
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Select or Add Unit:</h2>
          <p className="mb-2">Selected Unit: {selectedUnit}</p>
          <select className="mr-2 p-2 border border-gray-300 rounded" onChange={(e) => setSelectedUnit(e.target.value)}>
            <option value="">Select Unit</option>
            {unitNames.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="New Unit"
            className="mr-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => {
              handleAddUnit();
              setAdd(true);
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add Unit
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Select or Add Topic:</h2>
          <p className="mb-2">Selected Topic: {selectedTopic}</p>
          <select className="mr-2 p-2 border border-gray-300 rounded" onChange={(e) => setSelectedTopic(e.target.value)}>
            <option value="">Select Topic</option>
            {topicNames.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="New Topic"
            className="mr-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => {
              handleAddTopic();
              setAdd(true);
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add Topic
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Add Topic Description:</h2>
          <input
            type="text"
            value={topicDescription}
            onChange={(e) => setTopicDescription(e.target.value)}
            placeholder="Topic Description"
            className="mr-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => {
              handleAddTopicDescription();
              setAdd(true);
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add Topic Description
          </button>
          <p className="mt-2">{topicDescription}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Upload PDF Document:</h2>
          <input type="file" onChange={handleFileChange} className="mr-2" />
          <button onClick={handleFileUpload} className="p-2 bg-blue-500 text-white rounded">
            Upload PDF
          </button>
        </div>
      </>
    )}
  </div>
);



}
export default Content;