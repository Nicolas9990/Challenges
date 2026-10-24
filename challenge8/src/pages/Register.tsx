import { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Register: React.FC = () => {
  const history = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Registro exitoso. Revisa tu correo si la confirmación está activa.')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="Correo"
          labelPlacement="stacked"
          type="email"
          value={email}
          onIonInput={(e) => setEmail(e.detail.value ?? '')}
        />

        <IonInput
          label="Contraseña"
          labelPlacement="stacked"
          type="password"
          value={password}
          onIonInput={(e) => setPassword(e.detail.value ?? '')}
        />

        <IonButton expand="block" onClick={handleRegister}>
          Registrarse
        </IonButton>

        {message && (
          <IonText>
            <p>{message}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          fill="clear"
          onClick={() => history('/login')}
        >
          Ya tengo una cuenta
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Register