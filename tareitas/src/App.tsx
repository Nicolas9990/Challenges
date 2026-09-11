import React from "react";
import {
  IonApp,
  IonRouterOutlet
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

import "./App.css";

function App() {
  const logged = localStorage.getItem("logged") === "true";

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>

          <Route
            path="/login"
            element={
              logged ? (
                <Navigate to="/tasks" />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/tasks"
            element={
              logged ? (
                <Tasks />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to={logged ? "/tasks" : "/login"}
              />
            }
          />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
