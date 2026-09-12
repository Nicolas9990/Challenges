import { useState } from "react";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonToast
} from "@ionic/react";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);

  const iniciarSesion = () => {

    if (usuario === "doctor" && password === "1234") {

      localStorage.setItem("sesion", "true");

      onLogin();

    } else {

      setMostrarToast(true);

    }
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas Médicas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Iniciar sesión</h2>

        <p>Usuario</p>

        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <p>Contraseña</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <IonButton
          expand="block"
          onClick={iniciarSesion}
        >
          Iniciar sesión
        </IonButton>

        <IonToast
          isOpen={mostrarToast}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          onDidDismiss={() => setMostrarToast(false)}
        />

      </IonContent>

    </IonPage>
  );
};

export default Login;