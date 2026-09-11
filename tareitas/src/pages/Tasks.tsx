import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from "@ionic/react";
import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      text: "Estudiar Ionic",
      completed: false
    },
    {
      id: 2,
      text: "Hacer la tarea",
      completed: false
    }
  ]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now(),
      text: text,
      completed: false
    };

    setTasks([...tasks, newTask]);
  };

  const completeTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  };

  const logout = () => {
    localStorage.removeItem("logged");
    window.location.href = "/login";
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tareitas</IonTitle>

          <IonButton
            slot="end"
            onClick={logout}
          >
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <TaskForm onAddTask={addTask} />

        <TaskList
          tasks={tasks}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      </IonContent>
    </IonPage>
  );
}

export default Tasks;

