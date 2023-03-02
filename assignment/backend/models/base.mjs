import Joi from 'joi';
import { Db } from '../db/db.mjs';

export class ModelError extends Error {}

export class ValidationError extends ModelError {
  #details;

  constructor (message, details = null) {
    super(message);

    if (details) {
      this.#details = Array.isArray(details)
        ? [...details]
        : 'details' in details
        ? details.details.reduce((messages, d) => {
            messages[d.path] = d.message;
            return messages;
          }, {})
        : { ...details };
    }
  }

  get details () {
    return this.#details;
  }
}

export class BaseModel {
  _myCollection;
  _myData = {};
  _myModel;
  _mySchema;

  constructor (collection, model, schema) {
    this._myCollection = collection;
    this._myModel = model;
    this._mySchema = Joi.object(schema);
  }

  get id () {
    return this._myData?.id;
  }

  /**
   * Define JSON stringification behavior
   *
   * @returns object
   */
  toJSON () {
    return { ...this._myData };
  }

  setData (data) {
    const { value, error } = this._mySchema.tailor('create').validate(data, { abortEarly: false });
    if (error) throw new ValidationError(`${this._myModel} data is invalid`, error);
    this._myData = { ...this._myData, ...value };
  }

  async save () {
    const data = { ...this._myData };
    const { value, error } = this._mySchema.tailor('save').validate(data, { abortEarly: false });
    if (error) throw new ValidationError(`${this._myModel} data is invalid`, error);

    const newData = await Db.insertOrUpdate(this._myCollection, data);
    this._myData = { ...this._myData, ...newData };
  }

  async delete () {
    if (!this.id) throw new ModelError(`ID not found. ${this._myModel} not found in the database`);

    const newData = await Db.deleteOne(this._myCollection, this.id);
    this._myData = { ...this._myData, ...newData };
  }
}
