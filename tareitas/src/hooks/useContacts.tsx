import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type DocumentData,
  type DocumentReference,
  type UpdateData,
} from "firebase/firestore";

// @ts-expect-error firebaseConfig is JavaScript and has no declaration file.
import { db } from "../firebase/firebaseConfig";

export function useCollection<T extends DocumentData>(
  collectionName: string
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const getAll = async () => {
    try {
      setLoading(true);

      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);

      const items = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as (T & { id: string })[];

      setData(items);
    } catch (error) {
      console.error("Error obteniendo documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const add = async (item: T) => {
    try {
      const collectionRef = collection(db, collectionName);

      await addDoc(collectionRef, item);

      await getAll();
    } catch (error) {
      console.error("Error agregando documento:", error);
      throw error;
    }
  };

  const update = async (id: string, item: Partial<T>) => {
    try {
      const documentRef = doc(db, collectionName, id) as DocumentReference<T>;

      await updateDoc(documentRef, item as UpdateData<T>);

      await getAll();
    } catch (error) {
      console.error("Error actualizando documento:", error);
      throw error;
    }
  };

  const remove = async (id: string) => {
    try {
      const documentRef = doc(db, collectionName, id);

      await deleteDoc(documentRef);

      await getAll();
    } catch (error) {
      console.error("Error eliminando documento:", error);
      throw error;
    }
  };

  useEffect(() => {
    getAll();
  }, [collectionName]);

  return {
    data,
    loading,
    getAll,
    add,
    update,
    remove,
  };
}