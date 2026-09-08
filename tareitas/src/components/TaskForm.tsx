import React, { useState } from "react";
import { IonItem, IonButton } from "@ionic/react";

interface TaskFormProps {
  onAddTask: (text: string) => void;
}

function TaskForm({ onAddTask }: TaskFormProps) {
  const [text, setText] = useState<string>("");

  const addTask = () => {
    if (text.trim() === "") {
      return;
    }

    onAddTask(text);
    setText("");
  };

  return (
    <IonItem>
      <input
        type="text"
        placeholder="Escribe una tarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <IonButton slot="end" onClick={addTask}>
        Agregar
      </IonButton>
    </IonItem>
  );
}

export default TaskForm;