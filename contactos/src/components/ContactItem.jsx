function ContactItem({ contact, onDeleteContact }) {

  return (
    <div className="contact-item">

      <div>
        <strong>{contact.name}</strong>
        <p>{contact.phone}</p>
      </div>

      <button
        onClick={() => onDeleteContact(contact.id)}
      >
        Eliminar
      </button>

    </div>
  );
}

export default ContactItem;