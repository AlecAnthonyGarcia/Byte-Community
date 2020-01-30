import {
	SET_CURRENT_USER,
	SET_LOGIN_MODAL_VISIBILITY,
	SET_SIGNUP_MODAL_VISIBILITY
} from './authActions';

const DEFAULT_STATE = {
	isAuthenticated: false,
	isLoginModalOpen: false,
	isSignupModalOpen: false,
	user: {}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !!Object.keys(action.user).length,
				user: action.user
			};
		case SET_LOGIN_MODAL_VISIBILITY:
			return {
				...state,
				isLoginModalOpen: action.visible
			};
		case SET_SIGNUP_MODAL_VISIBILITY:
			return {
				...state,
				isSignupModalOpen: action.visible
			};
		default:
			return state;
	}
};
