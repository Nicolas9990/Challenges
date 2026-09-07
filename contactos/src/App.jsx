import { useEffect, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import "./App.css";

function App() {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular la carga inicial de contactos
  useEffect(() => {

    setTimeout(() => {

      const initialContacts = [
        {
          id: 1,
          name: "Juan Pérez",
          phone: "3001234567"
        },
        {
          id: 2,
          name: "María Gómez",
          phone: "3159876543"
        },
        {
          id: 3,
          name: "Carlos López",
          phone: "3204567890"
        }
      ];

      setContacts(initialContacts);
      setLoading(false);

    }, 1500);

  }, []);

  // Agregar contacto
  const addContact = (name, phone) => {

    const newContact = {
      id: Date.now(),
      name: name,
      phone: phone
    };

    setContacts([...contacts, newContact]);
  };

  // Eliminar contacto
  const deleteContact = (id) => {

    const newContacts = contacts.filter(
      contact => contact.id !== id
    );

    setContacts(newContacts);
  };

  if (loading) {
    return (
      <div className="loader">
        <h2>Cargando contactos...</h2>
      </div>
    );
  }

  return (
    <div className="app">

      <img
      src="/contactos.png"
      alt="Contactos"
      className="imagen-contactos"
      />

      <h1>Lista de Contactos</h1>

      <ContactForm onAddContact={addContact} />

      <ContactList
        contacts={contacts}
        onDeleteContact={deleteContact}
      />

    </div>
  );
}

export default App;