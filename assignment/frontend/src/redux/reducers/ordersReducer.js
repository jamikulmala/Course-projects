

import {
	ADD_ORDER,
	CLEAR_ORDERS,
	GET_ORDER,
	GET_ORDERS,
} from '../../tests/constants/redux.js';

/**
 * @name ordersReducer
 * @description Implement ordersReducer that handles following cases:
 * 1) GET_ORDER: adds the order to an empty state.
 * 2) GET_ORDERS: Adds the orders to the empty state
 * 3) CLEAR_ORDERS: Removes the orders from the state
 * 4) ADD_ORDER: Adds the order to the state by placing it as the last entry.
 * @param {Array} state old state of orders.
 * @param {object} action the action that calls the reducer.
 * @returns {Array} new state for orders
 */
const ordersReducer = (state = [], action) => {
	if(action.type === GET_ORDER){
		const order = state.find((item) => item.id === action.payload.id);
    if (order) {
        return state;
    } else {
        return state = [...state, action.payload];
    }
	}
	else if(action.type === GET_ORDERS){
		state.push(...action.payload);
	}
	else if(action.type === CLEAR_ORDERS){
		return state = [];
	}
	else if(action.type === ADD_ORDER){
		return [...state, action.payload];
	}
	return state;
};
export default ordersReducer;
