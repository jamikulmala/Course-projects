

// PRODUCT ACTION CREATORS
import axios from 'axios';
import {
	ADD_PRODUCT,
	DELETE_PRODUCT,
	GET_PRODUCT,
	GET_PRODUCTS,
	NEW_NOTIFICATION,
	productMsg,
	UPDATE_PRODUCT,
} from '../../tests/constants/redux.js';

/**
 * @name getProduct
 * @description Asynchronous Action creator for getting a single product. Dispatches an action with type GET_PRODUCT through thunk if succesful or NEW_NOTIFICATION-type and error message from db in the payload
 * @param {string} productId - The id of the product to get
 * @returns {Function} - Thunk -> action
 */
export const getProduct = (productId) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: `http://localhost:3001/api/products/${productId}`,
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: GET_PRODUCT, payload: data.data});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};

/**
 * @name getProducts
 * @description Asynchronous Action creator that dispatches all the products it receives from DB to the frontends redux-stores product-state. Dispatches GET_PRODUCTS with products as payload if succesfull, or NEW_NOTIFICATION-type and error message from db in the payload
 * @returns {Function} - Thunk -> action
 */
export const getProducts = () => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: 'http://localhost:3001/api/products',
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: GET_PRODUCTS, payload: data.data});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};

/**
 * @name addProduct
 * @description Asynchronous Action creator that adds a new product to the DB, then dispatches an ADD_PRODUCT-type action with product as payload to the frontends redux-stores product-state, as well as a NEW_NOTIFICATION-type action to the frontends notification-state with the productMsg.added as a successful message. If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message. If the error itself is an object, then it should pass whatever is inside the object.
 * @param {object} productToAdd - The product to add
 * @returns {Function} - Thunk -> action
 */
export const addProduct = (productToAdd) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'POST',
			url: 'http://localhost:3001/api/products',
			data: JSON.stringify(productToAdd),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: ADD_PRODUCT, payload: data.data});
			dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:true, message: productMsg.added}});
	}
	catch(error){
		if(Object.values(error.response.data.error)[0].length > 1){
			dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: Object.values(error.response.data.error)[0]}});
		}
		else{
			dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
		}
	}
};
};

/**
 * @name updateProduct
 * @description Asynchronous Action creator that updates an existing product in the DB, then dispatches an UPDATE_PRODUCT-type action to the frontends redux-stores product-state, as well as a NEW_NOTIFICATION-type action to the frontends notification-state with the productMsg.updated as a successful message. If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {object} productToUpdate - The product with updated values
 * @returns {Function} - Thunk -> action
 */
export const updateProduct = (productToUpdate) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'PUT',
			url: `http://localhost:3001/api/products/${productToUpdate.id}`,
			data: JSON.stringify(productToUpdate),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials : true
			});
			const data = response;
			dispatch({type: UPDATE_PRODUCT, payload: data.data});
			dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:true, message: productMsg.updated}});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};

/**
 * @name deleteProduct
 * @description Asynchronous Action creator that deletes existing product in the DB, then dispatches a DELETE_PRODUCT-type action along with product as payload to the frontends redux-stores product-state, as well as a NEW_NOTIFICATION-type action to the frontends notification-state with the productMsg.deleted(product) as a successful message. If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {string} productId - The id of the product to delete
 * @returns {Function} redux thunk -> action
 */
export const deleteProduct = (productId) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'DELETE',
			url: `http://localhost:3001/api/products/${productId}`,
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			
			const data = response.data;
			dispatch({type: DELETE_PRODUCT, payload: data});
			dispatch({type: NEW_NOTIFICATION, payload:{isSuccess:true, message: productMsg.deleted(data)}});
	}
	catch(error){
		dispatch({type: NEW_NOTIFICATION, payload: {isSuccess:false, message: error.response.data.error}});
	}
};
};
