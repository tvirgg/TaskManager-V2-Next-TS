'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface TaskState {
  todo: string[];
  done: string[];
}

interface UserTasks {
  [date: string]: TaskState;
}

interface CommonTasks {
  [username: string]: string[];
}

interface TasksContextType {
  tasks: { [username: string]: UserTasks };
  commonTasks: CommonTasks;
  addTask: (username: string, date: string, task: string) => void;
  removeTask: (username: string, date: string, index: number, isDone: boolean) => void;
  updateTask: (username: string, date: string, index: number, newTask: string, isDone: boolean) => void;
  toggleTaskStatus: (username: string, date: string, index: number) => void;
  moveTaskToNextDay: (username: string, date: string, index: number) => void;
  addCommonTask: (username: string, task: string) => void;
  removeCommonTask: (username: string, index: number) => void;
  assignCommonTaskToDate: (username: string, date: string, task: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<{ [username: string]: UserTasks }>({});
  const [commonTasks, setCommonTasks] = useState<CommonTasks>({});

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    const storedCommonTasks = JSON.parse(localStorage.getItem('commonTasks') || '{}');
    setTasks(storedTasks);
    setCommonTasks(storedCommonTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('commonTasks', JSON.stringify(commonTasks));
  }, [commonTasks]);

  const addTask = (username: string, date: string, task: string) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username] || {};
      const dateTasks = userTasks[date] || { todo: [], done: [] };
      dateTasks.todo.push(task);
      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: dateTasks,
        },
      };
    });
  };

  const removeTask = (username: string, date: string, index: number, isDone: boolean) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username];
      if (!userTasks) return prevTasks;
      const dateTasks = userTasks[date];
      if (!dateTasks) return prevTasks;

      if (isDone) {
        dateTasks.done.splice(index, 1);
      } else {
        dateTasks.todo.splice(index, 1);
      }

      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: dateTasks,
        },
      };
    });
  };

  const updateTask = (username: string, date: string, index: number, newTask: string, isDone: boolean) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username];
      if (!userTasks) return prevTasks;
      const dateTasks = userTasks[date];
      if (!dateTasks) return prevTasks;

      if (isDone) {
        dateTasks.done[index] = newTask;
      } else {
        dateTasks.todo[index] = newTask;
      }

      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: dateTasks,
        },
      };
    });
  };

  const toggleTaskStatus = (username: string, date: string, index: number) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username];
      if (!userTasks) return prevTasks;
      const dateTasks = userTasks[date];
      if (!dateTasks) return prevTasks;

      const task = dateTasks.todo[index];
      dateTasks.todo.splice(index, 1);
      dateTasks.done.push(task);

      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: dateTasks,
        },
      };
    });
  };

  const moveTaskToNextDay = (username: string, date: string, index: number) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username];
      if (!userTasks) return prevTasks;
      const dateTasks = userTasks[date];
      if (!dateTasks) return prevTasks;

      const task = dateTasks.todo[index];
      dateTasks.todo.splice(index, 1);

      const currentDate = new Date(date);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      const nextDateKey = nextDate.toISOString().split('T')[0];

      const nextDateTasks = userTasks[nextDateKey] || { todo: [], done: [] };
      nextDateTasks.todo.push(task);

      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: dateTasks,
          [nextDateKey]: nextDateTasks,
        },
      };
    });
  };

  const addCommonTask = (username: string, task: string) => {
    setCommonTasks((prevCommonTasks) => {
      const userCommonTasks = prevCommonTasks[username] || [];
      userCommonTasks.push(task);
      return {
        ...prevCommonTasks,
        [username]: userCommonTasks,
      };
    });
  };

  const removeCommonTask = (username: string, index: number) => {
    setCommonTasks((prevCommonTasks) => {
      const userCommonTasks = prevCommonTasks[username];
      if (!userCommonTasks) return prevCommonTasks;
      userCommonTasks.splice(index, 1);
      return {
        ...prevCommonTasks,
        [username]: userCommonTasks,
      };
    });
  };

  const assignCommonTaskToDate = (username: string, date: string, task: string) => {
    addTask(username, date, task);
    setCommonTasks((prevCommonTasks) => {
      const userCommonTasks = prevCommonTasks[username];
      if (!userCommonTasks) return prevCommonTasks;
      return {
        ...prevCommonTasks,
        [username]: userCommonTasks.filter((t) => t !== task),
      };
    });
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        commonTasks,
        addTask,
        removeTask,
        updateTask,
        toggleTaskStatus,
        moveTaskToNextDay,
        addCommonTask,
        removeCommonTask,
        assignCommonTaskToDate,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};
