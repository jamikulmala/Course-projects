

// CART ACTION CREATORS

import {
	ADD_CART_ITEM,
	cartMsg,
	EMPTY_CART,
	INIT_CART,
	NEW_NOTIFICATION,
	REMOVE_CART_ITEM,
	UPDATE_CART_ITEM_AMOUNT,
} from '../../tests/constants/redux.js';

/**
 * @name getProductCountFromCart
 * @description gets quantity of item
 * @param {string} productId - id of product to search 
 * @returns {string} count 
 */
const getProductCountFromCart = productId => {
	const count = localStorage.getItem(productId);
	return count;
  };

/**
 * @name initCart
 * @description Action creator that initiates the cart after page is refreshed.  Sends an INIT_CART-type action along with pre-existing cart-items stored locally as payload to the frontends redux-stores product-state.
 * @returns {object} action
 */

export const initCart = () => {
	return({
		type: INIT_CART,
		payload: []
	});
};

/**
 * @name addCartItem
 * @description Action creator that adds a new cart item to local storage.  Dispatches an ADD_CART_ITEM-type action along with product as payload to the frontends redux-stores product-state, as well as a NEW_NOTIFICATION action to the frontends notification-state with a succesful message using cartMsg.add
 * @param {string} product - The product item to add
 * @returns {Function} thunk
 */
export const addCartItem = (product) => {
	delete product.image;
	const count = getProductCountFromCart(product.id);
	let q = 0;
	if(count === undefined) {
		localStorage.setItem(product.id, 1);
		q += 1;
	} else {
		localStorage.setItem(product.id, Number(count)+1);
		q += Number(count)+1;
	}
	const item = {
		product : product,
		quantity : 1
	};
	return (dispatch) => {
		dispatch({type: ADD_CART_ITEM, payload: item});
		dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: true, message: cartMsg.add}});
	};
};

/**
 * @name removeCartItem
 * @description Action creator that removes a cart item from local storage.  Sends a REMOVE_CART_ITEM-type action along with product as payload to the frontends redux-stores product-state.
 * @param {string} product - The product item to remove from cart
 * @returns {object} Action
 */
export const removeCartItem = (product) => {
	localStorage.setItem(product.id, 0);
	return({
		type: REMOVE_CART_ITEM,
		payload: product
	});
};

/**
 * @name incrementCartItem
 * @description Thunk action creator that increments a cart items quantity in local store.  Dispatches a UPDATE_CART_ITEM_AMOUNT-type action along with the update details { productId, amount: 1 } as payload to the frontends redux-stores product-state. Also sends NEW_NOTIFICATION-type action with payload of a message informing the items amount is updated (use cartMsg.update).
 * @param {string} productId - The cart item id to increment
 * @returns {Function} thunk
 */
export const incrementCartItem = (productId) => {
	const count = getProductCountFromCart(productId);
	localStorage.setItem(productId, Number(count)+1);
	return (dispatch) => {
		dispatch({type: UPDATE_CART_ITEM_AMOUNT, payload: {productId, amount: 1}});
		dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: true, message: cartMsg.update}});
	};
};

/**
 * @name decrementCartItem
 * @description Thunk action creator that decrements (reduces) a cart items quantity in local store.  Dispatches a UPDATE_CART_ITEM_AMOUNT-type action along with the update details  { productId, amount: -1 } as payload to the frontends redux-stores product-state. Also sends NEW_NOTIFICATION-type action with payload of a message informing the items amount is updated (use cartMsg.update)
 * @param {string} productId - The cart item id to decrement
 * @returns {Function} thunk
 */
export const decrementCartItem = (productId) => {
	const count = getProductCountFromCart(productId);
	if(Number(count) > 1) {
		localStorage.setItem(productId, Number(count)-1);
	} else {
		localStorage.setItem(productId, 0);
	}
	return (dispatch) => {
		dispatch({type: UPDATE_CART_ITEM_AMOUNT, payload: {productId, amount: -1}});
		dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: true, message: cartMsg.update}});
	};
};

/**
 * @name emptyCart
 * @description An action creator which removes the entire cart-item from local store. Returns an action with EMPTY_CART-type to remove cart all items.
 * @returns {object} the action
 */
export const emptyCart = () => {
	localStorage.clear();
	return({
		type: EMPTY_CART
	});

	
};