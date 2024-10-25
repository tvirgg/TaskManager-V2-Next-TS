'use client';

import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';

interface TaskModalProps {
  username: string;
  day: number;
  month: string;
  year: number;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  username,
  day,
  month,
  year,
  onClose,
}) => {
  const {
    tasks,
    addTask,
    removeTask,
    updateTask,
    toggleTaskStatus,
    moveTaskToNextDay,
    assignCommonTaskToDate,
    commonTasks,
  } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isJsonVisible, setJsonVisible] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
  const dateKey = `${year}-${String(monthIndex).padStart(2, '0')}-${String(
    day
  ).padStart(2, '0')}`;

  const userTasks = tasks[username] || {};
  const dateTasks = userTasks[dateKey] || { todo: [], done: [] };
  const userCommonTasks = commonTasks[username] || [];

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(username, dateKey, newTask.trim());
      setNewTask('');
      setError('');
    } else {
      setError('Task cannot be empty');
    }
  };

  const handleEditTask = (index: number, isDone: boolean) => {
    const task = isDone ? dateTasks.done[index] : dateTasks.todo[index];
    setNewTask(task);
    setIsEditing(true);
    setCurrentTaskIndex(index);
    setError('');
  };

  const handleUpdateTask = () => {
    if (newTask.trim() && currentTaskIndex !== null) {
      const isDone = isEditing && currentTaskIndex < dateTasks.done.length;
      updateTask(username, dateKey, currentTaskIndex, newTask.trim(), isDone);
      setNewTask('');
      setIsEditing(false);
      setCurrentTaskIndex(null);
      setError('');
    } else {
      setError('Task cannot be empty');
    }
  };

  const handleToggleTaskStatus = (index: number) => {
    toggleTaskStatus(username, dateKey, index);
  };

  const handleMoveTaskToNextDay = (index: number) => {
    moveTaskToNextDay(username, dateKey, index);
  };

  const handleAssignCommonTask = (task: string) => {
    assignCommonTaskToDate(username, dateKey, task);
  };

  const handleRemoveTask = (index: number, isDone: boolean) => {
    removeTask(username, dateKey, index, isDone);
  };

  const handleJsonSubmit = () => {
    try {
      const tasksArray = JSON.parse(jsonInput);
      if (Array.isArray(tasksArray)) {
        tasksArray.forEach((task: string) => {
          if (typeof task === 'string' && task.trim()) {
            addTask(username, dateKey, task.trim());
          }
        });
        setJsonInput('');
        setJsonVisible(false);
      } else {
        setError('JSON должен быть массивом строк.');
      }
    } catch (err) {
      setError('Неверный JSON формат.');
    }
  };

  const handleJsonKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      handleJsonSubmit();
    }
  };

  const handleShowJsonViewer = () => {
    setJsonVisible(true);
    setError('');
  };

  const handleCloseJsonViewer = () => {
    setJsonVisible(false);
    setJsonInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded w-full max-w-lg relative overflow-y-auto max-h-screen">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-2xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Tasks for {month} {day}, {year}
        </h2>
        <input
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        {error && <p className="text-red-500">{error}</p>}
        {isEditing ? (
          <button
            onClick={handleUpdateTask}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Update Task
          </button>
        ) : (
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add Task
          </button>
        )}
        {/* Task lists */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Todo</h3>
          <ul>
            {dateTasks.todo.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded"
              >
                <span>{task}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditTask(index, false)}
                    className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveTask(index, false)}
                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleToggleTaskStatus(index)}
                    className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => handleMoveTaskToNextDay(index)}
                    className="px-2 py-1 bg-purple-600 rounded hover:bg-purple-700"
                  >
                    Move
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Done</h3>
          <ul>
            {dateTasks.done.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded"
              >
                <span>{task}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditTask(index, true)}
                    className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveTask(index, true)}
                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Common Tasks */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Common Tasks</h3>
          <ul>
            {userCommonTasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded"
              >
                <span>{task}</span>
                <button
                  onClick={() => handleAssignCommonTask(task)}
                  className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* JSON Viewer */}
        <div className="mt-6">
          <button
            onClick={handleShowJsonViewer}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Import Tasks via JSON
          </button>
        </div>
        {isJsonVisible && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Enter JSON tasks</h4>
            <textarea
              className="w-full p-2 mb-2 bg-gray-700 rounded"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              onKeyPress={handleJsonKeyPress}
              placeholder='["Task 1", "Task 2"]'
              rows={4}
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex space-x-2">
              <button
                onClick={handleJsonSubmit}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Submit JSON
              </button>
              <button
                onClick={handleCloseJsonViewer}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
