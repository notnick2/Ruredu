// Tasks.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);
    const [result, setResult] = useState(null);
    

    useEffect(() => {
        const fetchIncompleteTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/get-incomplete-tasks', {
                    headers: {
                        Authorization: token,
                    },
                });
                setIncompleteTasks(response.data.incomplete);
            } catch (error) {
                console.error('Error fetching incomplete tasks:', error);
            }
        };

        const fetchCompleteTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/get-complete-tasks', {
                    headers: {
                        Authorization: token,
                    },
                });
                setCompleteTasks(response.data.complete);
            } catch (error) {
                console.error('Error fetching complete tasks:', error);
            }
        };

        fetchIncompleteTasks();
        fetchCompleteTasks();
    }, []); // Fetch data when component mounts

// fetch subject and unit data of specific topic selected

const searchTopic = async (topicName) => {
    try {
      const response = await axios.post('http://localhost:5000/searchTopic', { topicName });
      setResult(response.data);
      const data = response.data;
      const subjectName = data.subjectName;
      const unitName = data.unitName;
      window.location.href = `/dashboard/content/${subjectName}/${unitName}`
    } catch (error) {
      console.error(error);
    }
  };

    return (
        

        <div className="flex flex-col gap-4 max-h-100">
            <div>
                <h2 className="text-lg font-bold  m-6">Incomplete Tasks</h2>
                <div className="flex flex-col-reverse gap-3 overflow-y-auto max-h-[300px] ml-10 mr-40 pr-4 ">
                    {incompleteTasks && incompleteTasks.map((task, index) => (
                        <button onClick={() => {searchTopic(task)}} onclick className="border border-blue-500 shadow-md p-2 rounded-md hover:bg-blue-50">
                            {task}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-lg font-bold m-6">Completed Tasks</h2>
                <div className="flex flex-col-reverse gap-3 overflow-y-auto max-h-[300px] ml-10 mr-40 pr-4">
                    {completeTasks && completeTasks.map((task, index) => (
                        
                        <button onClick={() => {searchTopic(task)}} onclick className="border border-blue-500 p-2 shadow-md rounded-md hover:bg-blue-50">
                            {task}
                        </button>
                        
                    ))}
                </div>
            </div>
        </div>
        
    );
};

export default Tasks;
