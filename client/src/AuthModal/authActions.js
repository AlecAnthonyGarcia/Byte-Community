import axios from 'axios';
import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

export const RESET_STATE = 'RESET_STATE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_LOGIN_MODAL_VISIBILITY = 'SET_LOGIN_MODAL_VISIBILITY';
export const SET_SIGNUP_MODAL_VISIBILITY = 'SET_SIGNUP_MODAL_VISIBILITY';
export const SET_GOOGLE_TOKEN = 'SET_GOOGLE_TOKEN';

export function setAuthorizationToken(token) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
}

function handleAuth(response, dispatch) {
	const { data } = response;
	const { token, account } = data || {};

	if (token) {
		const { token: authToken } = token;

		localStorage.setItem('user', JSON.stringify(account));
		localStorage.setItem('authToken', authToken);

		setAuthorizationToken(authToken);
		dispatch(resetState());
		dispatch(setCurrentUser(account));

		AnalyticsUtil.identifyUser(account);
	}
}

export function authenticate({ code }) {
	return async dispatch => {
		const response = await Api.authenticate(code);

		handleAuth(response, dispatch);

		return response;
	};
}

export function register({ username, googleToken }) {
	return async dispatch => {
		const response = await Api.register(username, googleToken);

		handleAuth(response, dispatch);

		return response;
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

export function setGoogleToken(googleToken) {
	return {
		type: SET_GOOGLE_TOKEN,
		googleToken
	};
}
