

// USERS ACTION CREATORS
import axios from 'axios';
import {
	GET_USER,
	GET_USERS,
	NEW_NOTIFICATION,
	REMOVE_USER,
	UPDATE_USER,
	userMsg,
} from '../../tests/constants/redux.js';

/**
 * @name getUser
 * @description Asynchronous action creator that gets a single user from the backend (if possible) and sends that through thunk to the reducers.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {string} userId - The users id that is to be fetched.
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const getUser = (userId) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: `http://localhost:3001/api/users/${userId}`,
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			const data = response.data;
			dispatch({type: GET_USER, payload: data});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};
/**
 * @name getUsers
 * @description Asynchronous action creator that gets all the users from the backend (if possible) and sends that Array through thunk to the reducers.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const getUsers = () => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: 'http://localhost:3001/api/users',
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			const data = response.data;
			dispatch({type: GET_USERS, payload: data});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};
/**
 * @name updateUser
 * @description Asynchronous action creator that updates the given user (if possible) and sends the user received from the backend through thunk to reducers.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {object} updatedUser - contains the updated user data
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const updateUser = (updatedUser) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'PUT',
			url: `http://localhost:3001/api/users/${updatedUser.id}`,
			data: JSON.stringify(updatedUser),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials : true
			});
			const data = response.data;
			dispatch({type: UPDATE_USER, payload: data});
			dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:true, message: userMsg.update}});
	}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};
/**
 * @name removeUser
 * @description Removes the user (if possible) from the backend, then dispatches an action to remove it from the redux-store, as well as another action to notify the current user that the deletion was succesfull.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @param {string} userId- The users id that is to be fetched
 * @returns {Function} - For the thunk to then dispatch as an object (ie the action).
 */
export const removeUser = (userId) => {
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'DELETE',
			url: `http://localhost:3001/api/users/${userId}`,
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			
			const data = response.data;
			dispatch({type: REMOVE_USER, payload: data});
			dispatch({type: NEW_NOTIFICATION, payload:{isSuccess:true, message: userMsg.delete(data)}});
	}
	catch(error){
		dispatch({type: NEW_NOTIFICATION, payload: {isSuccess:false, message: error.response.data.error}});
	}
};
};
