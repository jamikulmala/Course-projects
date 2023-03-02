
import {
	CLEAR_ORDERS,
	CLEAR_USERS,
	INIT_AUTH,
	NEW_NOTIFICATION,
	REMOVE_AUTH,
	authMsg,
	invalidAuthMsg,
} from '../../tests/constants/redux';
import { createNotification } from './notificationsActions';
import axios from 'axios';

//You can use this  regex for email validation, taken from here: https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
const validEmailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//AUTH (THUNK) ACTION CREATORS
/**
 *@name initAuth
 * @description Asynchronous thunk that uses backends /api/check-status path to check whether or not there is the correct browser-cookie and whether or not that browser-cookie is valid. If it's succesful, Dispatches
 * 1) INIT_AUTH with user as payload.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull message.
 * @returns {Function} action
 */

export const initAuth = () => {
	
	return async (dispatch) => {
		try{
			const response = await axios({ 
			method: 'GET',
			url: 'http://localhost:3001/api/check-status',
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
			});
			
			const data = response.data;
			dispatch({type: INIT_AUTH, payload: data.user});
		}
	catch(error){
		dispatch({type:NEW_NOTIFICATION, payload:{isSuccess:false, message: error.response.data.error}});
	}
};
};
/**
 * @name logIn
 * @description When used, creates an action that awaits for a successful login-response from server, before dispatches the received credentials as payload to the reducers.
 * Light validation of the loginCreds is done before sending the request to the server.
 * The light validation checks:
 * 1. Invalid email: dispatches NEW_NOTIFICATION with error message invalidAuthMsg.email
 * 2. Password < 10: dispatches NEW_NOTIFICATION with error message invalidAuthMsg.password
 * If validation succeeds, dispatches
 * 1) INIT_AUTH with user as payload
 * 2) succesfull notification with authMsg.welcomeBack as message.
 * If the response is not ok, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull notification.
 * @param {object} logInCreds - The credentials used to login, contains username and password
 * @returns {Function} action
 */

export const logIn = (logInCreds) => {
	return async (dispatch) => {
		const passLength = logInCreds.password.length; 
		if(!validEmailRegex.test(logInCreds.email)){
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: invalidAuthMsg.email}});
			return;
		}
		else if(10 > passLength){
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: invalidAuthMsg.password}});
			return;
		}
		else{
			try{
			const response = await axios({ 
			method: 'POST',
			url: 'http://localhost:3001/api/login',
			data: JSON.stringify(logInCreds),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			withCredentials : true
			});

			const data = response.data;
			dispatch({type: INIT_AUTH, payload: data.user});
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: true, message: authMsg.welcomeBack}});
		}
		catch (error){
				dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: error.response.data.error}});
			}
		}
	};
};

/**
 * @name logOut
 * @description Asynchronous thunk that awaits for a successful logout-response from server, before dispatches
 * the actions with types of
 * 1) REMOVE_AUTH,
 * 2) CLEAR_ORDERS and
 * 3) CLEAR_USERS as well as
 * 4) NEW_NOTIFICATION with succesfull message from the backend as payload to the reducers.
 * @returns {Function} action
 */
export const logOut = () => {
	return async (dispatch) => {
		await axios({ 
			method: 'GET',
			url: 'http://localhost:3001/api/logout',
			headers: {
				Accept: 'application/json'
			},
			withCredentials : true
		});
		await dispatch({type: REMOVE_AUTH});
		await dispatch({type: CLEAR_ORDERS});
		await dispatch({type: CLEAR_USERS});
		await dispatch({type: NEW_NOTIFICATION, payload: {isSuccess : true, message : "Logged out."}});
	};
};

/**
 * @name register
 * @description Asynchronous thunk that handles registeration events. Handles validation for registerCreds (check Login and Registration validation from assignment instructions).
 * Validation checks:
 * 1. Invalid email: dispatches NEW_NOTIFICATION with error message invalidAuthMsg.email
 * 2. Password < 10: dispatches NEW_NOTIFICATION with error message invalidAuthMsg.password
 * 3. name < 3: dispatches NEW_NOTIFICATION with error message invalidAuthMsg.name
 * 4. password missmatch: dispatches NEW_NOTIFICATION with error message invalidAuthMsg.passwordConfirmation
 *
 * If the validation succeeds, the registerCreds are sent to the server. If the response is ok, Dispatches
 * 1) an INIT_AUTH-type action to reducers with the received user as payload.
 * 2) a successful NEW_NOTIFICATION-type action to reducers with validAuth.welcome(name) as message.
 *
 *  If the server responds with an error, it only dispatches a NEW_NOTIFICATION-type action to the frontends notification state along with the error message from db as an unsuccessfull notification. If the error itself is an object, then it should pass whatever is inside the object.
 * @param {object} registerCreds - The data of the user
 * @returns {Function} action
 */
export const register = (registerCreds) => {
	return async (dispatch) => {
		if(!validEmailRegex.test(registerCreds.email)){
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: invalidAuthMsg.email}});
			return;
		}
		else if(10 > registerCreds.password.length){
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: invalidAuthMsg.password}});
			return;
		}
		else if(3 > registerCreds.name.length){
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: invalidAuthMsg.name}});
			return;
		}
		else if(registerCreds.password !== registerCreds.passwordConfirmation){
			dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: invalidAuthMsg.passwordConfirmation}});
			return;
		}

		else{
			try{
				const response = await axios({ 
				method: 'POST',
				url: 'http://localhost:3001/api/register',
				data: JSON.stringify(registerCreds),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				withCredentials : true
				});
	
				const data = response;
				dispatch({type: INIT_AUTH, payload: data.data.user});
				dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: true, message: `Welcome to my store, ${data.data.user.name}!`}});
			}
			catch (error){
					dispatch({type: NEW_NOTIFICATION, payload: {isSuccess: false, message: error.response.data.error.email}});
				}
		}
	};
};
