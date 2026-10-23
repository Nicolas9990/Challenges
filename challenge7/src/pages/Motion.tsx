
import { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { Motion as CapacitorMotion } from '@capacitor/motion';

const Motion: React.FC = () => {
  const [data, setData] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);

  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const [stopMotion, setStopMotion] = useState<(() => Promise<void>) | null>(
    null,
  );

  const startMotion = async () => {
    setError('');

    try {
      if (stopMotion) {
        await stopMotion();
      }

      const listener = await CapacitorMotion.addListener(
        'accel',
        (event) => {
          setData({
            x: event.accelerationIncludingGravity?.x ?? 0,
            y: event.accelerationIncludingGravity?.y ?? 0,
            z: event.accelerationIncludingGravity?.z ?? 0,
          });
        },
      );

      setStopMotion(() => listener.remove);
      setListening(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible acceder al sensor de movimiento.',
      );
    }
  };

  const stopListening = async () => {
    if (stopMotion) {
      await stopMotion();
      setStopMotion(null);
    }

    setListening(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Motion</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Sensor de movimiento</h2>
        <p>Mueve tu dispositivo para observar los cambios en los ejes X, Y y Z.</p>

        <IonButton
          expand="block"
          onClick={startMotion}
          disabled={listening}
        >
          Iniciar sensor
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          onClick={stopListening}
          disabled={!listening}
        >
          Detener sensor
        </IonButton>

        {data && (
          <IonCard>
            <IonCardContent>
              <IonText>
                <p><strong>Eje X:</strong> {data.x.toFixed(2)} m/s²</p>
                <p><strong>Eje Y:</strong> {data.y.toFixed(2)} m/s²</p>
                <p><strong>Eje Z:</strong> {data.z.toFixed(2)} m/s²</p>
              </IonText>
            </IonCardContent>
          </IonCard>
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

export default Motion;
