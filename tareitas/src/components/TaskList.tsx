import React from "react";
import { IonList } from "@ionic/react";
import TaskItem from "./TaskItem";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskList({
  tasks,
  onComplete,
  onDelete
}: TaskListProps) {
  return (
    <IonList>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </IonList>
  );
}

export default TaskList;
