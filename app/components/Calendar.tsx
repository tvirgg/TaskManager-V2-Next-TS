// components/Calendar.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Day from './Day';
import TaskModal from './TaskModal';
import CommonTasks from './CommonTasks';
import { useTasks } from '../contexts/TaskContext';
import { getMonthlyHolidays } from '../api/isDayOff';
import { useUser } from '../contexts/UserContext';
import { EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import ImportTasksModal from './ImportTasksModal';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarProps {
  username: string;
}

const Calendar: React.FC<CalendarProps> = ({ username }) => {
  const { tasks } = useTasks();
  const [holidays, setHolidays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const { currentUser } = useUser();
  const [showTasks, setShowTasks] = useState<boolean>(true); // Состояние для отображения задач
  const [showImportModal, setShowImportModal] = useState<boolean>(false); // Состояние для модального окна импорта

  useEffect(() => {
    fetchHolidays();
  }, [currentMonth, currentYear]);

  const fetchHolidays = async () => {
    try {
      const holidays = await getMonthlyHolidays(currentYear, currentMonth);
      setHolidays(holidays);
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    }
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (year: number, month: number): number[] => {
    return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const userTasks = tasks[username] || {};

  const toggleShowTasks = () => {
    setShowTasks((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top navigation */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        {/* Company name */}
        <h1 className="text-xl font-bold text-white">Gerus/targets/</h1>
        {/* Navigation controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white"
          >
            Prev
          </button>
          <span className="font-semibold text-white">
            {monthNames[currentMonth - 1]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white"
          >
            Next
          </button>
        </div>
        {/* Profile, Import, Eye Icon, Logout */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white flex items-center"
            aria-label="Import Tasks"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
            Import
          </button>
          <button
            onClick={toggleShowTasks}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={showTasks ? 'Hide Tasks' : 'Show Tasks'}
          >
            <EyeIcon className="h-6 w-6 text-white" />
          </button>
          <span className="text-white">{currentUser}</span>
          <button
            onClick={() => {
              localStorage.removeItem('currentUser');
              window.location.href = '/';
            }}
            className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left vertical panel */}
        <div className="w-64 bg-gray-850 p-4 overflow-y-auto">
          {/* List of months */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-white">Months</h2>
            <ul>
              {monthNames.map((month, index) => {
                const isActive = index + 1 === currentMonth;
                return (
                  <li
                    key={index}
                    className={`cursor-pointer mb-2 p-2 rounded transition-colors duration-200 ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setCurrentMonth(index + 1)}
                  >
                    {month}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Common Tasks */}
          <CommonTasks username={username} />
        </div>

        {/* Weekly calendar */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="text-center font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }).map((_, index) => (
              <div key={`empty-${index}`}></div>
            ))}
            {/* Days */}
            {days.map((day) => {
              const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTasks = userTasks[dateKey];
              const isCurrentDay =
                day === new Date().getDate() &&
                currentMonth === new Date().getMonth() + 1 &&
                currentYear === new Date().getFullYear();
              const isWeekend =
                (startOffset + day - 1) % 7 === 5 || (startOffset + day - 1) % 7 === 6;
              const hasTasks =
                dayTasks &&
                (dayTasks.todo.length > 0 || dayTasks.done.length > 0);

              return (
                <Day
                  key={day}
                  day={day}
                  isHoliday={holidays.includes(day) || isWeekend}
                  hasTasks={hasTasks ? dayTasks : null} // Передаём объект задач или null
                  isCurrentDay={isCurrentDay}
                  onClick={() => handleDayClick(day)}
                  showTasks={showTasks} // Передаём новое свойство
                />
              );
            })}
          </div>
        </div>
      </div>

      {selectedDay !== null && (
        <TaskModal
          username={username}
          day={selectedDay}
          month={monthNames[currentMonth - 1]}
          year={currentYear}
          onClose={handleCloseModal}
        />
      )}

      {showImportModal && (
        <ImportTasksModal
          username={username}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
