
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from '@capacitor/haptics';

const HapticsPage: React.FC = () => {
  const vibrate = async () => {
    try {
      await Haptics.vibrate({ duration: 500 });
    } catch (error) {
      console.error('Error al vibrar:', error);
    }
  };

  const lightImpact = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Error en vibración ligera:', error);
    }
  };

  const heavyImpact = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.error('Error en vibración fuerte:', error);
    }
  };

  const successFeedback = async () => {
    try {
      await Haptics.notification({
        type: NotificationType.Success,
      });
    } catch (error) {
      console.error('Error en vibración de notificación:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Haptics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Vibración del dispositivo</h2>
        <p>Prueba diferentes tipos de respuesta háptica.</p>

        <IonButton expand="block" onClick={vibrate}>
          Vibración de 500 ms
        </IonButton>

        <IonButton expand="block" onClick={lightImpact}>
          Impacto ligero
        </IonButton>

        <IonButton expand="block" onClick={heavyImpact}>
          Impacto fuerte
        </IonButton>

        <IonButton
          expand="block"
          color="success"
          onClick={successFeedback}
        >
          Vibración de éxito
        </IonButton>

        <IonText color="medium">
          <p>
            La respuesta depende del dispositivo y de su soporte para
            vibración háptica.
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default HapticsPage;
    