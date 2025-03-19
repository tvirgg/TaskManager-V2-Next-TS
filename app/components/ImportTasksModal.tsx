'use client';

import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface ImportTasksModalProps {
  username: string;
  onClose: () => void;
}

interface DayTasks {
  date: string;
  tasks: string[];
}

const ImportTasksModal: React.FC<ImportTasksModalProps> = ({ username, onClose }) => {
  const { addTask } = useTasks();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState<{ success: DayTasks[]; failed: any[] } | null>(null);

  // Example JSON format
  const exampleJson = JSON.stringify([
    {
      date: '2025-03-20',
      tasks: ['Task 1', 'Task 2']
    },
    {
      date: '2025-03-21',
      tasks: ['Task 3', 'Task 4']
    }
  ], null, 2);

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        setError('JSON должен быть массивом объектов с датами и задачами.');
        return;
      }

      const successfulImports: DayTasks[] = [];
      const failedImports: any[] = [];

      data.forEach((item) => {
        if (typeof item !== 'object' || !item.date || !Array.isArray(item.tasks)) {
          failedImports.push(item);
          return;
        }

        try {
          // Validate date format (YYYY-MM-DD)
          if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
            failedImports.push(item);
            return;
          }

          const validTasks = item.tasks.filter((task: any) => typeof task === 'string' && task.trim());
          
          // Add each task to the specified date
          validTasks.forEach((task: string) => {
            addTask(username, item.date, task);
          });

          successfulImports.push({
            date: item.date,
            tasks: validTasks
          });
        } catch (err) {
          failedImports.push(item);
        }
      });

      // Show import results
      setImportResult({
        success: successfulImports,
        failed: failedImports
      });

      if (failedImports.length === 0) {
        setError('');
      } else {
        setError(`${failedImports.length} элементов не удалось импортировать.`);
      }
    } catch (err) {
      setError('Неверный JSON формат.');
    }
  };

  const closeWithAlert = () => {
    if (importResult && importResult.success.length > 0) {
      const totalTasks = importResult.success.reduce((sum, day) => sum + day.tasks.length, 0);
      const message = `Успешно импортировано ${totalTasks} задач для ${importResult.success.length} дней.`;
      alert(message);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl relative overflow-y-auto max-h-screen">
        {/* Кнопка закрытия модального окна */}
        <button
          onClick={closeWithAlert}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          aria-label="Close Modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Import Tasks by Days
        </h2>

        {/* Инструкции */}
        <div className="mb-4 text-gray-300">
          <p>Введите JSON в следующем формате:</p>
          <pre className="bg-gray-700 p-3 rounded-lg mt-2 overflow-x-auto text-sm">
            {exampleJson}
          </pre>
        </div>

        {/* Поле ввода JSON */}
        <textarea
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Вставьте JSON здесь..."
          rows={10}
          aria-label="JSON Task Input"
        />

        {/* Сообщение об ошибке */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Результаты импорта */}
        {importResult && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Результаты импорта:</h3>
            <p className="text-green-500">
              Успешно импортировано: {importResult.success.length} дней, 
              {importResult.success.reduce((sum, day) => sum + day.tasks.length, 0)} задач
            </p>
            {importResult.failed.length > 0 && (
              <p className="text-red-500">
                Не удалось импортировать: {importResult.failed.length} элементов
              </p>
            )}
          </div>
        )}

        {/* Кнопка импорта */}
        <div className="flex justify-center">
          <button
            onClick={handleImport}
            className="flex items-center px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            aria-label="Import Tasks"
          >
            <DocumentIcon className="h-5 w-5 mr-2" />
            Импортировать
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportTasksModal;
