import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton
} from "@ionic/react";

import { useState } from "react";

const Visitas: React.FC = () => {

  const visitasIniciales = [
    {
      paciente: "Carlos Pérez",
      hora: "09:00 AM",
      estado: "pendiente"
    },
    {
      paciente: "María Gómez",
      hora: "10:30 AM",
      estado: "en_camino"
    },
    {
      paciente: "Juan Rodríguez",
      hora: "02:00 PM",
      estado: "finalizada"
    }
  ];

  const [visitas, setVisitas] = useState(() => {

    const visitasGuardadas = localStorage.getItem("visitas");

    if (visitasGuardadas) {
      return JSON.parse(visitasGuardadas);
    }

    return visitasIniciales;
  });

  const [visitaSeleccionada, setVisitaSeleccionada] = useState<any>(null);

  const cambiarEstado = () => {

    let nuevoEstado = visitaSeleccionada.estado;

    if (visitaSeleccionada.estado === "pendiente") {
      nuevoEstado = "en_camino";
    } 
    else if (visitaSeleccionada.estado === "en_camino") {
      nuevoEstado = "finalizada";
    }

    const visitasActualizadas = visitas.map((visita: any) => {

      if (visita.paciente === visitaSeleccionada.paciente) {

        return {
          ...visita,
          estado: nuevoEstado
        };

      }

      return visita;
    });

    setVisitas(visitasActualizadas);

    localStorage.setItem(
      "visitas",
      JSON.stringify(visitasActualizadas)
    );

    setVisitaSeleccionada({
      ...visitaSeleccionada,
      estado: nuevoEstado
    });
  };

  if (visitaSeleccionada) {

    return (
      <IonPage>

        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle de visita</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">

          <h2>{visitaSeleccionada.paciente}</h2>

          <p>Hora: {visitaSeleccionada.hora}</p>

          <p>
            Estado: {visitaSeleccionada.estado}
          </p>

          {visitaSeleccionada.estado === "pendiente" && (
            <IonButton
              expand="block"
              onClick={cambiarEstado}
            >
              Iniciar visita
            </IonButton>
          )}

          {visitaSeleccionada.estado === "en_camino" && (
            <IonButton
              expand="block"
              onClick={cambiarEstado}
            >
              Finalizar visita
            </IonButton>
          )}

          {visitaSeleccionada.estado === "finalizada" && (
            <p>
              Esta visita ya fue finalizada.
            </p>
          )}

          <IonButton
            expand="block"
            fill="outline"
            onClick={() => setVisitaSeleccionada(null)}
          >
            Volver
          </IonButton>

        </IonContent>

      </IonPage>
    );
  }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <IonList>

          {visitas.map((visita: any, index: number) => (

            <IonItem
              key={index}
              button
              onClick={() => setVisitaSeleccionada(visita)}
            >

              <div>

                <h2>{visita.paciente}</h2>

                <p>
                  Hora: {visita.hora}
                </p>

                <p>
                  Estado: {visita.estado}
                </p>

              </div>

            </IonItem>

          ))}

        </IonList>

      </IonContent>

    </IonPage>
  );
};

export default Visitas;