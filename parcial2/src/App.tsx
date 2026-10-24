
import { useEffect, useState, useCallback } from 'react';
import {
  IonApp,
  IonLoading,
  setupIonicReact,
} from '@ionic/react';

import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import type { User } from 'firebase/auth';

import { auth } from './firebase/firebaseConfig';

import Login from './pages/Login';
import Register from './pages/Register';
import Missions from './pages/Missions';
import Results from './pages/Results';
import Ranking from './pages/Ranking';

setupIonicReact();

type Page = 'missions' | 'results' | 'ranking';

interface Progress {
  points: number;
  completed: number;
  total: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [page, setPage] = useState<Page>('missions');

  const [progress, setProgress] = useState<Progress>({
    points: 0,
    completed: 0,
    total: 3,
  });

  // Verificar el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setPage('missions');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Mantener estable la función para evitar renderizados repetitivos
  const handleProgressChange = useCallback(
    (nextProgress: Progress) => {
      setProgress(nextProgress);
    },
    []
  );

  // Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    setPage('missions');
    setShowRegister(false);
  };

  if (loading) {
    return (
      <IonApp>
        <IonLoading
          isOpen={true}
          message="Cargando..."
        />
      </IonApp>
    );
  }

  return (
    <IonApp>
      {user ? (
        <>
          {page === 'missions' && (
            <Missions
              email={user.email ?? ''}
              onLogout={handleLogout}
              onProgressChange={handleProgressChange}
              onViewResults={() => setPage('results')}
              onViewRanking={() => setPage('ranking')}
            />
          )}

          {page === 'results' && (
            <Results
              email={user.email ?? ''}
              points={progress.points}
              completed={progress.completed}
              total={progress.total}
              onBack={() => setPage('missions')}
            />
          )}

          {page === 'ranking' && (
            <Ranking
              onBack={() => setPage('missions')}
            />
          )}
        </>
      ) : showRegister ? (
        <Register
          onRegister={() => setShowRegister(false)}
          onBack={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onLogin={() => {}}
          onRegister={() => setShowRegister(true)}
        />
      )}
    </IonApp>
  );
};

export default App;
