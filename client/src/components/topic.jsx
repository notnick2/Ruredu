import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Topic = () => {
  const navigate = useNavigate();
  const { subject, unit } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);

  // Function to check completion for the selected topic
  const checkTopicCompletion = async (topic) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/check-topic-completion', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicName: topic.topic_name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsTopicCompleted(data.isCompleted);
      } else {
        console.error('Error checking topic completion');
      }
    } catch (error) {
      console.error('Error checking topic completion', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login or handle unauthorized access
        navigate('/');
        console.error('Unauthorized access - Token missing');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/get-topics/${subject}/${unit}`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);

        // Assuming you want to check completion for the selected topic
        if (data.topics.length > 0) {
          checkTopicCompletion(data.topics[0]);
        }
      } else {
        console.error('Error fetching topics');
      }
    } catch (error) {
      console.error('Error fetching topics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [subject, unit, navigate]);

  const handleClick = async (topic) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/get-pdf', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicName: topic.topic_name,
          topicDescription: topic.topic_description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTopicName(topic.topic_name);
        setTopicDescription(topic.topic_description);
        setPdfPath(data.pdfPath); // Assuming the backend sends the PDF path in the response

        // Check completion for the selected topic
        checkTopicCompletion(topic);
      } else {
        console.error('Error fetching PDF');
      }
    } catch (error) {
      console.error('Error handling click', error);
    }
  };

  // Function to mark the selected topic as completed
  const markTopicCompleted = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/mark-topic-completed', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicName: topicName,
        }),
      });

      if (response.ok) {
        // Assuming the backend responds with a success message
        console.log('Topic marked as completed successfully!');
        setIsTopicCompleted(true);
      } else {
        console.error('Error marking topic as completed');
      }
    } catch (error) {
      console.error('Error marking topic as completed', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mx-auto md:flex-1 mt-8 p-8 bg-white md:ml-4 md:mr-4">
        <h1 className="mx-auto text-3xl font-bold mb-4 relative">{`Topics for ${subject} - ${unit}`}</h1>
        <div className="mx-auto md:flex-1 mt-8 p-8 bg-white shadow-lg overflow-y-auto max-h-96 md:ml-4 md:mr-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {topics.map((topic, index) => (
                <li key={index} className="mb-4">
                  <button
                    onClick={() => handleClick(topic)}
                    className="hover:bg-blue-200 focus:bg-blue-200 focus:outline-none p-2 rounded-lg text-lg transition-colors block w-full border border-blue-500"
                  >
                    <span className="font-bold text-xl">{topic.topic_name}</span><br />
                    <span className="text-sm">{topic.topic_description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="m-6 mt-10">

        {isTopicCompleted ? (
          <button className="bg-green-500 text-xl text-white py-2 px-4 rounded-md mt-4">
            {topicName} Completed
          </button>
        ) : (
          <button
            onClick={markTopicCompleted}
            className="bg-gray-300 text-gray-700 text-xl py-2 px-4 rounded-md hover:bg-gray-400 focus:bg-gray-400 focus:outline-none mt-4"
          >
            Mark {topicName} Completed
          </button>
        )}   
        </div>     
      </div>
      <div className="flex-grow mt-5">
        {pdfPath && (
          <div className="rounded-lg md:mt-0 sm:ml-0 ml-6 mr-6 sm:mr-12 overflow-hidden">
            <iframe src={`http://localhost:5000/${pdfPath}`} width="100%" height="800px" title="PDF Viewer" className="border border-blue-500"></iframe>
          </div>
        )}

      </div>
    </div>
  );
};

export default Topic;
