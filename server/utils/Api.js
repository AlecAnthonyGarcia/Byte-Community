const axios = require('axios');
const querystring = require('querystring');

const {
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
} = require('./Constants');

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

async function getTimeline(cursor) {
	return await getFeed(TIMELINE_API, cursor);
}

async function getPopularFeed(cursor) {
	return await getFeed(`${FEED_API}popular/v2`, cursor);
}

async function getPopular2Feed(cursor) {
	return await getFeed(`${FEED_API}popular/v3`, cursor);
}

async function getLatestFeed(cursor) {
	return await getFeed(`${FEED_API}latest`, cursor);
}

async function getMixFeed(cursor) {
	return await getFeed(`${FEED_API}mix`, cursor);
}

async function getPicksFeed(pickId, cursor) {
	return await getFeed(`${FEED_API}picks/${pickId}`, cursor);
}

async function getActivity(cursor) {
	return await getFeed(ACTIVITY_API, cursor);
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

async function getMe() {
	try {
		const { data } = await axios.get(`${ACCOUNT_API}/me`);
		return data;
	} catch (err) {
		return { data: {} };
	}
}

async function getGoogleToken(googleCode) {
	try {
		const response = await axios({
			url: GOOGLE_AUTH_API,
			method: 'post',
			data: querystring.encode({
				client_id: GOOGLE_CLIENT_ID,
				code: googleCode,
				grant_type: 'authorization_code',
				redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
			})
		});

		const { data } = response;
		const { id_token } = data;
		return id_token;
	} catch (err) {
		return null;
	}
}

async function authenticate(googleCode) {
	try {
		const googleToken = await getGoogleToken(googleCode);

		let response = await axios.post(AUTHENTICATE_API, {
			token: googleToken
		});

		const { data } = response;
		const { error } = data;

		if (error) {
			response = {
				data: {
					...data,
					googleToken
				}
			};
		}

		return response;
	} catch (err) {
		return { data: { token: {} } };
	}
}

async function register(username, googleToken) {
	try {
		const response = await axios.post(`${ACCOUNT_API}register`, {
			username,
			token: googleToken,
			service: 'google',
			inviteCode: 'NA'
		});

		return response;
	} catch (err) {
		return { data: { token: {} } };
	}
}

async function likePost(postId, isLike) {
	try {
		const response = await axios({
			url: `${POST_API}id/${postId}/feedback/like`,
			method: isLike ? 'put' : 'delete',
			data: {
				postId
			}
		});

		const { data } = response;
		return data;
	} catch (err) {
		return { data: {} };
	}
}

async function followUser(accountId, isFollow) {
	try {
		const response = await axios({
			url: `${ACCOUNT_API}id/${accountId}/follow`,
			method: isFollow ? 'put' : 'delete',
			data: {
				accountId
			}
		});

		const { data } = response;
		return data;
	} catch (err) {
		return { data: {} };
	}
}

async function postComment(postID, body) {
	try {
		const response = await axios({
			url: `${POST_API}id/${postID}/feedback/comment`,
			method: 'post',
			data: {
				body,
				postID
			}
		});

		const { data } = response;
		return data;
	} catch (err) {
		return { data: {} };
	}
}

async function deleteComment(commentID) {
	try {
		const response = await axios({
			url: `${FEEDBACK_API}comment/id/${commentID}`,
			method: 'delete',
			data: {
				commentID
			}
		});

		const { data } = response;
		return data;
	} catch (err) {
		return { data: {} };
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
	getTimeline,
	getPopularFeed,
	getPopular2Feed,
	getLatestFeed,
	getMixFeed,
	getPicksFeed,
	getCategoryFeed,
	getExploreCategories,
	getMe,
	getGoogleToken,
	authenticate,
	register,
	likePost,
	followUser,
	postComment,
	deleteComment,
	getActivity
};

module.exports = Api;
