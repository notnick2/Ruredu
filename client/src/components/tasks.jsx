// Tasks.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);

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

    return (
        <div className="flex flex-col gap-4 max-h-100">
            <div>
                <h2 className="text-lg font-bold  m-6">Incomplete Tasks</h2>
                <div className="flex flex-col-reverse gap-3 overflow-y-auto max-h-[300px] ml-10 mr-40 pr-4 ">
                    {incompleteTasks && incompleteTasks.map((task, index) => (
                        <a
                            key={index}
                            href={`#${task}`} // Replace with the link you want
                            className="border border-blue-500 p-2 rounded-md hover:bg-blue-50"
                        >
                            {task}
                        </a>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-lg font-bold m-6">Completed Tasks</h2>
                <div className="flex flex-col-reverse gap-3 overflow-y-auto max-h-[300px] ml-10 mr-40 pr-4">
                    {completeTasks && completeTasks.map((task, index) => (
                        <a
                            key={index}
                            href={`#${task}`} // Replace with the link you want
                            className="border border-blue-500 p-2 rounded-md hover:bg-blue-50"
                        >
                            {task}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
