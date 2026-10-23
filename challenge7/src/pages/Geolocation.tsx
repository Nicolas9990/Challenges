
import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonBackButton,
  IonButtons,
} from '@ionic/react';

import { Geolocation as CapacitorGeolocation } from '@capacitor/geolocation';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const Geolocation: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const permissions =
        await CapacitorGeolocation.checkPermissions();

      if (
        permissions.location !== 'granted' &&
        permissions.coarseLocation !== 'granted'
      ) {
        const requested =
          await CapacitorGeolocation.requestPermissions();

        if (
          requested.location !== 'granted' &&
          requested.coarseLocation !== 'granted'
        ) {
          throw new Error('No se concedió el permiso de ubicación.');
        }
      }

      const position = await CapacitorGeolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible obtener la ubicación.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Geolocation</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Ubicación actual</h2>
          <p>Consulta la posición GPS de tu dispositivo.</p>
        </IonText>

        <IonButton
          expand="block"
          onClick={getLocation}
          disabled={loading}
        >
          {loading ? (
            <>
              <IonSpinner name="crescent" />
              &nbsp; Obteniendo ubicación...
            </>
          ) : (
            'Obtener ubicación'
          )}
        </IonButton>

        {coordinates && (
          <IonCard>
            <IonCardContent>
              <p>
                <strong>Latitud:</strong> {coordinates.latitude}
              </p>
              <p>
                <strong>Longitud:</strong> {coordinates.longitude}
              </p>
              <p>
                <strong>Precisión:</strong> {coordinates.accuracy} metros
              </p>
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

export default Geolocation;
