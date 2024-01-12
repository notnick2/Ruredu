import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Topic = () => {
  const navigate = useNavigate();
  const { subject, unit } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        } else {
          console.error('Error fetching topics');
        }
      } catch (error) {
        console.error('Error fetching topics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subject, unit]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{`Topics for ${subject} - ${unit}`}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
  {topics.map((topic, index) => (
    <li key={index} className="mb-2">
      <Link to={`/${topic.topic_name}`}>
        <strong>{topic.topic_name}</strong>: {topic.topic_description}
      </Link>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default Topic;
