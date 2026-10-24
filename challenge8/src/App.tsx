
import { Navigate, Route } from 'react-router-dom'
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Task'

import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
