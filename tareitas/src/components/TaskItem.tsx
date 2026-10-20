import React from "react";
import { IonItem, IonButton } from "@ionic/react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

function TaskItem({
  task,
  onComplete,
  onDelete,
  disabled = false,
}: TaskItemProps) {
  return (
    <IonItem>
      <input
        type="checkbox"
        checked={task.completed}
        disabled={disabled}
        onChange={() => onComplete(task.id)}
      />

      <span
        style={{
          marginLeft: "10px",
          textDecoration: task.completed
            ? "line-through"
            : "none",
        }}
      >
        {task.text}
      </span>

      <IonButton
        slot="end"
        color="danger"
        disabled={disabled}
        onClick={() => onDelete(task.id)}
      >
        Eliminar
      </IonButton>
    </IonItem>
  );
}

export default TaskItem;