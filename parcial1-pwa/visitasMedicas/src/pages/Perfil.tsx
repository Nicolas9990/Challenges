import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton
} from "@ionic/react";

interface PerfilProps {
  cerrarSesion: () => void;
}

const Perfil: React.FC<PerfilProps> = ({ cerrarSesion }) => {

  const salir = () => {
    localStorage.removeItem("sesion");
    cerrarSesion();
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Perfil del doctor</h2>

        <p><strong>Nombre:</strong> Doctor</p>

        <p><strong>Usuario:</strong> doctor</p>

        <p><strong>Rol:</strong> Médico</p>

        <br />

        <IonButton
          expand="block"
          onClick={salir}
        >
          Cerrar sesión
        </IonButton>

      </IonContent>

    </IonPage>
  );
};

export default Perfil;