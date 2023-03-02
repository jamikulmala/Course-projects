import { Db } from '../db/db.mjs';
import { BaseModel, ValidationError } from './base.mjs';
import { productSchema } from './schemas/product.mjs';

export class Product extends BaseModel {
  constructor (data = null) {
    super('products', 'Product', productSchema);

    if (data !== null && typeof data === 'object') {
      const { value, error } = this._mySchema
        .tailor('create')
        .validate(data, { abortEarly: false });
      if (error) throw new ValidationError('Product data is invalid', error);

      this._myData = { ...this._myData, ...value };
    }
  }

  get name () {
    return this._myData?.name;
  }

  set name (newName) {
    const { value, error } = productSchema.name.validate(newName);
    if (error) throw new ValidationError('Invalid name', error);
    this._myData.name = value;
  }

  get price () {
    return this._myData?.price;
  }

  set price (newPrice) {
    const { value, error } = productSchema.price.validate(newPrice);
    if (error) throw new ValidationError('Invalid price', error);
    this._myData.price = value;
  }

  get image () {
    return this._myData?.image;
  }

  set image (newImage) {
    const { value, error } = productSchema.image.validate(newImage);
    if (error) throw new ValidationError('Invalid image', error);
    this._myData.image = value;
  }

  get description () {
    return this._myData?.description;
  }

  set description (newDescription) {
    const { value, error } = productSchema.description.validate(newDescription);
    if (error) throw new ValidationError('Invalid description', error);
    this._myData.description = value;
  }

  /**
   * Find user by ID
   *
   * @param id string
   * @returns Product|null
   */
  static findById (id) {
    const data = Db.findById('products', id);
    return data ? new Product(data) : null;
  }

  /**
   * Find one user matching the search criteria
   *
   * @param criteria object search criteria
   * @returns Product|null
   */
  static findOne (criteria) {
    const data = Db.findOne('products', criteria);
    return data ? new Product(data) : null;
  }

  /**
   * Find all products matching the search criteria
   *
   * @param criteria object|null search criteria
   * @returns Array<Product>
   */
  static findAll (criteria = null) {
    const items = Db.findAll('products', criteria);
    return items.map(item => new Product(item));
  }

  static async deleteMany (criteria = null) {
    return await Db.deleteMany('products', criteria);
  }

  static async create (data) {
    return await Promise.all(
      data.map(d => {
        const product = new Product(d);
        return product.save();
      })
    );
  }
}
