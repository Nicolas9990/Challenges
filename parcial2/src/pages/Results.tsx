
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonProgressBar,
  IonButton,
} from '@ionic/react';

interface ResultsProps {
  email: string;
  points: number;
  completed: number;
  total: number;
  onBack: () => void;
}

const Results: React.FC<ResultsProps> = ({
  email,
  points,
  completed,
  total,
  onBack,
}) => {
  const allCompleted = completed === total;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Resultados</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Resultados de {email}</h2>
            <h1>{points} puntos</h1>

            <p>
              Misiones completadas: {completed} de {total}
            </p>

            <IonProgressBar
              value={total > 0 ? completed / total : 0}
            />

            <h3>
              Estado: {allCompleted ? 'Completado' : 'En progreso'}
            </h3>
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" onClick={onBack}>
          Volver a las misiones
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Results;
