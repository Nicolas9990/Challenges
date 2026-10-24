import { useEffect, useRef, useState } from 'react';
import {
  IonAvatar,
  IonButton,
  IonImg,
  IonText,
  IonSpinner,
} from '@ionic/react';
import {
  Camera,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../lib/supabase';

const Avatar: React.FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // Cargar avatar existente
  // --------------------------------------------------
  const loadAvatar = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setAvatarUrl(null);
      return;
    }

    const filePath = `${user.id}/avatar.jpg`;

    // Primero comprobamos si existe
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list(user.id);

    if (listError) {
      console.error('Error buscando avatar:', listError);
      setAvatarUrl(null);
      return;
    }

    const avatarExists = files?.some(
      (file) => file.name === 'avatar.jpg'
    );

    if (!avatarExists) {
      setAvatarUrl(null);
      return;
    }

    // Crear URL temporal
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error('Error creando URL:', error);
      setAvatarUrl(null);
      return;
    }

    setAvatarUrl(data.signedUrl);
  };

  useEffect(() => {
    void loadAvatar();
  }, []);

  // --------------------------------------------------
  // Subir imagen a Supabase
  // --------------------------------------------------
  const uploadAvatar = async (blob: Blob) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setMessage('Debes iniciar sesión primero.');
      return;
    }

    const filePath = `${user.id}/avatar.jpg`;

    console.log('Subiendo avatar:', filePath);

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Error subiendo avatar:', error);
      setMessage(`Error al subir la foto: ${error.message}`);
      return;
    }

    console.log('Avatar subido correctamente');

    await loadAvatar();

    setMessage('Foto de perfil actualizada correctamente.');
  };

  // --------------------------------------------------
  // Android: cámara o galería
  // --------------------------------------------------
  const selectPhotoAndroid = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      if (!photo.base64String) {
        setMessage('No se obtuvo ninguna imagen.');
        return;
      }

      const byteCharacters = atob(photo.base64String);
      const byteArray = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArray], {
        type: 'image/jpeg',
      });

      await uploadAvatar(blob);
    } catch (error) {
      console.error('Error con la cámara:', error);
      setMessage('No se pudo abrir la cámara o galería.');
    }
  };

  // --------------------------------------------------
  // PC: seleccionar archivo
  // --------------------------------------------------
  const selectPhotoPC = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      // Comprobar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setMessage('Selecciona un archivo de imagen.');
        return;
      }

      await uploadAvatar(file);
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      setMessage('No se pudo subir la imagen.');
    } finally {
      setLoading(false);

      // Permite seleccionar nuevamente el mismo archivo
      event.target.value = '';
    }
  };

  // --------------------------------------------------
  // Botón principal
  // --------------------------------------------------
  const changeAvatar = async () => {
    setMessage('');

    console.log('Botón Cambiar foto presionado');

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) {
        setMessage('Debes iniciar sesión primero.');
        return;
      }

      setLoading(true);

      // Android / iOS
      if (Capacitor.isNativePlatform()) {
        await selectPhotoAndroid();
      } else {
        // Navegador / PC
        selectPhotoPC();
      }
    } catch (error) {
      console.error('Error seleccionando foto:', error);
      setMessage('No se pudo seleccionar la foto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '16px',
      }}
    >
      <IonAvatar
        style={{
          margin: '0 auto 12px',
          width: '110px',
          height: '110px',
        }}
      >
        {avatarUrl ? (
          <IonImg
            src={avatarUrl}
            alt="Foto de perfil"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ddd',
              fontSize: '40px',
            }}
          >
            👤
          </div>
        )}
      </IonAvatar>

      <IonButton
        onClick={changeAvatar}
        disabled={loading}
      >
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          'Cambiar foto de perfil'
        )}
      </IonButton>

      {/* Input utilizado únicamente en PC/navegador */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {message && (
        <IonText
          color={
            message.includes('correctamente')
              ? 'success'
              : 'danger'
          }
        >
          <p>{message}</p>
        </IonText>
      )}
    </div>
  );
};

export default Avatar;