import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      navigate("/tasks");
    } else {
      console.error("Error logging in:", result.error);
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
        <IonInput
          type="email"
          placeholder="Email"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value || "")}
        />

        <IonInput
          type="password"
          placeholder="Password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value || "")}
        />

        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          onClick={() => navigate("/register")}
        >
          ¿No tienes cuenta? Regístrate
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default Login;