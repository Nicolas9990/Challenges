import { useLiveQuery } from "dexie-react-hooks";
import { db, type Fruit } from "../db/database";

export function useDexie() {
  const fruits = useLiveQuery(
    () => db.fruits.toArray(),
    []
  ) ?? [];

  const addFruit = async (
    name: string,
    quantity: number
  ): Promise<void> => {
    if (!name.trim()) return;

    await db.fruits.add({
      name: name.trim(),
      quantity,
    });
  };

  const updateFruit = async (
    id: number,
    name: string,
    quantity: number
  ): Promise<void> => {
    await db.fruits.update(id, {
      name: name.trim(),
      quantity,
    });
  };

  const deleteFruit = async (id: number): Promise<void> => {
    await db.fruits.delete(id);
  };

  return {
    fruits,
    addFruit,
    updateFruit,
    deleteFruit,
  };
}