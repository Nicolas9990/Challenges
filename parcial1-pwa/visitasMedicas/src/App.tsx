import { useState } from 'react';
import { Navigate, Route } from 'react-router-dom';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import { ellipse, square, triangle } from 'ionicons/icons';

import Login from './pages/Login';
import Tab1 from './pages/Visitas';
import Tab2 from './pages/Pacientes';
import Tab3 from './pages/Perfil';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark Mode */
// import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import DetalleVisita from './pages/DetalleVisita';

setupIonicReact();

const App: React.FC = () => {

  const [sesion, setSesion] = useState(
    localStorage.getItem('sesion') === 'true'
  );

  const iniciarSesion = () => {
    setSesion(true);
  };

  const cerrarSesion = () => {
    setSesion(false);
  };

  if (!sesion) {
    return (
      <IonApp>
        <Login onLogin={iniciarSesion} />
      </IonApp>
    );
  }

  return (
    <IonApp>

      <IonReactRouter>

        <IonTabs>

          <IonRouterOutlet>

            <Route path="/Visitas" element={<Tab1 />} />

            <Route path="/Pacientes" element={<Tab2 />} />

            <Route
              path="/Perfil"
              element={<Tab3 cerrarSesion={cerrarSesion} />}
            />

            <Route
              path="/"
              element={<Navigate to="/Visitas" replace />}
            />

          </IonRouterOutlet>

          <IonTabBar slot="bottom">

            <IonTabButton tab="tab1" href="/Visitas">
              <IonIcon
                aria-hidden="true"
                icon={triangle}
              />
              <IonLabel>Visitas</IonLabel>
            </IonTabButton>

            <IonTabButton tab="tab2" href="/Pacientes">
              <IonIcon
                aria-hidden="true"
                icon={ellipse}
              />
              <IonLabel>Pacientes</IonLabel>
            </IonTabButton>

            <IonTabButton tab="tab3" href="/Perfil">
              <IonIcon
                aria-hidden="true"
                icon={square}
              />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>

          </IonTabBar>

        </IonTabs>

      </IonReactRouter>

    </IonApp>
  );
};

export default App;