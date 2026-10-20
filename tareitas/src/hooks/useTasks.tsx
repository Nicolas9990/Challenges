import { useEffect, useState } from "react";
import {
  ref,
  push,
  onValue,
  update,
  remove,
} from "firebase/database";

// @ts-expect-error firebaseConfig is JavaScript without a declaration file.
import { realtimeDb } from "../firebase/firebaseConfig";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const tasksRef = ref(realtimeDb, "tasks");

    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setTasks([]);
        return;
      }

      const tasksList: Task[] = Object.entries(data).map(
        ([id, value]: [string, any]) => ({
          id,
          text: value.text,
          completed: value.completed,
        })
      );

      setTasks(tasksList);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const tasksRef = ref(realtimeDb, "tasks");

    await push(tasksRef, {
      text: text.trim(),
      completed: false,
    });
  };

  const completeTask = async (id: string): Promise<void> => {
    const taskRef = ref(realtimeDb, `tasks/${id}`);

    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    await update(taskRef, {
      completed: !task.completed,
    });
  };

  const deleteTask = async (id: string): Promise<void> => {
    const taskRef = ref(realtimeDb, `tasks/${id}`);

    await remove(taskRef);
  };

  return {
    tasks,
    addTask,
    completeTask,
    deleteTask,
  };
}