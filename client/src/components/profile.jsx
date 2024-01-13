import React, { useState } from 'react';

const Profile = () => {
    const [updatedStudentName, setUpdatedStudentName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        console.log(updatedStudentName, newPassword);
        try {
            const response = await fetch('http://localhost:5000/api/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    updatedStudentName,
                    newPassword,
                }),
            });

            if (response.ok) {
                setMessage('User information updated successfully');
            } else {
                const data = await response.json();
                console.error('Error updating user:', data);
                setMessage('Failed to update user information');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage('Failed to update user information');
        }
    };

    return (
        <div className="mt-10 ml-10">
            <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
            <h1 className="text-lg font-medium text-gray-700 pb-4">Update your username or password or both</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                    type="text"
                    className="mt-1 p-2 border rounded-md w-80"
                    value={updatedStudentName}
                    onChange={(e) => setUpdatedStudentName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    className="mt-1 p-2 border rounded-md w-80"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <button
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                onClick={handleUpdateProfile}
            >
                Update Profile
            </button>
            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default Profile;
