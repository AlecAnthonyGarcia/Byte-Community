import axios from 'axios';
import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

export const RESET_STATE = 'RESET_STATE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_LOGIN_MODAL_VISIBILITY = 'SET_LOGIN_MODAL_VISIBILITY';
export const SET_SIGNUP_MODAL_VISIBILITY = 'SET_SIGNUP_MODAL_VISIBILITY';

export function setAuthorizationToken(token) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
}

export function authenticate({ code }) {
	return async dispatch => {
		const response = await Api.authenticate(code);

		const { token, account } = response;
		const { token: authToken } = token;

		if (authToken) {
			localStorage.setItem('user', JSON.stringify(account));
			localStorage.setItem('authToken', authToken);
			setAuthorizationToken(token);
			dispatch(resetState());
			dispatch(setCurrentUser(account));
		}

		AnalyticsUtil.identifyUser(account);

		return authToken;
	};
}

export function logout() {
	return dispatch => {
		localStorage.removeItem('user');
		localStorage.removeItem('authToken');
		setAuthorizationToken(false);
		dispatch(resetState());
	};
}

export function resetState() {
	return {
		type: RESET_STATE
	};
}

export function setCurrentUser(user) {
	return {
		type: SET_CURRENT_USER,
		user
	};
}

export function setLoginModalVisibility(visible) {
	return {
		type: SET_LOGIN_MODAL_VISIBILITY,
		visible
	};
}

export function setSignupModalVisibility(visible) {
	return {
		type: SET_SIGNUP_MODAL_VISIBILITY,
		visible
	};
}
