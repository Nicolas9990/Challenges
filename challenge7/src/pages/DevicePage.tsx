
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
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { Device } from '@capacitor/device';

interface DeviceInfo {
  model: string;
  manufacturer: string;
  platform: string;
  operatingSystem: string;
  osVersion: string;
  webViewVersion: string;
  isVirtual: boolean;
}

const DevicePage: React.FC = () => {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDeviceInfo = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await Device.getInfo();
      setInfo({
        model: result.model,
        manufacturer: result.manufacturer,
        platform: result.platform,
        operatingSystem: result.operatingSystem,
        osVersion: result.osVersion,
        webViewVersion: result.webViewVersion,
        isVirtual: result.isVirtual,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo obtener la información del dispositivo.',
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
          <IonTitle>Device</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Información del dispositivo</h2>
        <p>Consulta los datos del dispositivo donde se ejecuta la aplicación.</p>

        <IonButton
          expand="block"
          onClick={getDeviceInfo}
          disabled={loading}
        >
          {loading ? (
            <>
              <IonSpinner name="crescent" />
              &nbsp; Consultando...
            </>
          ) : (
            'Consultar dispositivo'
          )}
        </IonButton>

        {info && (
          <IonCard>
            <IonCardContent>
              <p><strong>Modelo:</strong> {info.model}</p>
              <p><strong>Fabricante:</strong> {info.manufacturer}</p>
              <p><strong>Plataforma:</strong> {info.platform}</p>
              <p><strong>Sistema operativo:</strong> {info.operatingSystem}</p>
              <p><strong>Versión del SO:</strong> {info.osVersion}</p>
              <p><strong>Versión WebView:</strong> {info.webViewVersion}</p>
              <p><strong>Dispositivo virtual:</strong> {info.isVirtual ? 'Sí' : 'No'}</p>
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

export default DevicePage;
