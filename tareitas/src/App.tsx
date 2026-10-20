import React from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Navigate, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import { useAuthContext } from "./context/AuthContext";

import "./App.css";
import Fruits from "./pages/Fruits";
import Contacts from "./pages/Contacts";

function AppRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <IonRouterOutlet>
      <Route path="/login" element={user ? <Navigate to="/tasks" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/tasks" replace /> : <Register />} />
      <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/tasks" replace />} />
      <Route path="/home" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={user ? "/tasks" : "/login"} replace />} />
      <Route path="/fruits" element={user ? <Fruits /> : <Navigate to="/login" replace />} />
      <Route path="/contacts" element={user ? <Contacts /> : <Navigate to="/login" replace />}/>
    </IonRouterOutlet>
  );
}

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
