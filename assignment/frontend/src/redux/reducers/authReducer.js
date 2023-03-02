

import { INIT_AUTH, REMOVE_AUTH } from '../../tests/constants/redux.js';

/**
 * @name authReducer
 * @description Implement authReducer that handles following cases:
 * 1) INIT_AUTH: returns the actions payload
 * 2) REMOVE_AUTH: replaces current auth details with guest-role.
 * @param {object} state old state of auth.
 * @param {object} action the action that calls the reducer.
 * @returns {object} new state for auth
 */
const authReducer = (state = {}, action) => {
    if(action.type === INIT_AUTH){
        state = action.payload;
    }
    else if(action.type === REMOVE_AUTH){
        const guest = {
            role : "guest"
        };
        state = guest;
    }
    return state;
};

export default authReducer;
