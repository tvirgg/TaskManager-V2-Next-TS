'use client';

import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ArrowRightIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
    addCommonTask,
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

  // Обработка нажатия клавиши Enter для добавления задачи
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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

  // Сброс состояния при закрытии модального окна
  useEffect(() => {
    if (!isJsonVisible) {
      setIsEditing(false);
      setCurrentTaskIndex(null);
      setNewTask('');
      setError('');
    }
  }, [isJsonVisible]);

  // Перемещение задачи в common tasks
  const handleAssignToCommonTasks = (index: number, isDone: boolean) => {
    const task = isDone ? dateTasks.done[index] : dateTasks.todo[index];
    addCommonTask(username, task); // Добавляем задачу в common tasks
    removeTask(username, dateKey, index, isDone); // Удаляем задачу из текущего списка
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl relative overflow-y-auto max-h-screen">
        {/* Кнопка закрытия модального окна */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          aria-label="Close Modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Tasks for {month} {day}, {year}
        </h2>

        {/* Поле ввода задачи */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            className="w-2/3 p-3 bg-gray-700 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new task"
            aria-label="Task Input"
          />
        </div>

        {/* Сообщение об ошибке */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Кнопки действий */}
        <div className="flex justify-center space-x-4 mb-6">
          {isEditing ? (
            <button
              onClick={handleUpdateTask}
              className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Update Task"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Update
            </button>
          ) : (
            <button
              onClick={handleAddTask}
              className="flex items-center px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Add Task"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Add
            </button>
          )}
          <button
            onClick={handleShowJsonViewer}
            className="flex items-center px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Add via JSON"
          >
            <DocumentIcon className="h-5 w-5 mr-2" />
            Import JSON
          </button>
        </div>

        {/* Разделительная линия с закруглением и тонкой толщиной */}
        <div className="border-t border-gray-600 rounded-full h-px mb-6"></div>

        {/* Списки Todo и Done */}
        <div className="flex space-x-4">
          {/* Todo */}
          <div className="w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-center">Todo</h3>
            {dateTasks.todo.length === 0 ? (
              <p className="text-center text-gray-400">No tasks in Todo.</p>
            ) : (
              <ul>
                {dateTasks.todo.map((task, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-4 bg-gray-700 p-4 rounded-lg text-lg"
                  >
                    <span>{task}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTask(index, false)}
                        className="text-yellow-400 hover:text-yellow-300"
                        aria-label="Edit Task"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveTask(index, false)}
                        className="text-red-500 hover:text-red-400"
                        aria-label="Remove Task"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleTaskStatus(index)}
                        className="text-green-500 hover:text-green-400"
                        aria-label="Mark as Done"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleMoveTaskToNextDay(index)}
                        className="text-purple-500 hover:text-purple-400"
                        aria-label="Move to Next Day"
                      >
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                      {/* Кнопка для перемещения задачи в common tasks */}
                      <button
                        onClick={() => handleAssignToCommonTasks(index, false)}
                        className="text-indigo-500 hover:text-indigo-400"
                        aria-label="Move to Common Tasks"
                      >
                        <ArrowRightIcon className="h-5 w-5 transform rotate-90" /> {/* Стрелка вниз */}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Done */}
          <div className="w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-center">Done</h3>
            {dateTasks.done.length === 0 ? (
              <p className="text-center text-gray-400">No tasks in Done.</p>
            ) : (
              <ul>
                {dateTasks.done.map((task, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-4 bg-gray-700 p-4 rounded-lg text-lg"
                  >
                    <span>{task}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTask(index, true)}
                        className="text-yellow-400 hover:text-yellow-300"
                        aria-label="Edit Task"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveTask(index, true)}
                        className="text-red-500 hover:text-red-400"
                        aria-label="Remove Task"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      {/* Кнопка для перемещения задачи в common tasks */}
                      <button
                        onClick={() => handleAssignToCommonTasks(index, true)}
                        className="text-indigo-500 hover:text-indigo-400"
                        aria-label="Move to Common Tasks"
                      >
                        <ArrowRightIcon className="h-5 w-5 transform rotate-90" /> {/* Стрелка вниз */}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Common Tasks */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Common Tasks</h3>
          {userCommonTasks.length === 0 ? (
            <p className="text-center text-gray-400">No common tasks available.</p>
          ) : (
            <ul>
              {userCommonTasks.map((task, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-4 bg-gray-700 p-4 rounded-lg text-lg"
                >
                  <span>{task}</span>
                  <button
                    onClick={() => handleAssignCommonTask(task)}
                    className="text-green-500 hover:text-green-400"
                    aria-label="Assign Common Task"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* JSON Viewer */}
        {isJsonVisible && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4 text-center">Enter JSON Tasks</h4>
            <textarea
              className="w-full p-3 mb-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              onKeyPress={handleJsonKeyPress}
              placeholder='["Task 1", "Task 2"]'
              rows={4}
              aria-label="JSON Task Input"
            />
            {error && <p className="text-red-500 text-center mb-6">{error}</p>}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleJsonSubmit}
                className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Submit JSON Tasks"
              >
                <DocumentIcon className="h-5 w-5 mr-2" />
                Submit
              </button>
              <button
                onClick={handleCloseJsonViewer}
                className="flex items-center px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close JSON Viewer"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
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
