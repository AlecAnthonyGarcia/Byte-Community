const axios = require('axios');

const {
	ACCOUNT_API,
	CATEGORY_API,
	EXPLORE_API,
	FEED_API,
	POST_API
} = require('./Constants');

axios.defaults.headers.common['Authorization'] = ''; // TODO: add your own authorization token

async function getUser(userId) {
	const response = await axios.get(`${ACCOUNT_API}id/${userId}`);
	const { data } = response;
	return data;
}

async function searchUser(query) {
	const response = await axios.get(`${ACCOUNT_API}prefix/${query}`);
	const { data } = response;
	return data;
}

async function getUserPosts(userId, cursor) {
	let url = `${ACCOUNT_API}id/${userId}/posts`;
	if (cursor) {
		url = `${url}?cursor=${cursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getUserRebytes(userId, cursor) {
	let url = `${ACCOUNT_API}id/${userId}/rebytes`;
	if (cursor) {
		url = `${url}?cursor=${cursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getPost(postId) {
	const response = await axios.get(`${POST_API}id/${postId}`);
	const { data } = response;
	return data;
}

async function getPostComments(postId, cursor) {
	let url = `${POST_API}id/${postId}/feedback/comment`;
	if (cursor) {
		url = `${url}?cursor=${cursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getPostLikes(postId, cursor) {
	let url = `${POST_API}id/${postId}/feedback/like`;
	if (cursor) {
		url = `${url}?cursor=${cursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getPopularFeed(cursor) {
	return await getFeed(`${FEED_API}popular/v2`, cursor);
}

async function getPopular2Feed(cursor) {
	return await getFeed(`${FEED_API}popular/v3`, cursor);
}

async function getLatestFeed(cursor) {
	return await getFeed(`${FEED_API}global`, cursor);
}

async function getFeed(url, cursor) {
	if (cursor) {
		url = `${url}?cursor=${cursor}`;
	}
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

async function getCategoryFeed(categoryName, sort, cursor) {
	let url = `${CATEGORY_API}${categoryName}/${sort}`;
	if (cursor) {
		url = `${url}?cursor=${cursor}`;
	}
	try {
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		return {
			data: {
				posts: []
			}
		};
	}
}

async function getExploreCategories() {
	const response = await axios.get(`${EXPLORE_API}`);
	const { data } = response;
	return data;
}

const Api = {
	getUser,
	searchUser,
	getUserPosts,
	getUserRebytes,
	getPost,
	getPostComments,
	getPostLikes,
	getPopularFeed,
	getPopular2Feed,
	getLatestFeed,
	getCategoryFeed,
	getExploreCategories
};

module.exports = Api;
