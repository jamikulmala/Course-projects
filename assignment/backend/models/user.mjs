import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Db } from '../db/db.mjs';
import { BaseModel, ModelError, ValidationError } from './base.mjs';
import { encryptedPasswordSchema, userSchema } from './schemas/user.mjs';

// FIXME: Move JWT_SECRET to environment variable and read from there
const JWT_SECRET = 'i4&C8q*bcJzj6F&KLYqBa0ek49OuK5';
const SALT_ROUNDS = 10;

export class User extends BaseModel {
  constructor (data = null) {
    super('users', 'User', userSchema);

    if (data !== null && typeof data === 'object') {
      const { value, error } = this._mySchema
        .tailor('create')
        .validate(data, { abortEarly: false });
      if (error) throw new ValidationError('User data is invalid', error);

      this._myData = { ...this._myData, ...value };

      if ('password' in value) {
        const { value: password, error: err } = encryptedPasswordSchema.validate(value.password);
        if (err) {
          // password doesn't seem to be encrypted
          // use setter to automatically encrypt it
          this.password = password;
        }
      }
    }
  }

  get name () {
    return this._myData?.name;
  }

  set name (newName) {
    const { value, error } = userSchema.name.validate(newName);
    if (error) throw new ValidationError('Invalid name', error);
    this._myData.name = value;
  }

  get email () {
    return this._myData?.email;
  }

  set email (newEmail) {
    const { value, error } = userSchema.email.validate(newEmail);
    if (error) throw new ValidationError('Invalid email', error);
    this._myData.email = value;
  }

  get password () {
    return this._myData?.password;
  }

  set password (newPassword) {
    const { value, error } = userSchema.password.validate(newPassword);
    if (error) throw new ValidationError('Invalid password', error);

    // hash password automatically
    this._myData.password = bcrypt.hashSync(value, SALT_ROUNDS);
  }

  get role () {
    return this._myData.role ?? 'customer';
  }

  set role (newRole) {
    const { value, error } = userSchema.role.validate(newRole);
    if (error) throw new ValidationError('Invalid role', error);
    this._myData.role = value;
  }

  isAdmin () {
    return this.role === 'admin';
  }

  async checkPassword (password) {
    return await bcrypt.compare(password, this.password);
  }

  /**
   * Define JSON stringification behavior
   *
   * @returns object
   */
  toJSON () {
    const data = { ...this._myData };
    delete data.password;
    return data;
  }

  setData (data) {
    super.setData(data);

    if ('password' in data) {
      const { value: password, error } = encryptedPasswordSchema.validate(data.password);
      if (error) {
        // password doesn't seem to be encrypted
        // use setter to automatically encrypt it
        this.password = password;
      }
    }
  }

  /**
   * Get JWT authentication token for the user
   *
   * @returns {string} JWT authentication token
   */
  getToken () {
    const { email, role } = this.toJSON();
    if (!email || !role) throw new ModelError('Missing email or role');
    return jwt.sign({ email, role }, JWT_SECRET);
  }

  /**
   * Find user by ID
   *
   * @param id string
   * @returns User|null
   */
  static findById (id) {
    const data = Db.findById('users', id);
    return data ? new User(data) : null;
  }

  /**
   * Find one user matching the search criteria
   *
   * @param criteria object search criteria
   * @returns User|null
   */
  static findOne (criteria) {
    const data = Db.findOne('users', criteria);
    return data ? new User(data) : null;
  }

  /**
   * Find all users matching the search criteria
   *
   * @param criteria object|null search criteria
   * @returns Array<User>
   */
  static findAll (criteria = null) {
    const items = Db.findAll('users', criteria);
    return items.map(item => new User(item));
  }

  static findByEmail (email) {
    return this.findOne({ email });
  }

  static async deleteMany (criteria = null) {
    return await Db.deleteMany('users', criteria);
  }

  static async create (data) {
    return await Promise.all(
      data.map(d => {
        const user = new User(d);
        return user.save();
      })
    );
  }

  /**
   * Verify JWT authentication token
   *
   * @param {string} token
   * @returns {object} decoded payload object
   * @throws {Error} throws error on invalid token
   */
  static verifyToken (token) {
    return jwt.verify(token, JWT_SECRET);
  }
}
