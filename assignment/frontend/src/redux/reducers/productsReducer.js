


import {
	ADD_PRODUCT,
	DELETE_PRODUCT,
	GET_PRODUCT,
	GET_PRODUCTS,
	UPDATE_PRODUCT,
} from '../../tests/constants/redux.js';

/**
 * @name productsReducer
 * @description Implement productsReducer that handles following cases:
 * 1) GET_PRODUCT: adds the single product
 * 2) GET_PRODUCTS: Adds the products
 * 3) ADD_PRODUCT: Adds the product as the first entry of the state.
 * 4) UPDATE_PRODUCT: Updates the order in the state and places it as its last entry.
 * 5) DELETE_PRODUCT: Deletes the product from the array.
 * @param {Array} state old state of products.
 * @param {object} action the action that calls the reducer.
 * @returns {Array} new state for products
 */
const productsReducer = (state = [], action) => {
	if(action.type === GET_PRODUCT){
		const product = state.find((item) => item.id === action.payload.id);
    if (product) {
        return state;
    } else {
        state.push({ ...action.payload });
    }
	}
	else if(action.type === GET_PRODUCTS){
		state.push(...action.payload);
	}
	else if(action.type === ADD_PRODUCT){
		return state = [{...action.payload}, ...state];
	}
	else if(action.type === UPDATE_PRODUCT){
		const newState = state.filter(product => product.id !== action.payload.id);
		newState.push({ ...action.payload });
		state = newState;
	}
	else if(action.type === DELETE_PRODUCT){
		return state.filter(product => product.id !== action.payload.id);
	}
	return state;
};

export default productsReducer;
