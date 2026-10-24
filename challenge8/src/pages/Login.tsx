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

const Login: React.FC = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async () => {
        setMessage('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            return
        }

        navigate('/tasks')
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Iniciar sesión</IonTitle>
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

                <IonButton expand="block" onClick={handleLogin}>
                    Iniciar sesión
                </IonButton>

                {message && (
                    <IonText color="danger">
                        <p>{message}</p>
                    </IonText>
                )}

                <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => navigate('/register')}
                >
                    Crear una cuenta
                </IonButton>
            </IonContent>
        </IonPage>
    )
}

export default Login