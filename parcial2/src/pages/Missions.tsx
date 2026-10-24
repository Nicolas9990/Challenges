
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonProgressBar,
    IonText,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';

import {
    Camera,
    CameraResultType,
    CameraSource,
} from '@capacitor/camera';

import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebase/firebaseConfig';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';


interface MissionsProps {
    email: string;
    onLogout: () => void;
    onProgressChange: (progress: {
        points: number;
        completed: number;
        total: number;
    }) => void;
    onViewResults: () => void;
    onViewRanking: () => void;
}


interface Coordinates {
    latitude: number;
    longitude: number;
}

interface MotionEventConstructor {
    requestPermission?: () => Promise<string>;
}

const calculateDistance = (
    start: Coordinates,
    current: Coordinates
): number => {
    const earthRadius = 6371000;

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const lat1 = toRadians(start.latitude);
    const lat2 = toRadians(current.latitude);
    const differenceLat = toRadians(
        current.latitude - start.latitude
    );
    const differenceLon = toRadians(
        current.longitude - start.longitude
    );

    const a =
        Math.sin(differenceLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(differenceLon / 2) ** 2;

    return (
        earthRadius *
        2 *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    );
};

const Missions: React.FC<MissionsProps> = ({
    email,
    onLogout,
    onProgressChange,
    onViewResults,
    onViewRanking,
}) => {
    const [progressLoaded, setProgressLoaded] = useState(false);
    const [missions, setMissions] = useState([
        {
            id: 1,
            title: 'Tomar una fotografía',
            points: 50,
            completed: false,
        },
        {
            id: 2,
            title: 'Desplazarse más de 30 metros',
            points: 50,
            completed: false,
        },
        {
            id: 3,
            title: 'Quedarse quieto durante 10 segundos',
            points: 20,
            completed: false,
        },
    ]);

    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [distance, setDistance] = useState(0);
    const [tracking, setTracking] = useState(false);
    const [movementPassed, setMovementPassed] = useState(false);

    const [quietActive, setQuietActive] = useState(false);
    const [quietSeconds, setQuietSeconds] = useState(0);
    const [sensorAvailable, setSensorAvailable] = useState(true);

    const startCoords = useRef<Coordinates | null>(null);
    const watchId = useRef<string | null>(null);
    const stillStart = useRef<number | null>(null);
    const quietCompleted = useRef(false);

    const completed = missions.filter(
        (mission) => mission.completed
    ).length;

    const points = missions.reduce(
        (total, mission) =>
            total + (mission.completed ? mission.points : 0),
        0
    );

    useEffect(() => {
        onProgressChange({
            points,
            completed,
            total: missions.length,
        });
    }, [points, completed, missions.length, onProgressChange]);

    const completeMission = useCallback((id: number) => {
        setMissions((previous) => {
            const mission = previous.find((item) => item.id === id);

            if (!mission || mission.completed) {
                return previous;
            }

            const updated = previous.map((item) =>
                item.id === id
                    ? { ...item, completed: true }
                    : item
            );

            const remaining = updated.filter(
                (item) => !item.completed
            ).length;

            void notify(
                'Has completado una misión',
                remaining === 1
                    ? 'Te falta 1 misión para completar'
                    : remaining === 0
                        ? '¡Has completado todas las misiones!'
                        : `Te faltan ${remaining} misiones para completar`
            );

            return updated;
        });
    }, []);

    // Detener el seguimiento al salir de la pantalla.
    useEffect(() => {
        return () => {
            if (watchId.current) {
                void Geolocation.clearWatch({
                    id: watchId.current,
                });
            }
        };
    }, []);

    // Misión 1: tomar una fotografía.

    const takePhoto = async () => {
        setError('');

        try {
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt,
                webUseInput: true,
            });

            if (image.webPath) {
                setPhoto(image.webPath);
                completeMission(1);
            } else {
                setError('No se pudo obtener la fotografía.');
            }
        } catch (error) {
            console.error('Error al abrir la cámara:', error);
            setError(
                'No se pudo abrir la cámara. Revisa los permisos del navegador o intenta seleccionar una imagen.'
            );
        }
    };


    // Misión 2: medir el desplazamiento.

    const startTracking = async () => {
        setError('');

        if (watchId.current) {
            return;
        }

        try {
            // 1. Consultar los permisos de ubicación.
            let permission = await Geolocation.checkPermissions();

            // 2. Solicitar permiso si todavía no está concedido.
            if (
                permission.location !== 'granted' &&
                permission.coarseLocation !== 'granted'
            ) {
                permission = await Geolocation.requestPermissions();
            }

            // 3. Verificar que el permiso se haya concedido.
            if (
                permission.location !== 'granted' &&
                permission.coarseLocation !== 'granted'
            ) {
                setTracking(false);
                setError(
                    'Debes autorizar el permiso de ubicación en los ajustes de tu teléfono.'
                );
                return;
            }

            // 4. Obtener la ubicación inicial.
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
            });

            const origin = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            startCoords.current = origin;
            setDistance(0);
            setTracking(true);

            // 5. Seguir la ubicación mientras el usuario se desplaza.
            watchId.current = await Geolocation.watchPosition(
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                },
                (position, watchError) => {
                    if (watchError) {
                        setError(
                            'No se pudo actualizar la ubicación. Revisa que el GPS esté activado y que la aplicación tenga permiso.'
                        );
                        return;
                    }

                    if (!position || !startCoords.current) {
                        return;
                    }

                    const current = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    const meters = calculateDistance(
                        startCoords.current,
                        current
                    );

                    setDistance(meters);

                    if (meters > 30) {
                        completeMission(2);
                    }

                    if (meters >= 50) {
                        setMovementPassed(true);
                    }
                }
            );
        } catch (error) {
            console.error('Error obteniendo la ubicación:', error);
            setTracking(false);

            setError(
                'No se pudo obtener la ubicación. Activa el GPS, revisa los permisos e inténtalo de nuevo.'
            );
        }
    };


    const stopTracking = async () => {
        if (watchId.current) {
            await Geolocation.clearWatch({
                id: watchId.current,
            });

            watchId.current = null;
        }

        setTracking(false);
    };

    // Misión 3: solicitar permiso y activar el sensor.
    const startQuietMission = async () => {
        if (!movementPassed) {
            setError('Primero debes recorrer al menos 50 metros.');
            return;
        }

        if (typeof DeviceMotionEvent === 'undefined') {
            setSensorAvailable(false);
            setError(
                'Este navegador no permite acceder al sensor de movimiento. Prueba en un dispositivo compatible.'
            );
            return;
        }

        setError('');
        setQuietSeconds(0);
        stillStart.current = null;
        quietCompleted.current = false;
        setSensorAvailable(true);

        try {
            const motionEvent =
                DeviceMotionEvent as unknown as MotionEventConstructor;

            if (typeof motionEvent.requestPermission === 'function') {
                const permission = await motionEvent.requestPermission();

                if (permission !== 'granted') {
                    setError(
                        'Debes permitir el acceso al sensor de movimiento.'
                    );
                    return;
                }
            }

            setQuietActive(true);
        } catch (error) {
            console.error(error);
            setError(
                'No se pudo activar el sensor. Revisa los permisos del dispositivo.'
            );
        }
    };

    // Comprobar el movimiento mientras la misión está activa.
    const handleMotion = useCallback(
        (event: DeviceMotionEvent) => {
            const acceleration = event.acceleration;

            if (
                !acceleration ||
                acceleration.x === null ||
                acceleration.y === null ||
                acceleration.z === null
            ) {
                setSensorAvailable(false);
                setQuietActive(false);
                setError(
                    'El dispositivo no proporciona datos de aceleración válidos.'
                );
                return;
            }

            const x = acceleration.x;
            const y = acceleration.y;
            const z = acceleration.z;

            const movement = Math.sqrt(
                x * x + y * y + z * z
            );

            const now = Date.now();

            // Si el dispositivo se mueve, reiniciar el contador.
            if (movement > 0.8) {
                stillStart.current = null;
                setQuietSeconds(0);
                return;
            }

            if (stillStart.current === null) {
                stillStart.current = now;
            }

            const seconds = Math.floor(
                (now - stillStart.current) / 1000
            );

            setQuietSeconds(seconds);

            if (seconds >= 10 && !quietCompleted.current) {
                quietCompleted.current = true;
                setQuietActive(false);
                completeMission(3);

                void Haptics.impact({
                    style: ImpactStyle.Medium,
                }).catch(() => {
                    if (typeof navigator.vibrate === 'function') {
                        navigator.vibrate(300);
                    }
                });
            }
        },
        [completeMission]
    );

    const notify = async (title: string, body: string) => {
        try {
            if (Capacitor.getPlatform() === 'web') {
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission();

                    if (permission === 'granted') {
                        new Notification(title, { body });
                    }
                }

                return;
            }

            const permission =
                await LocalNotifications.requestPermissions();

            if (permission.display !== 'granted') {
                return;
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: Math.floor(Date.now() % 2147483647),
                        title,
                        body,
                        schedule: { at: new Date(Date.now() + 1000) },
                    },
                ],
            });
        } catch (error) {
            console.error('No se pudo mostrar la notificación:', error);
        }
    };

    useEffect(() => {
        if (!quietActive) {
            return;
        }

        let receivedMotion = false;

        const checkSensor = () => {
            if (!receivedMotion) {
                setSensorAvailable(false);
            }
        };

        const listener = (event: DeviceMotionEvent) => {
            receivedMotion = true;
            handleMotion(event);
        };

        window.addEventListener('devicemotion', listener);

        const timeout = window.setTimeout(checkSensor, 3000);

        return () => {
            window.removeEventListener('devicemotion', listener);
            window.clearTimeout(timeout);
        };
    }, [quietActive, handleMotion]);


    useEffect(() => {
        let active = true;

        const loadProgress = async () => {
            const uid = auth.currentUser?.uid;

            if (!uid) {
                setProgressLoaded(true);
                return;
            }

            const storageKey = `missions-progress-${uid}`;

            try {
                // Primero recuperar el progreso local.
                const localData = localStorage.getItem(storageKey);

                if (localData) {
                    const savedMissions = JSON.parse(localData);

                    if (Array.isArray(savedMissions) && active) {
                        setMissions((current) =>
                            current.map((mission) => {
                                const saved = savedMissions.find(
                                    (item: { id: number }) => item.id === mission.id
                                );

                                return saved
                                    ? {
                                        ...mission,
                                        completed: Boolean(saved.completed),
                                    }
                                    : mission;
                            })
                        );
                    }
                }

                // Después consultar Firebase.
                const progressRef = doc(
                    db,
                    'users',
                    uid,
                    'progress',
                    'missions'
                );

                const snapshot = await getDoc(progressRef);

                if (snapshot.exists() && active) {
                    const data = snapshot.data();

                    if (Array.isArray(data.missions)) {
                        setMissions((current) =>
                            current.map((mission) => {
                                const saved = data.missions.find(
                                    (item: { id: number }) => item.id === mission.id
                                );

                                return saved
                                    ? {
                                        ...mission,
                                        completed: Boolean(saved.completed),
                                    }
                                    : mission;
                            })
                        );

                        localStorage.setItem(
                            storageKey,
                            JSON.stringify(data.missions)
                        );
                    }
                }
            } catch (error) {
                console.error('Error recuperando el progreso:', error);
                setError(
                    'No se pudo recuperar el progreso de Firebase. Revisa la conexión y los permisos.'
                );
            } finally {
                if (active) {
                    setProgressLoaded(true);
                }
            }
        };

        void loadProgress();

        return () => {
            active = false;
        };
    }, []);


    useEffect(() => {
        if (!progressLoaded) return;

        const uid = auth.currentUser?.uid;

        if (!uid) return;

        const storageKey = `missions-progress-${uid}`;

        const savedMissions = missions.map((mission) => ({
            id: mission.id,
            title: mission.title,
            points: mission.points,
            completed: mission.completed,
        }));

        const totalPoints = missions.reduce(
            (total, mission) =>
                total + (mission.completed ? mission.points : 0),
            0
        );

        const completedCount = missions.filter(
            (mission) => mission.completed
        ).length;

        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(savedMissions)
            );
        } catch (error) {
            console.error('Error guardando el progreso local:', error);
        }

        const progressRef = doc(
            db,
            'users',
            uid,
            'progress',
            'missions'
        );

        void setDoc(
            progressRef,
            {
                missions: savedMissions,
                points: totalPoints,
                completed: completedCount,
                totalMissions: missions.length,
                updatedAt: new Date().toISOString(),
            },
            { merge: true }
        ).catch((error) => {
            console.error('Error guardando el progreso en Firebase:', error);
            setError(
                'El progreso está guardado localmente, pero no se pudo sincronizar con Firebase.'
            );
        });
    }, [missions, progressLoaded]);



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Misiones App</IonTitle>

                    <IonButton slot="end" onClick={onLogout}>
                        Salir
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div className="ion-text-center">
                    <h2>¡Bienvenido!</h2>
                    <p>{email}</p>
                </div>

                <div className="ion-padding">
                    <IonButton
                        expand="block"
                        onClick={onViewResults}
                    >
                        Ver resultados
                    </IonButton>

                    <IonButton
                        expand="block"
                        fill="outline"
                        onClick={onViewRanking}
                    >
                        Ver ranking
                    </IonButton>
                </div>

                <IonCard>
                    <IonCardContent>
                        <h2>Puntos: {points}</h2>

                        <p>
                            Misiones completadas: {completed} de {missions.length}
                        </p>

                        <IonProgressBar
                            value={completed / missions.length}
                        />
                    </IonCardContent>
                </IonCard>

                <IonGrid>
                    <IonRow>
                        {missions.map((mission) => (
                            <IonCol
                                key={mission.id}
                                size="12"
                                sizeMd="6"
                                sizeLg="4"
                            >
                                <IonCard>
                                    <IonCardContent>
                                        <h2>{mission.title}</h2>
                                        <p>Puntos: {mission.points}</p>

                                        {mission.id === 1 && photo && (
                                            <IonImg
                                                src={photo}
                                                alt="Fotografía de la misión"
                                            />
                                        )}

                                        {mission.id === 1 && !mission.completed && (
                                            <IonButton
                                                expand="block"
                                                onClick={takePhoto}
                                            >
                                                Tomar fotografía
                                            </IonButton>
                                        )}

                                        {mission.id === 2 && (
                                            <>
                                                <p>
                                                    Distancia desde el inicio:{' '}
                                                    {distance.toFixed(1)} metros
                                                </p>

                                                {!mission.completed && (
                                                    <IonButton
                                                        expand="block"
                                                        onClick={startTracking}
                                                        disabled={tracking}
                                                    >
                                                        Iniciar recorrido
                                                    </IonButton>
                                                )}

                                                {tracking && (
                                                    <IonButton
                                                        expand="block"
                                                        fill="outline"
                                                        onClick={stopTracking}
                                                    >
                                                        Detener seguimiento
                                                    </IonButton>
                                                )}
                                            </>
                                        )}

                                        {mission.id === 3 && (
                                            <>
                                                <p>
                                                    {movementPassed
                                                        ? 'Has recorrido 50 metros. Ya puedes iniciar esta misión.'
                                                        : 'Recorre al menos 50 metros para habilitarla.'}
                                                </p>

                                                {!mission.completed && (
                                                    <>
                                                        <IonButton
                                                            expand="block"
                                                            disabled={
                                                                !movementPassed || quietActive
                                                            }
                                                            onClick={startQuietMission}
                                                        >
                                                            Iniciar misión de quietud
                                                        </IonButton>

                                                        {quietActive && (
                                                            <p>
                                                                Tiempo quieto: {quietSeconds} de 10 segundos
                                                            </p>
                                                        )}

                                                        {!sensorAvailable && (
                                                            <IonText color="danger">
                                                                <p>
                                                                    No se detectan datos del sensor. Prueba con un dispositivo compatible.
                                                                </p>
                                                            </IonText>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {mission.completed && (
                                            <IonText color="success">
                                                <p>¡Misión completada!</p>
                                            </IonText>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                {error && (
                    <IonText color="danger">
                        <p>{error}</p>
                    </IonText>
                )}

                {completed === missions.length && (
                    <IonCard>
                        <IonCardContent>
                            <IonText color="success">
                                <h2>¡Completaste todas las misiones!</h2>
                            </IonText>

                            <p>Puntuación final: {points}</p>
                        </IonCardContent>
                    </IonCard>
                )}
            </IonContent>
        </IonPage>
    );
};



export default Missions;
