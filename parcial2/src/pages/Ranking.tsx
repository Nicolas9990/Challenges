
import { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonButton,
} from '@ionic/react';

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

import { db, auth } from '../firebase/firebaseConfig';

interface RankingUser {
  id: string;
  email: string;
  points: number;
}

interface RankingProps {
  onBack: () => void;
}

const Ranking: React.FC<RankingProps> = ({ onBack }) => {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true);
        setError('');

        // Obtener los documentos registrados en la colección users.
        const snapshot = await getDocs(collection(db, 'users'));

        const rankingUsers = await Promise.all(
          snapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();

            // Leer el progreso guardado por las misiones.
            const progressRef = doc(
              db,
              'users',
              userDoc.id,
              'progress',
              'missions'
            );

            const progressSnapshot = await getDoc(progressRef);
            const progressData = progressSnapshot.exists()
              ? progressSnapshot.data()
              : {};

            const rootPoints =
              typeof userData.points === 'number'
                ? userData.points
                : 0;

            const progressPoints =
              typeof progressData.points === 'number'
                ? progressData.points
                : rootPoints;

            return {
              id: userDoc.id,
              email:
                typeof userData.email === 'string'
                  ? userData.email
                  : 'Usuario',
              points: progressPoints,
            };
          })
        );

        // Ordenar por puntos, de mayor a menor.
        rankingUsers.sort((a, b) => b.points - a.points);

        // Mostrar el top 5 y asegurar que aparezca el usuario actual.
        const topFive = rankingUsers.slice(0, 5);
        const currentUid = auth.currentUser?.uid;

        const currentUser = rankingUsers.find(
          (user) => user.id === currentUid
        );

        if (
          currentUser &&
          !topFive.some((user) => user.id === currentUser.id)
        ) {
          topFive.push(currentUser);
        }

        setUsers(topFive);
      } catch (err) {
        console.error('Error cargando ranking:', err);
        setError(
          'No se pudo cargar el ranking. Revisa la consola y las reglas de Firestore.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRanking();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ranking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Mejores puntuaciones</h2>

            {loading && <IonSpinner />}

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            {!loading && !error && users.length === 0 && (
              <p>
                No se encontraron usuarios en Firestore.
              </p>
            )}

            {!loading && !error && (
              <IonList>
                {users.map((user, index) => (
                  <IonItem key={user.id}>
                    <IonLabel>
                      <h2>
                        {index + 1}. {user.email}
                        {user.id === auth.currentUser?.uid
                          ? ' (Tú)'
                          : ''}
                      </h2>
                      <p>{user.points} puntos</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" onClick={onBack}>
          Volver a las misiones
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Ranking;
