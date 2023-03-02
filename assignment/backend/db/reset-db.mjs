import debug from 'debug';
import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/product.mjs';
import { User } from '../models/user.mjs';
import { Db } from './db.mjs';

// Create logger for debugging
// (Better console.log with colours and does not show any output in production)
debug.enable('assignment-backend:*');
const log = debug('assignment-backend:reset-db');

const DB_FILE = 'db.json';
const DB_DIR = dirname(fileURLToPath(import.meta.url));
const fileName = resolve(DB_DIR, DB_FILE);

try {
  await fs.rm(fileName);
} catch (error) {
  if (error.code !== 'ENOENT') {
    log(error);
    process.exit(1);
  }
}

const adapter = Db.getJsonAdapter(fileName);
const db = Db.getInstance(adapter);

const currentDir = dirname(fileURLToPath(import.meta.url));
const productsJson = resolve(currentDir, 'reset', 'products.json');
const usersJson = resolve(currentDir, 'reset', 'users.json');

const products = JSON.parse(await fs.readFile(productsJson));
const users = JSON.parse(await fs.readFile(usersJson));

log('Adding users to database');
let userCount = 0;

for (const data of users) {
  try {
    const user = new User(data);
    await user.save();
    userCount += 1;
  } catch (error) {
    log('%O', error.details);
  }
}

log('Added %d/%d users to database', userCount, users.length);
log('Adding products to database');
let productCount = 0;

for (const data of products) {
  try {
    const product = new Product(data);
    await product.save();
    productCount += 1;
  } catch (error) {
    log('%O', error.details);
  }
}

log('Added %d/%d products to database', productCount, products.length);
