import { useState } from "react";
import "./App.css";

import Login from "./components/LoginM";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";

function App() {
  const [logged, setLogged] = useState(
    localStorage.getItem("logged") === "true"
  );

  const [patients, setPatients] = useState(
    JSON.parse(localStorage.getItem("patients")) || []
  );

  const [search, setSearch] = useState("");

  const handleLogin = () => {
    setLogged(true);
  };

  const handleLogout = () => {
  localStorage.removeItem("logged");
  setLogged(false);
  };

  const handleAddPatient = (patient) => {
    const updatedPatients = [...patients, patient];

    setPatients(updatedPatients);
    localStorage.setItem("patients", JSON.stringify(updatedPatients));
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.nombre} ${patient.apellido} ${patient.cc}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!logged) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>Administración de pacientes</h1>

      <button onClick={handleLogout}>Cerrar sesión</button>
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o CC"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <PatientForm onAddPatient={handleAddPatient} />

      <PatientList patients={filteredPatients} />
    </div>
  );
}

export default App;