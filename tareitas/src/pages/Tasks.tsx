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
import { useNetwork } from "../hooks/useNetwork";

function Tasks() {
  const navigate = useNavigate();

  const { tasks, addTask, completeTask, deleteTask } = useTaskContext();
  const { logout } = useAuthContext();

  const { connected, connectionType } = useNetwork();

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

          <IonButton slot="end" onClick={() => navigate("/contacts")}>
            Contactos
          </IonButton>

          <IonButton slot="end" onClick={() => navigate("/fruits")}>
            Frutas
          </IonButton>

          <IonButton slot="end" onClick={handleLogout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            background: connected ? "#d4edda" : "#f8d7da",
          }}
        >
          {connected
            ? `🟢 Conectado (${connectionType})`
            : "🔴 Sin conexión"}
        </div>

        <TaskForm
          onAddTask={addTask}
          disabled={!connected}
        />

        <TaskList
          tasks={tasks}
          onComplete={completeTask}
          onDelete={deleteTask}
          disabled={!connected}
        />
      </IonContent>
    </IonPage>
  );
}

export default Tasks;