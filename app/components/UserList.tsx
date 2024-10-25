'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const { setCurrentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const storedUsersRaw = localStorage.getItem('users');
    try {
      const storedUsers = JSON.parse(storedUsersRaw || '[]');
      if (Array.isArray(storedUsers)) {
        setUsers(storedUsers);
      } else {
        console.warn('Stored users is not an array. Resetting to empty array.');
        setUsers([]);
        localStorage.setItem('users', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error parsing stored users:', error);
      setUsers([]);
      localStorage.setItem('users', JSON.stringify([]));
    }
  }, []);

  const handleAddUser = () => {
    if (newUsername.trim()) {
      const updatedUsers = [...users, newUsername.trim()];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setNewUsername('');
    }
  };

  const handleUserClick = (username: string) => {
    setCurrentUser(username);
    router.push(`/calendar/${username}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Select Your Profile</h2>
      <div className="w-full max-w-md px-4">
        <input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Add new user"
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
        />
        <button
          onClick={handleAddUser}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
        >
          Add User
        </button>
        <ul className="mt-4">
          {users.map((username) => (
            <li key={username} className="mt-2">
              <span
                onClick={() => handleUserClick(username)}
                className="cursor-pointer hover:underline text-xl"
              >
                {username}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
