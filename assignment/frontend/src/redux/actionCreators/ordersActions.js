

// ORDER ACTION CREATORS
import axios from 'axios';
import {
	NEW_NOTIFICATION,
	GET_ORDERS,
	ADD_ORDER,
	GET_ORDER,
	orderMsg,
	EMPTY_CART,
} from '../../tests/constants/redux.js';
import { emptyCart } from './cartActions';
/**
 * @name getOrder
 * @description Action creator for getting a single order. Dispatches action with type GET_ORDER and payload of the fetched order if succesfull.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {string} orderId -  The id of the order to get
 * @returns {Function} - Thunk -> action
 */
export const getOrder = (orderId) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: `http://localhost:3001/api/orders/${orderId}`,
			data: JSON.stringify(orderId),
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: GET_ORDER, payload: data.data});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};

/**
 * @name getOrders
 * @description Action creator for getting all orders. Dispatches action with type GET_ORDERS and payload of the fetched orders if succesfull.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @returns {Function} - Thunk -> action
 */
export const getOrders = () => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: 'http://localhost:3001/api/orders',
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: GET_ORDERS, payload: data.data});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};

/**
 * @name addOrder
 * @description Action creator for adding a new order. Dispatches actions:
 * - ADD_ORDER-type with payload that has the new order
 * - EMPTY_CART-type with no payload
 * - NEW_NOTIFICATION with orderMsg.newOrder in the payload
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {object} newOrder -  The new order to post
 * @returns {Function} - Thunk -> action
 */
export const addOrder = (newOrder) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'POST',
			url: 'http://localhost:3001/api/orders',
			data: JSON.stringify(newOrder),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: EMPTY_CART});
			dispatch({type: ADD_ORDER, payload: data.data});
			dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:true, message: orderMsg.newOrder}});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};
