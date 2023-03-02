import { Db } from '../db/db.mjs';
import { BaseModel, ValidationError } from './base.mjs';
import { orderSchema } from './schemas/order.mjs';

export class Order extends BaseModel {
  constructor (data = null) {
    super('orders', 'Order', orderSchema);

    if (data !== null && typeof data === 'object') {
      const { value, error } = this._mySchema
        .tailor('create')
        .validate(data, { abortEarly: false });
      if (error) throw new ValidationError('Order data is invalid', error);

      this._myData = { ...this._myData, ...value };
    }
  }

  get customerId () {
    return this._myData?.customerId;
  }

  set customerId (newCustomerId) {
    const { value, error } = orderSchema.customerId.validate({ customerId: newCustomerId });
    if (error) throw new ValidationError('Invalid customerId', error);
    this._myData.customerId = value;
  }

  get items () {
    return this._myData?.items;
  }

  /**
   * Find user by ID
   *
   * @param id string
   * @returns Order|null
   */
  static findById (id) {
    const data = Db.findById('orders', id);
    return data ? new Order(data) : null;
  }

  /**
   * Find one user matching the search criteria
   *
   * @param criteria object search criteria
   * @returns Order|null
   */
  static findOne (criteria) {
    const data = Db.findOne('orders', criteria);
    return data ? new Order(data) : null;
  }

  /**
   * Find all orders matching the search criteria
   *
   * @param criteria object|null search criteria
   * @returns Array<Order>
   */
  static findAll (criteria = null) {
    const items = Db.findAll('orders', criteria);
    return items.map(item => new Order(item));
  }

  static async deleteMany (criteria = null) {
    return await Db.deleteMany('orders', criteria);
  }

  static async create (data) {
    return await Promise.all(
      data.map(d => {
        const order = new Order(d);
        return order.save();
      })
    );
  }
}
