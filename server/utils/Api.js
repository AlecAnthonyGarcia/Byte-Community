const axios = require('axios');

const { ACCOUNT_API, EXPLORE_API, FEED_API, POST_API } = require('./Constants');

axios.defaults.headers.common['Authorization'] = ''; // TODO: add your own authorization token

async function getUser(userId) {
	const response = await axios.get(`${ACCOUNT_API}id/${userId}`);
	const { data } = response;
	return data;
}

async function getPosts(userId) {
	const response = await axios.get(`${ACCOUNT_API}id/${userId}/posts`);
	const { data } = response;
	return data;
}

async function getPost(postId) {
	const response = await axios.get(`${POST_API}id/${postId}`);
	const { data } = response;
	return data;
}

async function getPopularFeed() {
	const response = await axios.get(`${FEED_API}popular/v2`);
	const { data } = response;
	return data;
}

async function getExploreCategories() {
	const response = await axios.get(`${EXPLORE_API}`);
	const { data } = response;
	return data;
}

const Api = {
	getUser,
	getPosts,
	getPost,
	getPopularFeed,
	getExploreCategories
};

module.exports = Api;
