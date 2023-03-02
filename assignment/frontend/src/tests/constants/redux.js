/** @format */

// Constants for Order-type.
export const GET_ORDER = 'GET_ORDER';
export const GET_ORDERS = 'GET_ORDERS';
export const ADD_ORDER = 'ADD_ORDER';
export const CLEAR_ORDERS = 'CLEAR_ORDERS';

// Constants for Cart-type.
export const INIT_CART = 'INIT_CART';
export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';
export const UPDATE_CART_ITEM_AMOUNT = 'UPDATE_CART_ITEM';
export const EMPTY_CART = 'EMPTY_CART';

// Constants for User-type.
export const NEW_USER = 'NEW_USER';
export const GET_USER = 'GET_USER';
export const GET_USERS = 'GET_USERS';
export const CLEAR_USERS = 'CLEAR_USERS';
export const UPDATE_USER = 'UPDATE_USER';
export const REMOVE_USER = 'REMOVE_USER';

// Constants for Notification-state
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

// Constants for Product-state
export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';

// Constants for Auth-state
export const INIT_AUTH = 'INIT_AUTH';
export const ADD_AUTH = 'NEW_AUTH';
export const REMOVE_AUTH = 'REMOVE_AUTH';

// Messages out of order updates
export const orderMsg = {
	gotOrder: 'Order retrieved from the backend.',
	gotOrders: 'Orders retrieved from the backend.',
	newOrder: 'New order made.',
};

//  Messages out of product updates
export const productMsg = {
	added: 'Product added.',
	updated: 'Product updated.',
	deleted: (product) => {
		return `${product.name} deleted successfully`;
	},
};

// Messages out of cart updates
export const cartMsg = {
	add: 'New cart item added.',
	update: 'Cart item amount updated.',
};

// Messages out of auth updates
// valid Auth Messages:
export const authMsg = {
	welcome: function (name) {
		return `Welcome to my store, ${name}!`;
	},
	welcomeBack: 'Welcome back!',
};
// Invalid Auth Messages:
export const invalidAuthMsg = {
	noLogIn: 'Authentication required',
	name: 'Name too short',
	email: 'Invalid email',
	password: 'Password too short',
	passwordConfirmation: 'Password missmatch',
};

// The messages that notify the user of the result of their action.
// NEED TO CHECK IF THIS IS STILL USED
export const userMsg = {
	got: 'Single user received',
	gots: 'Users received.',
	update: 'User updated.',
	delete: (user) => {
		return `${user.name} deleted successfully`;
	},
};
