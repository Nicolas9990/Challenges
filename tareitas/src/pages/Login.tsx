import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton
} from "@ionic/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (email === "user@mail.com" && password === "123") {
      localStorage.setItem("logged", "true");

      window.location.href = "/tasks";
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonItem>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </IonItem>

        <IonItem>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </IonItem>

        <IonButton expand="block" onClick={login}>
          Login
        </IonButton>

      </IonContent>
    </IonPage>
  );
}

export default Login;
