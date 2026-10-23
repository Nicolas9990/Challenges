
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
  IonTextarea,
} from '@ionic/react';

import {
  Directory,
  Encoding,
  Filesystem,
} from '@capacitor/filesystem';

const FILE_NAME = 'challenge7-notas.txt';

const FilesystemPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const saveFile = async () => {
    setError('');
    setMessage('');

    try {
      await Filesystem.writeFile({
        path: FILE_NAME,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      setMessage('Archivo guardado correctamente.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar el archivo.',
      );
    }
  };

  const readFile = async () => {
    setError('');
    setMessage('');

    try {
      const result = await Filesystem.readFile({
        path: FILE_NAME,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      setContent(result.data as string);
      setMessage('Archivo leído correctamente.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo leer el archivo.',
      );
    }
  };

  const deleteFile = async () => {
    setError('');
    setMessage('');

    try {
      await Filesystem.deleteFile({
        path: FILE_NAME,
        directory: Directory.Documents,
      });

      setContent('');
      setMessage('Archivo eliminado correctamente.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el archivo.',
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
          <IonTitle>Filesystem</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Gestión de archivos</h2>
        <p>Escribe una nota y guárdala en el dispositivo.</p>

        <IonTextarea
          label="Contenido del archivo"
          labelPlacement="stacked"
          fill="outline"
          autoGrow
          placeholder="Escribe tu texto aquí..."
          value={content}
          onIonInput={(event) => setContent(event.detail.value ?? '')}
        />

        <IonButton expand="block" onClick={saveFile}>
          Guardar archivo
        </IonButton>

        <IonButton expand="block" fill="outline" onClick={readFile}>
          Leer archivo
        </IonButton>

        <IonButton expand="block" color="danger" onClick={deleteFile}>
          Eliminar archivo
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

export default FilesystemPage;
