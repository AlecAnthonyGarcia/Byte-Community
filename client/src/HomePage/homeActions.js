import Api from '../utils/Api';

export const SET_LIKE_COUNT = 'SET_LIKE_COUNT';
export const SET_FOLLOWED = 'SET_FOLLOWED';
export const SET_FOLLOWS_MAP = 'SET_FOLLOWS_MAP';
export const SET_LIKES_MAP = 'SET_LIKES_MAP';

export function likePost(postId, currentLikeCount) {
	return async dispatch => {
		const response = await Api.likePost(postId);

		dispatch(setLikeCount(postId, currentLikeCount + 1, true));

		return response;
	};
}

export function unlikePost(postId, currentLikeCount) {
	return async dispatch => {
		const response = await Api.unlikePost(postId);

		dispatch(setLikeCount(postId, currentLikeCount - 1, false));

		return response;
	};
}

export function followUser(userId) {
	return async dispatch => {
		const response = await Api.followUser(userId);

		dispatch(setFollowed(userId, true));

		return response;
	};
}

export function unfollowUser(userId) {
	return async dispatch => {
		const response = await Api.unfollowUser(userId);

		dispatch(setFollowed(userId, false));

		return response;
	};
}

export function setFollowsMap(accounts) {
	let followsMap = {};

	for (const userId in accounts) {
		const account = accounts[userId];
		const { isFollowing } = account || {};
		followsMap[userId] = isFollowing;
	}

	return {
		type: SET_FOLLOWS_MAP,
		payload: {
			followsMap
		}
	};
}

export function setLikesMap(posts) {
	let likesMap = {};

	posts.forEach(post => {
		const { id: postId, likedByMe, likeCount } = post;
		likesMap[postId] = {
			likedByMe,
			likeCount
		};
	});

	return {
		type: SET_LIKES_MAP,
		payload: {
			likesMap
		}
	};
}

export function setLikeCount(postId, count, likedByMe) {
	return {
		type: SET_LIKE_COUNT,
		payload: {
			postId,
			count,
			likedByMe
		}
	};
}

export function setFollowed(userId, isFollowing) {
	return {
		type: SET_FOLLOWED,
		payload: {
			userId,
			isFollowing
		}
	};
}
