import React from 'react';
import './style.scss';

import { connect } from 'react-redux';

import { followUser, unfollowUser } from '../HomePage/homeActions';

import { Button, Icon } from 'antd';

const FollowButton = props => {
	const { auth, user, followsMap, authedUser } = props;
	const { id: userId, backgroundColor, foregroundColor } = user;

	const isFollowing = followsMap[userId];
	const { id: authedUserId } = authedUser;

	const onFollowButtonClick = (e, userId) => {
		e.preventDefault();

		const { followUser, unfollowUser } = props;

		if (isFollowing) {
			unfollowUser(userId);
		} else {
			followUser(userId);
		}
	};

	if (!auth || (authedUserId && authedUserId === userId)) {
		return null;
	}

	return (
		<Button
			className="follow-button"
			style={{ backgroundColor: foregroundColor, color: backgroundColor }}
			shape="round"
			onClick={e => onFollowButtonClick(e, userId)}
		>
			<Icon
				type={isFollowing ? 'check-circle' : 'user-add'}
				style={{
					fontSize: '24px',
					color: backgroundColor
				}}
			/>
			{isFollowing ? 'Following' : 'Follow'}
		</Button>
	);
};

function mapStateToProps(state) {
	const { authReducer, homeReducer } = state;
	const { isAuthenticated, user } = authReducer;
	const { followsMap } = homeReducer;
	return {
		auth: isAuthenticated,
		authedUser: user,
		followsMap
	};
}

export default connect(mapStateToProps, {
	followUser,
	unfollowUser
})(FollowButton);
