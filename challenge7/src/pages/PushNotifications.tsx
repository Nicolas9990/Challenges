
import { useEffect, useState } from 'react';
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
  PushNotifications as Push,
  type Token,
  type PushNotificationSchema,
  type ActionPerformed,
} from '@capacitor/push-notifications';

const PushNotificationsPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const listeners: Array<{ remove: () => Promise<void> }> = [];

    const initialize = async () => {
      try {
        listeners.push(
          await Push.addListener('registration', (result: Token) => {
            if (active) {
              setToken(result.value);
              setMessage('Dispositivo registrado para notificaciones push.');
            }
          }),
        );

        listeners.push(
          await Push.addListener('registrationError', (err) => {
            if (active) {
              setError(`Error de registro: ${JSON.stringify(err)}`);
            }
          }),
        );

        listeners.push(
          await Push.addListener(
            'pushNotificationReceived',
            (notification: PushNotificationSchema) => {
              if (active) {
                setMessage(
                  `Notificación recibida: ${notification.title ?? ''} ${
                    notification.body ?? ''
                  }`,
                );
              }
            },
          ),
        );

        listeners.push(
          await Push.addListener(
            'pushNotificationActionPerformed',
            (action: ActionPerformed) => {
              if (active) {
                setMessage(
                  `Abriste la notificación: ${
                    action.notification.title ?? 'Sin título'
                  }`,
                );
              }
            },
          ),
        );
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron configurar los eventos.',
          );
        }
      }
    };

    void initialize();

    return () => {
      active = false;
      void Promise.all(listeners.map((listener) => listener.remove()));
    };
  }, []);

  const registerDevice = async () => {
    setError('');
    setMessage('');

    try {
      const permission = await Push.checkPermissions();
      const result =
        permission.receive === 'granted'
          ? permission
          : await Push.requestPermissions();

      if (result.receive !== 'granted') {
        setError('No se concedió el permiso para notificaciones.');
        return;
      }

      await Push.register();
      setMessage('Solicitando registro del dispositivo...');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible registrar el dispositivo.',
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
          <IonTitle>Push Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Notificaciones push</h2>
        <p>
          Registra este dispositivo para recibir mensajes enviados mediante
          Firebase Cloud Messaging.
        </p>

        <IonButton expand="block" onClick={registerDevice}>
          Registrar dispositivo
        </IonButton>

        {token && (
          <IonText>
            <p><strong>Token del dispositivo:</strong></p>
            <p style={{ overflowWrap: 'anywhere' }}>{token}</p>
          </IonText>
        )}

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

export default PushNotificationsPage;
