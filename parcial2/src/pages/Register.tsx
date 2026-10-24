
import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonTitle,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/react';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';

interface RegisterProps {
  onRegister: () => void;
  onBack: () => void;
}

const Register: React.FC<RegisterProps> = ({
  onRegister,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const register = async () => {
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSaving(true);

    try {
      // Crear la cuenta en Firebase Authentication.
      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = credential.user;

      // Crear el documento del usuario en Firestore.
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email ?? cleanEmail,
        points: 0,
        completed: 0,
        total: 3,
        createdAt: serverTimestamp(),
      });

      // Crear el documento inicial del progreso de misiones.
      await setDoc(
        doc(db, 'users', user.uid, 'progress', 'missions'),
        {
          points: 0,
          completed: 0,
          total: 3,
          missions: [],
        }
      );

      onRegister();
    } catch (err) {
      console.error('Error durante el registro:', err);

      setError(
        'No se pudo completar el registro. Verifica la conexión y las reglas de Firestore.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonTitle className="ion-text-center">
              Crear cuenta
            </IonTitle>

            <IonInput
              label="Correo electrónico"
              labelPlacement="stacked"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value ?? '')}
              placeholder="correo@ejemplo.com"
            />

            <IonInput
              label="Contraseña"
              labelPlacement="stacked"
              type="password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value ?? '')}
              placeholder="Mínimo 6 caracteres"
            />

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              onClick={register}
              disabled={saving}
            >
              {saving ? 'Creando cuenta...' : 'Registrarme'}
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              onClick={onBack}
              disabled={saving}
            >
              Volver al inicio de sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Register;
