
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  locationOutline,
  cameraOutline,
  speedometerOutline,
  phonePortraitOutline,
  pulseOutline,
  folderOpenOutline,
  notificationsOutline,
  notificationsCircleOutline,
} from 'ionicons/icons';

import './Home.css';

const features = [
  { title: 'Geolocation', path: '/geolocation', icon: locationOutline },
  { title: 'Camera', path: '/camera', icon: cameraOutline },
  { title: 'Motion', path: '/motion', icon: speedometerOutline },
  { title: 'Device', path: '/device', icon: phonePortraitOutline },
  { title: 'Haptics', path: '/haptics', icon: pulseOutline },
  { title: 'Filesystem', path: '/filesystem', icon: folderOpenOutline },
  {
    title: 'Local Notifications',
    path: '/local-notifications',
    icon: notificationsOutline,
  },
  {
    title: 'Push Notifications',
    path: '/push-notifications',
    icon: notificationsCircleOutline,
  },
];

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge 07</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="home-intro">
          <h1>Capacitor APIs</h1>
          <p>Selecciona una funcionalidad para probarla.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <IonButton
              key={feature.path}
              routerLink={feature.path}
              fill="outline"
              expand="block"
              className="feature-button"
            >
              <IonIcon slot="start" icon={feature.icon} />
              {feature.title}
            </IonButton>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
