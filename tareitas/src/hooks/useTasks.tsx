import { useState } from "react";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      text: "Estudiar Ionic",
      completed: false,
    },
    {
      id: 2,
      text: "Hacer la tarea",
      completed: false,
    },
  ]);

  const addTask = (text: string) => {
    if (!text.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const completeTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return {
    tasks,
    addTask,
    completeTask,
    deleteTask,
  };
}
