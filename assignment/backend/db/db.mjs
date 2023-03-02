import { Low, Memory } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v1 as uuidV1 } from 'uuid';

export class DbError extends Error {}
export class Db {
  static #db = null;

  constructor () {
    throw new DbError('Static class cannot be instantiated');
  }

  static getInstance (adapter = null) {
    if (Db.#db == null) {
      // Use memory adapter unless otherwise specified
      if (!adapter) adapter = Db.getMemoryAdapter();
      const db = new Low(adapter);

      // Read initial data to memory
      db.read().then(() => (db.data ||= {}));
      Db.#db = db;
    }

    return Db.#db;
  }

  static setInstance (adapter) {
    const db = new Low(adapter);

    // Read initial data to memory
    db.read().then(() => (db.data ||= {}));
    Db.#db = db;
  }

  static getJsonAdapter (fileName) {
    return new JSONFile(fileName);
  }

  static getMemoryAdapter () {
    return new Memory();
  }

  static findById (collection, id) {
    const db = Db.getInstance();
    if (!(collection in db.data)) return null;

    const item = db.data[collection].find(item => item.id === id);
    return item ? { ...item } : null;
  }

  static findOne (collection, criteria = null) {
    const db = Db.getInstance();
    if (!(collection in db.data)) return null;
    if (!criteria) return db.data[collection].length ? { ...db.data[collection][0] } : null;

    const entries = Object.entries(criteria);
    const item = db.data[collection].find(item =>
      entries.every(([key, value]) => key in item && item[key] === value)
    );

    return item ? { ...item } : null;
  }

  static findAll (collection, criteria = null) {
    const db = Db.getInstance();
    if (!(collection in db.data)) return [];
    if (!criteria) return db.data[collection].map(item => ({ ...item }));

    const entries = Object.entries(criteria);
    return db.data[collection]
      .filter(item => entries.every(([key, value]) => key in item && item[key] === value))
      .map(item => ({ ...item }));
  }

  static async insertOrUpdate (collection, data) {
    const db = Db.getInstance();
    if (!(collection in db.data)) db.data[collection] = [];

    let item = {
      id: uuidV1().replaceAll('-', '')
    };

    if ('id' in data) {
      const id = data['id'];
      const index = db.data[collection].findIndex(item => item.id === id);
      if (index === -1) throw new DbError('Unknown ID. Unable to update.');
      item = db.data[collection].splice(index, 1)[0];
    }

    item = { ...item, ...data };
    db.data[collection].push({ ...item });
    await db.write();
    return item;
  }

  static async deleteOne (collection, id) {
    const db = Db.getInstance();
    if (!(collection in db.data)) throw new DbError(`Unknown collection: "${collection}"`);

    const index = db.data[collection].findIndex(item => item.id === id);
    if (index === -1) throw new DbError('Unknown ID. Unable to delete.');
    const item = db.data[collection].splice(index, 1)[0];
    await db.write();
    return { ...item };
  }

  static async deleteMany (collection, criteria = null) {
    const db = Db.getInstance();
    if (!(collection in db.data)) return null;
    if (!criteria) {
      db.data[collection] = [];
      await db.write();
      return;
    }

    const entries = Object.entries(criteria);
    const keepers = db.data[collection].filter(
      item => !entries.every(([key, value]) => key in item && item[key] === value)
    );

    db.data[collection] = keepers;
    await db.write();
  }
}
