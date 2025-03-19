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
      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: {
            ...dateTasks,
            todo: [...dateTasks.todo, task],
          },
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
        return {
          ...prevTasks,
          [username]: {
            ...userTasks,
            [date]: {
              ...dateTasks,
              done: dateTasks.done.filter((_, i) => i !== index),
            },
          },
        };
      } else {
        return {
          ...prevTasks,
          [username]: {
            ...userTasks,
            [date]: {
              ...dateTasks,
              todo: dateTasks.todo.filter((_, i) => i !== index),
            },
          },
        };
      }
    });
  };

  const updateTask = (username: string, date: string, index: number, newTask: string, isDone: boolean) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username];
      if (!userTasks) return prevTasks;
      const dateTasks = userTasks[date];
      if (!dateTasks) return prevTasks;

      if (isDone) {
        return {
          ...prevTasks,
          [username]: {
            ...userTasks,
            [date]: {
              ...dateTasks,
              done: dateTasks.done.map((task, i) => (i === index ? newTask : task)),
            },
          },
        };
      } else {
        return {
          ...prevTasks,
          [username]: {
            ...userTasks,
            [date]: {
              ...dateTasks,
              todo: dateTasks.todo.map((task, i) => (i === index ? newTask : task)),
            },
          },
        };
      }
    });
  };

  const toggleTaskStatus = (username: string, date: string, index: number) => {
    setTasks((prevTasks) => {
      const userTasks = prevTasks[username];
      if (!userTasks) return prevTasks;
      const dateTasks = userTasks[date];
      if (!dateTasks) return prevTasks;

      const task = dateTasks.todo[index];
      if (!task) return prevTasks;

      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: {
            ...dateTasks,
            todo: dateTasks.todo.filter((_, i) => i !== index),
            done: [...dateTasks.done, task],
          },
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
      if (!task) return prevTasks;

      const currentDate = new Date(date);
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      const nextDateKey = nextDate.toISOString().split('T')[0];

      const nextDateTasks = userTasks[nextDateKey] || { todo: [], done: [] };

      return {
        ...prevTasks,
        [username]: {
          ...userTasks,
          [date]: {
            ...dateTasks,
            todo: dateTasks.todo.filter((_, i) => i !== index),
          },
          [nextDateKey]: {
            ...nextDateTasks,
            todo: [...nextDateTasks.todo, task],
          },
        },
      };
    });
  };

  const addCommonTask = (username: string, task: string) => {
    setCommonTasks((prevCommonTasks) => {
      const userCommonTasks = prevCommonTasks[username] || [];
      return {
        ...prevCommonTasks,
        [username]: [...userCommonTasks, task],
      };
    });
  };

  const removeCommonTask = (username: string, index: number) => {
    setCommonTasks((prevCommonTasks) => {
      const userCommonTasks = prevCommonTasks[username];
      if (!userCommonTasks) return prevCommonTasks;
      return {
        ...prevCommonTasks,
        [username]: userCommonTasks.filter((_, i) => i !== index),
      };
    });
  };

  const assignCommonTaskToDate = (username: string, date: string, task: string) => {
    addTask(username, date, task);
    // Удаляем задачу из common tasks после добавления на конкретный день
    setCommonTasks((prevCommonTasks) => {
      const userCommonTasks = prevCommonTasks[username] || [];
      const taskIndex = userCommonTasks.indexOf(task);
      if (taskIndex !== -1) {
        return {
          ...prevCommonTasks,
          [username]: userCommonTasks.filter((_, i) => i !== taskIndex),
        };
      }
      return prevCommonTasks;
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
