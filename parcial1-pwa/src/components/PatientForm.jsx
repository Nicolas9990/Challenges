import { useState } from "react";

function PatientForm({ onAddPatient }) {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [cc, setCc] = useState("");
    const [telefono, setTelefono] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nombre.trim() || !apellido.trim() || !cc.trim()) {
            alert("Nombre, apellido y CC son obligatorios");
            return;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            alert("El nombre solo debe contener letras");
            return;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
            alert("El apellido solo debe contener letras");
            return;
        }

        if (!/^\d+$/.test(cc)) {
            alert("La CC solo debe contener números");
            return;
        }

        if (telefono && !/^\d+$/.test(telefono)) {
            alert("El teléfono solo debe contener números");
            return;
        }

        const newPatient = {
            id: Date.now(),
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            cc: cc.trim(),
            telefono: telefono.trim(),
        };

        onAddPatient(newPatient);

        setNombre("");
        setApellido("");
        setCc("");
        setTelefono("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Agregar paciente</h2>

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
            />

            <input
                type="text"
                placeholder="CC"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
            />

            <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
            />

            <button type="submit">Agregar paciente</button>
        </form>
    );
}

export default PatientForm;