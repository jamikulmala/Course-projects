

import {
	CLEAR_USERS,
	GET_USER,
	GET_USERS,
	REMOVE_USER,
	UPDATE_USER,
} from '../../tests/constants/redux.js';

/**
 * @name usersReducer
 * @description Implement productsReducer that handles following cases:
 * 1) GET_USER: adds the single user to an empty state.
 * 2) GET_USERS: Adds the users to the empty state
 * 3) CLEAR_USERS: Clears all users from the state
 * 4) UPDATE_USER: Updates the user in the state and places it as its last entry.
 * 5) REMOVE_USER: Removes the user from the state.
 * @param {Array} state old state of products.
 * @param {object} action the action that calls the reducer.
 * @returns {Array} new state for products
 */
const usersReducer = (state = [], action) => {
	if(action.type === GET_USER){
		const user = state.find((item) => item.id === action.payload.id);
    if (user) {
        return state;
    } else {
        state.push({ ...action.payload });
    }
	}
	else if(action.type === GET_USERS){
		state.push(...action.payload);
	}
	else if(action.type === CLEAR_USERS){
		return state = [];
	}
	else if(action.type === UPDATE_USER){
		return state.map(user => {
            if(user.id === action.payload.id){
                return action.payload;
            }
            return user;
        });

	}
	else if(action.type === REMOVE_USER){
		return state.filter(user => user.id !== action.payload.id);
	}
	return state;
};

export default usersReducer;
