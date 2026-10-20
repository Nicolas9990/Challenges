import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
} from "@ionic/react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
// @ts-expect-error firebaseConfig is a JavaScript module without declarations.
import { auth } from "../firebase/firebaseConfig";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { register } = useAuthContext();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/tasks");
    }catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registrar</IonTitle>
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
        <IonButton expand="block" onClick={handleRegister}>
          Registrar
        </IonButton>

        <IonButton
          expand="block"
          fill="clear"
          onClick={() => navigate("/login")}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default Register;