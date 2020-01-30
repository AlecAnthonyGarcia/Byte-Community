import {
	SET_LIKE_COUNT,
	SET_FOLLOWED,
	SET_FOLLOWS_MAP,
	SET_LIKES_MAP
} from './homeActions';

const DEFAULT_STATE = {
	likesMap: {},
	followsMap: {}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_LIKE_COUNT: {
			const { likesMap } = state;
			const { postId, count: likeCount, likedByMe } = action.payload;

			return {
				...state,
				likesMap: {
					...likesMap,
					[postId]: {
						likedByMe,
						likeCount
					}
				}
			};
		}
		case SET_FOLLOWS_MAP: {
			const { followsMap } = state;
			const { followsMap: newFollowsMap } = action.payload;

			return {
				...state,
				followsMap: {
					...followsMap,
					...newFollowsMap
				}
			};
		}
		case SET_FOLLOWED: {
			const { followsMap } = state;
			const { userId, isFollowing } = action.payload;

			return {
				...state,
				followsMap: {
					...followsMap,
					[userId]: isFollowing
				}
			};
		}
		case SET_LIKES_MAP: {
			const { likesMap } = state;
			const { likesMap: newLikesMap } = action.payload;

			return {
				...state,
				likesMap: {
					...likesMap,
					...newLikesMap
				}
			};
		}
		default:
			return state;
	}
};
