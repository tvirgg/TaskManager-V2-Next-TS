// components/Day.tsx

'use client';

import React from 'react';

interface TaskState {
  todo: string[];
  done: string[];
}

interface DayProps {
  day: number;
  isHoliday: boolean;
  hasTasks: TaskState | null; // Изменено с boolean на TaskState или null
  isCurrentDay: boolean;
  onClick: () => void;
  showTasks: boolean; // Новое свойство
}

const Day: React.FC<DayProps> = ({
  day,
  isHoliday,
  hasTasks,
  isCurrentDay,
  onClick,
  showTasks,
}) => {
  return (
    <div
      className={`flex flex-col p-2 rounded cursor-pointer border h-[170px]
        ${isCurrentDay ? 'border-yellow-500' : 'border-gray-700'}
        ${isHoliday ? 'bg-gray-800' : 'bg-gray-850'}
        hover:bg-gray-700 relative`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold">{day}</span>
        {hasTasks && !showTasks && (
          <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
        )}
      </div>
      {/* Отображение задач */}
      {hasTasks && showTasks && (
        <div className="mt-1 flex-1 overflow-hidden relative">
          <ul className="list-none p-0 m-0 max-h-24 overflow-auto pr-2">
            {hasTasks.todo.concat(hasTasks.done).map((task, index) => (
              <li
                key={index}
                className="text-sm text-white truncate mb-1"
                title={task}
              >
                • {task}
              </li>
            ))}
          </ul>
          {/* Градиент для затухания */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-850 via-transparent to-transparent pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default Day;
