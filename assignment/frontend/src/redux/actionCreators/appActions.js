

import { initAuth, logOut } from './authActions';
import { initCart } from './cartActions';

/**
 * @name initApp
 * @description Action creator that initiates the app.  Dispatches initCart-action and initAuth-action.
 * @returns {Function} thunk
 */
export const initApp = () => {
	return (dispatch) => {
		dispatch(initCart());
		dispatch(initAuth());
	};
};
