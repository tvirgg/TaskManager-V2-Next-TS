'use client';

import React from 'react';

interface DayProps {
  day: number;
  isHoliday: boolean;
  hasTasks: boolean;
  isCurrentDay: boolean;
  onClick: () => void;
}

const Day: React.FC<DayProps> = ({
  day,
  isHoliday,
  hasTasks,
  isCurrentDay,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-col p-2 rounded cursor-pointer border h-[170px]
        ${isCurrentDay ? 'border-yellow-500' : 'border-gray-700'}
        ${isHoliday ? 'bg-gray-800' : 'bg-gray-850'}
        hover:bg-gray-700`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">{day}</span>
        {hasTasks && <span className="text-green-400">●</span>}
      </div>
      {/* Tasks preview can be added here */}
    </div>
  );
};

export default Day;
