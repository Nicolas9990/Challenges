import Dexie, { type Table } from "dexie";

export interface Fruit {
  id?: number;
  name: string;
  quantity: number;
}

export class AppDatabase extends Dexie {
  fruits!: Table<Fruit, number>;

  constructor() {
    super("TareitasDB");

    this.version(1).stores({
      fruits: "++id, name",
    });
  }
}

export const db = new AppDatabase();