
import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonImg,
  IonText,
  IonSpinner,
} from '@ionic/react';

import {
  Camera,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';

const CameraPage: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const takePhoto = async (source: CameraSource) => {
    setLoading(true);
    setError('');

    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });

      setPhoto(image.dataUrl ?? null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible obtener la imagen.',
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
          <IonTitle>Camera</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Cámara y galería</h2>
        <p>Toma una fotografía o selecciona una imagen.</p>

        <IonButton
          expand="block"
          onClick={() => takePhoto(CameraSource.Camera)}
          disabled={loading}
        >
          Tomar fotografía
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          onClick={() => takePhoto(CameraSource.Photos)}
          disabled={loading}
        >
          Seleccionar de la galería
        </IonButton>

        {loading && <IonSpinner name="crescent" />}

        {photo && (
          <IonCard>
            <IonImg src={photo} alt="Imagen seleccionada" />
            <IonCardContent>
              <IonText color="success">
                Imagen cargada correctamente.
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

export default CameraPage;
