import ContactItem from "./ContactItem";

function ContactList({ contacts, onDeleteContact }) {

  return (
    <div className="contact-list">

      <h2 style={{ color: "#333" }}>Contactos</h2>

      {contacts.length === 0 ? (
        <p>No hay contactos.</p>
      ) : (
        contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onDeleteContact={onDeleteContact}
          />
        ))
      )}

    </div>
  );
}

export default ContactList;