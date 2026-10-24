
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

interface LoginProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onLogin();
    } catch (error) {
      console.error(error);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonTitle className="ion-text-center">
              Misiones App
            </IonTitle>

            <p>Inicia sesión para completar tus misiones.</p>

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
              placeholder="Tu contraseña"
            />

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={login}>
              Iniciar sesión
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              onClick={onRegister}
            >
              Crear cuenta
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
