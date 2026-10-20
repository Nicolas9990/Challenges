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

import { useDexie } from "../hooks/useDexie";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

function Fruits() {
    const { fruits, addFruit, updateFruit, deleteFruit } = useDexie();

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleAddFruit = async () => {
        if (!name.trim() || !quantity) return;

        await addFruit(name, Number(quantity));

        setName("");
        setQuantity("");
    };

    const handleUpdateFruit = async (
        id: number,
        currentName: string,
        currentQuantity: number
    ) => {
        const newName = window.prompt("Nuevo nombre:", currentName);

        if (newName === null) return;

        const newQuantity = window.prompt(
            "Nueva cantidad:",
            String(currentQuantity)
        );

        if (newQuantity === null) return;

        await updateFruit(
            id,
            newName,
            Number(newQuantity)
        );
    };

    const navigate = useNavigate();
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
                    <IonTitle>Frutas</IonTitle>

                    <IonButton slot="end" onClick={() => navigate("/tasks")}>
                        Tareas
                    </IonButton>

                    <IonButton slot="end" onClick={() => navigate("/contacts")}>
                        Contactos
                    </IonButton>

                    <IonButton slot="end" onClick={handleLogout}>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput
                        label="Fruta"
                        placeholder="Ej: Manzana"
                        value={name}
                        onIonInput={(e) => setName(e.detail.value ?? "")}
                    />
                </IonItem>

                <IonItem>
                    <IonInput
                        label="Cantidad"
                        type="number"
                        placeholder="Ej: 5"
                        value={quantity}
                        onIonInput={(e) => setQuantity(e.detail.value ?? "")}
                    />
                </IonItem>

                <IonButton
                    expand="block"
                    onClick={handleAddFruit}
                >
                    Agregar fruta
                </IonButton>

                <IonList>
                    {fruits.map((fruit) => (
                        <IonItem key={fruit.id}>
                            <IonLabel>
                                <h2>{fruit.name}</h2>
                                <p>Cantidad: {fruit.quantity}</p>
                            </IonLabel>

                            <IonButton
                                onClick={() =>
                                    handleUpdateFruit(
                                        fruit.id!,
                                        fruit.name,
                                        fruit.quantity
                                    )
                                }
                            >
                                Editar
                            </IonButton>

                            <IonButton
                                color="danger"
                                onClick={() => deleteFruit(fruit.id!)}
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

export default Fruits;