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
	try {
		const { data } = await axios.get(`${ACCOUNT_API}id/${userId}`);
		return data;
	} catch (err) {
		return { data: {} };
	}
}

async function searchUser(query) {
	try {
		const { data } = await axios.get(`${ACCOUNT_API}prefix/${query}`);
		const { error } = data;

		if (error) {
			return {
				data: { accounts: [] }
			};
		} else {
			return data;
		}
	} catch (err) {
		return { data: { accounts: [] } };
	}
}

async function getUserPosts(userId, cursor) {
	return await getFeed(`${ACCOUNT_API}id/${userId}/posts`, cursor);
}

async function getUserRebytes(userId, cursor) {
	return await getFeed(`${ACCOUNT_API}id/${userId}/rebytes`, cursor);
}

async function getPost(postId) {
	try {
		const { data } = await axios.get(`${POST_API}id/${postId}`);
		return data;
	} catch (err) {
		return { data: {} };
	}
}

async function getPostComments(postId, cursor) {
	try {
		let url = `${POST_API}id/${postId}/feedback/comment`;
		if (cursor) {
			url = `${url}?cursor=${cursor}`;
		}
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		return { data: { comments: [] } };
	}
}

async function getPostLikes(postId, cursor) {
	try {
		let url = `${POST_API}id/${postId}/feedback/like`;
		if (cursor) {
			url = `${url}?cursor=${cursor}`;
		}
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		return { data: { accounts: [] } };
	}
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
	try {
		if (cursor) {
			url = `${url}?cursor=${cursor}`;
		}
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		return { data: { posts: [] } };
	}
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
	try {
		const { data } = await axios.get(`${EXPLORE_API}`);
		return data;
	} catch (err) {
		return { data: { layout: [] } };
	}
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
