import { combineReducers } from 'redux';
import authReducer from '../AuthModal/authReducer';
import homeReducer from '../HomePage/homeReducer';

import { RESET_STATE } from '../AuthModal/authActions';

const appReducer = combineReducers({
	authReducer,
	homeReducer
});

const rootReducer = (state, action) => {
	if (action.type === RESET_STATE) {
		state = undefined;
	}

	return appReducer(state, action);
};

export default rootReducer;
