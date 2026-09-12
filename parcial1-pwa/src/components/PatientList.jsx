function PatientList({ patients }) {
  return (
    <div>
      <h2>Pacientes registrados</h2>

      {patients.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        patients.map((patient) => (
          <div key={patient.id}>
            <p>
              <strong>Nombre:</strong> {patient.nombre} {patient.apellido}
            </p>

            <p>
              <strong>CC:</strong> {patient.cc}
            </p>

            <p>
              <strong>Teléfono:</strong> {patient.telefono}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default PatientList;