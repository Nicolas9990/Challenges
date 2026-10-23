
import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import Geolocation from './pages/Geolocation';
import CameraPage from './pages/CameraPage';
import Motion from './pages/Motion';
import DevicePage from './pages/DevicePage';
import HapticsPage from './pages/HapticsPage';
import FilesystemPage from './pages/Filesystem';
import LocalNotificationsPage from './pages/LocalNotifications';
import PushNotificationsPage from './pages/PushNotifications';

/* Estilos principales de Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/geolocation" element={<Geolocation />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/motion" element={<Motion />} />
        <Route path="/device" element={<DevicePage />} />
        <Route path="/haptics" element={<HapticsPage />} />
        <Route path="/filesystem" element={<FilesystemPage />} />
        <Route path="/local-notifications" element={<LocalNotificationsPage />} />
        <Route path="/push-notifications" element={<PushNotificationsPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />  
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
