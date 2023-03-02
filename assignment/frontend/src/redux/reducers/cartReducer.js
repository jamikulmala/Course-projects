

import {
	ADD_CART_ITEM,
	EMPTY_CART,
	INIT_CART,
	REMOVE_CART_ITEM,
	UPDATE_CART_ITEM_AMOUNT,
} from '../../tests/constants/redux.js';

/**
 * @name cartReducer
 * @description Implement cartReducer that handles following cases:
 * 1) INIT_CART: returns the actions payload if there is a payload. Otherwise returns state.
 * 2) ADD_CART_ITEM: Adds a new cart item to the stores state
 * 3) REMOVE_CART_ITEM: removes the product item from the state.
 * 4) UPDATE_CART_ITEM_AMOUNT: Updates the cart item with the amount from payload.
 * 5) EMPTY_CART: returns an empty array.
 * @param {Array} state old state of cart.
 * @param {object} action the action that calls the reducer.
 * @returns {Array} new state for cart
 */
const cartReducer = (state = [], action) => {
	if(action.type === INIT_CART){
		if(action.payload === null){
			return state;
		}
		return action.payload;
	}
	else if(action.type === ADD_CART_ITEM){
		const itemInCart = state.find((i) => i.product.id === action.payload.product.id);
    if (itemInCart !== undefined) {
        itemInCart.quantity++;
    } else {
        return [...state, action.payload];
    }
	}
	else if(action.type === REMOVE_CART_ITEM){
		const removeItem = state.filter((item) => item.product.id !== action.payload.id);
		state = removeItem;
	}
	else if(action.type === UPDATE_CART_ITEM_AMOUNT){
		return state.map(item => {
			if(item.product.id === action.payload.productId){
				if(action.payload.amount === -1){
					if (item.quantity === 1) {
						return {...item, quantity : 0};
					} else {
						return {...item, quantity : item.quantity - 1};
					}
				} else { return {...item, quantity : item.quantity + 1};
			}
		} return item; });
	}
	else if(action.type === EMPTY_CART){
		return state = [];
	}
	return state;
};
export default cartReducer;
