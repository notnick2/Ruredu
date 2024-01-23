import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Content = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [std, setStd] = useState("");
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
  const [finalTopicDescription, setFinalTopicDescription] = useState("");
  const [successS, setSuccessS] = useState('');
  const [successU, setSuccessU] = useState('');
  const [successT, setSuccessT] = useState('');
  const [successD, setSuccessD] = useState('');
  const [successUpload, setSuccessUpload] = useState('');
  const [accessStatus, setAccessStatus] = useState(null);
  const [addClicked, setAddClicked] = useState(false);


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
          console.log('debugging number 01',data)
          //setIsAdmin(data.access);
          //setUsername(data.studentName);
          setStd(data.std);
  
          // Check if the user is not an admin and redirect
          if (!data.access) {
            navigate('/');
          }
  
        } else {
          // Handle error fetching access information
          console.error('Error fetching access information');
        }
      } catch (error) {
        console.error('Error fetching access information', error);
      }
    };
  
    checkTokenAndFetchAccess();
  }, []); // Empty dependency array to run only once when the component mounts
  

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
          
          setSubjectNames(Subject);
          
          console.log(subjectNames)
          


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
        setSuccessS(`${newSubject} added successfully`);
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
  
      // Check if selectedSubject is an empty string
      if (selectedSubject === '') {
        setSuccessU('Please select the subject');
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
        setSuccessU(`${newUnit} added successfully to ${selectedSubject}`);
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
  
      // Check if selectedSubject or selectedUnit is an empty string
      if (selectedSubject === '' || selectedUnit === '') {
        setSuccessT('subject or unit is not selected');
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
      console.log('arey idhi final debug ra chusko kanipistundha?',response);
      if (response.ok) {
        console.log('Topic added successfully!');
        setSuccessT(`${newTopic} added successfully to ${selectedUnit}`);
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

      if (selectedSubject === '' || selectedUnit === '' || selectedTopic === '') {
        setSuccessD('subject or unit or topic is not selected');
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
        setSuccessD(`${topicDescription} added successfully to ${selectedTopic}`);
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
    setSuccessUpload("File uploaded successfully");
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const handleGrantAccess = async () => {
  const enteredUsername = prompt('Enter username to grant access:');
  if (enteredUsername) {
    setUsername(enteredUsername);
    // Fetch user access status
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to / if there is no token
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/check-access?username=${enteredUsername}`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access) {
          setAccessStatus(`${enteredUsername} already has access.`);
        } else {
          setAccessStatus(`${enteredUsername}'s access has been granted.`);
          // Update access status
          await fetch('http://localhost:5000/api/update-access', {
            method: 'POST',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: enteredUsername,
              access: true,
            }),
          });
        }
      } else {
        console.error('Error checking access status');
      }
    } catch (error) {
      console.error('Error checking access status', error);
    }
  }
};

const handleDenyAccess = async () => {
  const enteredUsername = prompt('Enter username to deny access:');
  if (enteredUsername) {
    setUsername(enteredUsername);
    // Fetch user access status
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to / if there is no token
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/check-access?username=${enteredUsername}`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.access) {
          setAccessStatus(`${enteredUsername} already has access denied.`);
        } else {
          setAccessStatus(`${enteredUsername}'s access has been denied.`);
          // Update access status
          await fetch('http://localhost:5000/api/update-access', {
            method: 'POST',
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: enteredUsername,
              access: false,
            }),
          });
        }
      } else {
        console.error('Error checking access status');
      }
    } catch (error) {
      console.error('Error checking access status', error);
    }
  }
};

//fetch units when subject is selected
useEffect(() => {
  // Make API request for unit names
  fetch(`http://localhost:5000/api/get-units?std=${std}&subject_name=${selectedSubject}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Assuming data is in the format { unitNames: ['unit1', 'unit2', ...] }
      const { unitNames } = data;
      console.log('Unit Names:', unitNames);
      setUnitNames(unitNames);
      setAddClicked(false);
    })
    .catch((error) => console.error('Error fetching unit names:', error));
    
}, [selectedSubject, addClicked]);



// fetching the topics when selected a unit
useEffect(() => {
  const fetchTopics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-topics?std=${std}&subjectName=${selectedSubject}&unitName=${selectedUnit}`);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const { topics } = data;

      // Extract topic names from the response and set the state
      const extractedTopicNames = topics.map((topic) => topic.topic_name);
      console.log('topic names:',extractedTopicNames);
      setTopicNames(extractedTopicNames);
      setAddClicked(false);
    } catch (error) {
      console.error('Error fetching topic names:', error);
    }
  };

  // Fetch topics when selectedUnit changes
  fetchTopics();
}, [selectedUnit, addClicked]);




return (
  <div className="max-w-screen-xl mx-auto h-825 relative flex flex-col flex-wrap gap-4 ml-8">
    <div className="md:absolute md:top-0 md:right-0 mt-4 md:mr-8">
      <button onClick={handleGrantAccess} className="p-2 md:p-3 lg:p-4 bg-blue-500 text-white rounded">
        Grant Access
      </button>
      <button onClick={handleDenyAccess} className="ml-2 p-2 md:p-3 lg:p-4 bg-red-500 text-white rounded">
        Deny Access
      </button>
      {accessStatus && <p className="mt-2 text-gray-900 md:mt-0 md:ml-2">{accessStatus}</p>}
    </div>
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Select Class:</h2>
      <p className="mb-2">Selected Class: {std}</p>
      <select className=" p-2 border border-gray-300 rounded" onChange={(e) => setStd(e.target.value)} value={std}>
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
        <div className="mb-[10px] md:mb-4 lg:mb-4">
          <h2 className="text-lg font-semibold mb-[10px] md:mb-2 lg:mb-2">Select or Add Subject:</h2>
          <p className="mb-[10px] md:mb-2 lg:mb-2">Selected Subject: {selectedSubject}</p>
          <select className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2" onChange={(e) => setSelectedSubject(e.target.value)}>
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
            className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2"
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
          {successS && <p className="text-green-500">{successS}</p>}
        </div>

        <div className="mb-[10px] md:mb-4 lg:mb-4">
          <h2 className="text-lg font-semibold mb-[10px] md:mb-2 lg:mb-2">Select or Add Unit:</h2>
          <p className="mb-[10px] md:mb-2 lg:mb-2">Selected Unit: {selectedUnit}</p>
          <select className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2" onChange={(e) => setSelectedUnit(e.target.value)}>
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
            className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2"
          />
          
          <button
            onClick={() => {
              handleAddUnit();
              setAdd(true);
              setAddClicked(true);
            }}
            className="p-2 bg-blue-500 text-white rounded mb-[10px] md:mb-2 lg:mb-2"
          >
            Add Unit
          </button>
          {successU && <p className="text-green-500">{successU}</p>}
        </div>

        <div className="mb-[10px] md:mb-4 lg:mb-4">
          <h2 className="text-lg font-semibold mb-[10px] md:mb-2 lg:mb-2">Select or Add Topic:</h2>
          <p className="mb-[10px] md:mb-2 lg:mb-2">Selected Topic: {selectedTopic}</p>
          <select className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2" onChange={(e) => setSelectedTopic(e.target.value)}>
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
            className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2"
          />
          <button
            onClick={() => {
              handleAddTopic();
              setAdd(true);
              setAddClicked(true);
            }}
            className="p-2 bg-blue-500 text-white rounded mb-[10px] md:mb-2 lg:mb-2"
          >
            Add Topic
          </button>
          {successT && <p className="text-green-500">{successT}</p>}
        </div>

        <div className="mb-[10px] md:mb-4 lg:mb-4">
          <h2 className="text-lg font-semibold mb-[10px] md:mb-2 lg:mb-2">Add Topic Description:</h2>
          <input
            type="text"
            value={topicDescription}
            onChange={(e) => setTopicDescription(e.target.value)}
            placeholder="Topic Description"
            className="mr-2 p-2 border border-gray-300 rounded mb-[10px] md:mb-2 lg:mb-2"
          />
          <button
            onClick={() => {
              handleAddTopicDescription();
              setAdd(true);
              setFinalTopicDescription(topicDescription);
            }}
            className="p-2 bg-blue-500 text-white rounded mb-[10px] md:mb-2 lg:mb-2"
          >
            Add Topic Description
          </button>
          {successD && <p className="text-green-500 ">{successD}</p>}
        </div>

        <div className="mb-[10px] md:mb-4 lg:mb-4">
          <h2 className="text-lg font-semibold mb-[10px] md:mb-2 lg:mb-2">Upload PDF Document:</h2>
          <input type="file" onChange={handleFileChange} className="mr-2 mb-[10px] md:mb-2 lg:mb-2" />
          <button onClick={handleFileUpload} className="p-2 bg-blue-500 text-white rounded mb-[10px] md:mb-2 lg:mb-2">
            Upload PDF
          </button>
          {successUpload && <p className="text-green-500">{successUpload}</p>}
        </div>
      </>
    )}
  </div>
);



}
export default Content;