import { createContext, useContext, type ReactNode } from "react";
import { useTasks, type Task } from "../hooks/useTasks";

interface TaskContextType {
  tasks: Task[];
  addTask: (text: string) => void;
  completeTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const tasksData = useTasks();

  return (
    <TaskContext.Provider value={tasksData}>{children}</TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }

  return context;
}
