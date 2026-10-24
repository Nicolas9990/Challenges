
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  IonText,
  IonSpinner,
} from '@ionic/react'

import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar';

interface Task {
  id: number
  titulo: string
  completada: boolean
  created_at: string
}

const Tasks: React.FC = () => {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<Task[]>([])
  const [titulo, setTitulo] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [message, setMessage] = useState('')

  // READ: consultar las tareas del usuario autenticado
  const loadTasks = useCallback(async () => {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      setTasks([])
      setAuthenticated(false)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('tareas')
      .select('id, titulo, completada, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(`Error al cargar tareas: ${error.message}`)
      setLoading(false)
      return
    }

    setTasks((data ?? []) as Task[])
    setLoading(false)
  }, [])

  // Comprobar sesión y cargar las tareas iniciales
  useEffect(() => {
    let active = true

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!active) return

      if (error || !data.session) {
        setAuthenticated(false)
        setTasks([])
        setLoading(false)
        return
      }

      setAuthenticated(true)
      await loadTasks()
    }

    void checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return

      if (!session) {
        setAuthenticated(false)
        setTasks([])
        setLoading(false)
      } else {
        setAuthenticated(true)
        void loadTasks()
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loadTasks])

  // CREATE: agregar una tarea
  const addTask = async () => {
    const texto = titulo.trim()

    if (!texto || saving) return

    setSaving(true)
    setMessage('')

    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      setAuthenticated(false)
      setMessage('Tu sesión ha expirado. Inicia sesión nuevamente.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('tareas')
      .insert({
        titulo: texto,
        user_id: sessionData.session.user.id,
      })

    if (error) {
      setMessage(`Error al crear la tarea: ${error.message}`)
    } else {
      setTitulo('')
      setMessage('Tarea creada correctamente.')
      await loadTasks()
    }

    setSaving(false)
  }

  // UPDATE: cambiar el estado de una tarea
  const toggleTask = async (task: Task) => {
    const nuevoEstado = !task.completada

    const { error } = await supabase
      .from('tareas')
      .update({ completada: nuevoEstado })
      .eq('id', task.id)

    if (error) {
      setMessage(`Error al actualizar: ${error.message}`)
      return
    }

    setTasks((actuales) =>
      actuales.map((item) =>
        item.id === task.id
          ? { ...item, completada: nuevoEstado }
          : item
      )
    )

    setMessage('Tarea actualizada correctamente.')
  }

  // DELETE: eliminar una tarea
  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage(`Error al eliminar: ${error.message}`)
      return
    }

    setTasks((actuales) =>
      actuales.filter((task) => task.id !== id)
    )

    setMessage('Tarea eliminada correctamente.')
  }

  // REALTIME: escuchar cambios en la tabla tareas
  useEffect(() => {
    if (!authenticated) return

    const channel = supabase
      .channel('tareas-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tareas',
        },
        () => {
          void loadTasks()
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          setMessage('No se pudo conectar con Realtime.')
        }
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [authenticated, loadTasks])

  // Cerrar sesión
  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setMessage(`Error al cerrar sesión: ${error.message}`)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis tareas</IonTitle>

          <IonButton
            slot="end"
            fill="clear"
            onClick={logout}
          >
            Cerrar sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <Avatar />
        {!authenticated ? (
          <div className="ion-text-center ion-padding">
            <IonText>
              <p>Debes iniciar sesión para administrar tus tareas.</p>
            </IonText>

            <IonButton onClick={() => navigate('/login')}>
              Ir al login
            </IonButton>
          </div>
        ) : (
          <>
            <h2>Agregar una tarea</h2>

            <IonItem>
              <IonInput
                label="Título"
                labelPlacement="stacked"
                placeholder="Ej. Estudiar para el examen"
                value={titulo}
                onIonInput={(event) =>
                  setTitulo(String(event.detail.value ?? ''))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void addTask()
                  }
                }}
              />
            </IonItem>

            <IonButton
              expand="block"
              onClick={() => void addTask()}
              disabled={saving || !titulo.trim()}
            >
              {saving ? 'Guardando...' : 'Agregar tarea'}
            </IonButton>

            <h2>Lista de tareas</h2>

            {loading ? (
              <div className="ion-text-center ion-padding">
                <IonSpinner />
                <p>Cargando tareas...</p>
              </div>
            ) : tasks.length === 0 ? (
              <IonText color="medium">
                <p>No tienes tareas todavía. ¡Agrega la primera!</p>
              </IonText>
            ) : (
              <IonList>
                {tasks.map((task) => (
                  <IonItem key={task.id}>
                    <IonCheckbox
                      slot="start"
                      checked={task.completada}
                      onIonChange={() => void toggleTask(task)}
                      aria-label={`Completar ${task.titulo}`}
                    />

                    <IonLabel>
                      <h2
                        style={{
                          textDecoration: task.completada
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        {task.titulo}
                      </h2>

                      <p>
                        {task.completada
                          ? 'Completada'
                          : 'Pendiente'}
                      </p>
                    </IonLabel>

                    <IonButton
                      slot="end"
                      color="danger"
                      fill="outline"
                      onClick={() => void deleteTask(task.id)}
                      aria-label={`Eliminar ${task.titulo}`}
                    >
                      Eliminar
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            )}

            {message && (
              <IonText
                color={
                  message.startsWith('Error') ||
                  message.startsWith('No se pudo')
                    ? 'danger'
                    : 'success'
                }
              >
                <p>{message}</p>
              </IonText>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Tasks
