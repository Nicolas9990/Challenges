import React, { useState } from "react";
import { IonItem, IonButton } from "@ionic/react";

interface TaskFormProps {
  onAddTask: (text: string) => Promise<void>;
  disabled?: boolean;
}

function TaskForm({
  onAddTask,
  disabled = false,
}: TaskFormProps) {
  const [text, setText] = useState<string>("");

  const addTask = async () => {
    if (text.trim() === "") return;

    await onAddTask(text);
    setText("");
  };

  return (
    <IonItem>
      <input
        type="text"
        placeholder="Escribe una tarea"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
      />

      <IonButton
        slot="end"
        onClick={addTask}
        disabled={disabled}
      >
        Agregar
      </IonButton>
    </IonItem>
  );
}

export default TaskForm;