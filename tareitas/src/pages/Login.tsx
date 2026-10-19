import React, { useContext, useState } from "react";
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
import { AuthContext } from "../context/MyContext";
import { signInWithEmailAndPassword } from "firebase/auth";
// @ts-ignore firebaseConfig is JavaScript and has no declaration file.
import { auth } from "../firebase/firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/tasks");
    }catch (error) {
      console.error("Error logging in:", error);
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