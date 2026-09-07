import { useState } from "react";

function ContactForm({ onAddContact }) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (name === "" || phone === "") {
      alert("Por favor completa todos los campos");
      return;
    }

    onAddContact(name, phone);

    setName("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button type="submit">
        Agregar contacto
      </button>

    </form>
  );
}

export default ContactForm;