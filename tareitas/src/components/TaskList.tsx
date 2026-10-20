import React from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../hooks/useTasks";

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

function TaskList({
  tasks,
  onComplete,
  onDelete,
  disabled = false,
}: TaskListProps) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default TaskList;