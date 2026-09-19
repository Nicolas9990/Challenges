import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTaskContext } from "../context/TaskContext";
import { useAuthContext } from "../context/AuthContext";

function Tasks() {
  const navigate = useNavigate();
  const { tasks, addTask, completeTask, deleteTask } = useTaskContext();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tareitas</IonTitle>

          <IonButton slot="end" onClick={handleLogout}>
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

