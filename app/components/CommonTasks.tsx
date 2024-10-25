'use client';

import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';

interface CommonTasksProps {
  username: string;
}

const CommonTasks: React.FC<CommonTasksProps> = ({ username }) => {
  const { commonTasks, addCommonTask, removeCommonTask } = useTasks();
  const [newTask, setNewTask] = useState('');
  const userCommonTasks = commonTasks[username] || [];

  const handleAddCommonTask = () => {
    if (newTask.trim()) {
      addCommonTask(username, newTask.trim());
      setNewTask('');
    }
  };

  const handleRemoveCommonTask = (index: number) => {
    removeCommonTask(username, index);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Common Tasks</h2>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a common task"
        className="w-full p-2 mb-2 bg-gray-700 rounded"
      />
      <button
        onClick={handleAddCommonTask}
        className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700 mb-4"
      >
        Add Common Task
      </button>
      <ul>
        {userCommonTasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded"
          >
            <span>{task}</span>
            <button
              onClick={() => handleRemoveCommonTask(index)}
              className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommonTasks;
