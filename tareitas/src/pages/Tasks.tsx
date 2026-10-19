import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
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
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      navigate("/login");
    } else {
      console.error("Error logging out:", result.error);
      setLogoutError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
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
        {logoutError && (
          <IonText color="danger" role="alert">
            <p>{logoutError}</p>
          </IonText>
        )}

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
