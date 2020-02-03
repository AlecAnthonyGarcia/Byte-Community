const BASE_API = 'https://api.byte.co/';
const ACTIVITY_API = `${BASE_API}activity`;
const ACCOUNT_API = `${BASE_API}account/`;
const AUTHENTICATE_API = `${BASE_API}authenticate/google`;
const CATEGORY_API = `${BASE_API}categories/`;
const EXPLORE_API = `${BASE_API}explore`;
const FEED_API = `${BASE_API}feed/`;
const FEEDBACK_API = `${BASE_API}feedback/`;
const POST_API = `${BASE_API}post/`;
const TIMELINE_API = `${BASE_API}timeline`;

const GOOGLE_AUTH_API = 'https://oauth2.googleapis.com/token';
const GOOGLE_CLIENT_ID =
	'236591221969-rgvearthmh0mq7bf3atnne07e6jsqmbf.apps.googleusercontent.com';

const Constants = {
	ACTIVITY_API,
	ACCOUNT_API,
	AUTHENTICATE_API,
	CATEGORY_API,
	EXPLORE_API,
	FEED_API,
	FEEDBACK_API,
	GOOGLE_AUTH_API,
	GOOGLE_CLIENT_ID,
	POST_API,
	TIMELINE_API
};

module.exports = Constants;
