import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem
} from "@ionic/react";

const Pacientes: React.FC = () => {

  const pacientes = [
    {
      nombre: "Carlos Pérez",
      telefono: "300 123 4567"
    },
    {
      nombre: "María Gómez",
      telefono: "301 234 5678"
    },
    {
      nombre: "Juan Rodríguez",
      telefono: "302 345 6789"
    }
  ];

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <IonList>

          {pacientes.map((paciente, index) => (

            <IonItem key={index}>

              <div>
                <h2>{paciente.nombre}</h2>
                <p>Teléfono: {paciente.telefono}</p>
              </div>

            </IonItem>

          ))}

        </IonList>

      </IonContent>

    </IonPage>
  );
};

export default Pacientes;