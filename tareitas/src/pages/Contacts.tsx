import React, { useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
} from "@ionic/react";

import { useCollection } from "../hooks/useContacts";
import type { Contact } from "../types/Contact";
import { useNetwork } from "../hooks/useNetwork";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Contacts() {
    const {
        data: contacts,
        loading,
        add,
        update,
        remove,
    } = useCollection<Omit<Contact, "id">>("contacts");

    const { connected, connectionType } = useNetwork();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const handleAddContact = async () => {
        if (!connected) return;

        if (!name.trim() || !phone.trim() || !email.trim()) {
            return;
        }

        await add({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
        });

        setName("");
        setPhone("");
        setEmail("");
    };

    const handleUpdateContact = async (contact: Contact) => {
        if (!connected || !contact.id) return;

        const newName = window.prompt("Nuevo nombre:", contact.name);
        if (newName === null) return;

        const newPhone = window.prompt("Nuevo teléfono:", contact.phone);
        if (newPhone === null) return;

        const newEmail = window.prompt("Nuevo correo:", contact.email);
        if (newEmail === null) return;

        await update(contact.id, {
            name: newName.trim(),
            phone: newPhone.trim(),
            email: newEmail.trim(),
        });
    };

    const handleDeleteContact = async (id: string) => {
        if (!connected) return;

        await remove(id);
    };

    const { logout } = useAuthContext();

    const handleLogout = async () => {
        const result = await logout();

        if (result.success) {
            navigate("/login");
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Contactos</IonTitle>

                    <IonButton slot="end" onClick={() => navigate("/tasks")}>
                        Tareas
                    </IonButton>

                    <IonButton slot="end" onClick={() => navigate("/fruits")}>
                        Frutas
                    </IonButton>

                    <IonButton slot="end" onClick={handleLogout}>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">

                {/* Estado de conexión */}
                <div
                    style={{
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        background: connected ? "#d4edda" : "#f8d7da",
                    }}
                >
                    {connected
                        ? `🟢 Conectado (${connectionType})`
                        : "🔴 Sin conexión"}
                </div>

                <IonItem>
                    <IonInput
                        label="Nombre"
                        placeholder="Ej: Juan Pérez"
                        value={name}
                        disabled={!connected}
                        onIonInput={(e) => setName(e.detail.value ?? "")}
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label="Teléfono"
                        placeholder="Ej: 3001234567"
                        value={phone}
                        disabled={!connected}
                        onIonInput={(e) => setPhone(e.detail.value ?? "")}
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label="Correo"
                        type="email"
                        placeholder="Ej: juan@email.com"
                        value={email}
                        disabled={!connected}
                        onIonInput={(e) => setEmail(e.detail.value ?? "")}
                    />
                </IonItem>

                <IonButton
                    expand="block"
                    onClick={handleAddContact}
                    disabled={!connected}
                >
                    Agregar contacto
                </IonButton>

                {loading && <p>Cargando contactos...</p>}

                <IonList>
                    {contacts.map((contact) => (
                        <IonItem key={contact.id}>
                            <IonLabel>
                                <h2>{contact.name}</h2>
                                <p>{contact.phone}</p>
                                <p>{contact.email}</p>
                            </IonLabel>

                            <IonButton
                                disabled={!connected}
                                onClick={() => handleUpdateContact(contact)}
                            >
                                Editar
                            </IonButton>

                            <IonButton
                                color="danger"
                                disabled={!connected}
                                onClick={() =>
                                    contact.id && handleDeleteContact(contact.id)
                                }
                            >
                                Eliminar
                            </IonButton>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default Contacts;