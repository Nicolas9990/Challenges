
import { useState } from 'react';
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
  LocalNotifications,
} from '@capacitor/local-notifications';

const LocalNotificationsPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const scheduleNotification = async () => {
    setMessage('');
    setError('');

    try {
      let permission = await LocalNotifications.checkPermissions();

      if (permission.display !== 'granted') {
        permission = await LocalNotifications.requestPermissions();
      }

      if (permission.display !== 'granted') {
        setError('No se concedió el permiso para mostrar notificaciones.');
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Challenge 07',
            body: '¡Tu notificación local está funcionando!',
            schedule: {
              at: new Date(Date.now() + 5000),
            },
          },
        ],
      });

      setMessage(
        'Notificación programada. Espera cinco segundos para recibirla.',
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible programar la notificación.',
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Local Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Notificaciones locales</h2>
        <p>Programa una notificación que aparecerá en cinco segundos.</p>

        <IonButton expand="block" onClick={scheduleNotification}>
          Programar notificación
        </IonButton>

        {message && (
          <IonText color="success">
            <p>{message}</p>
          </IonText>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LocalNotificationsPage;
