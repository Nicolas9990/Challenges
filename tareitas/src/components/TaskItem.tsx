import React from "react";
import { IonItem, IonButton } from "@ionic/react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({
  task,
  onComplete,
  onDelete
}: TaskItemProps) {
  return (
    <IonItem>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onComplete(task.id)}
      />

      <span
        style={{
          marginLeft: "10px",
          textDecoration: task.completed
            ? "line-through"
            : "none"
        }}
      >
        {task.text}
      </span>

      <IonButton
        slot="end"
        color="danger"
        onClick={() => onDelete(task.id)}
      >
        Eliminar
      </IonButton>
    </IonItem>
  );
}

export default TaskItem;