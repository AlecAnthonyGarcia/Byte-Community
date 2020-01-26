import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import UserAvatar from '../UserAvatar';

const UserList = props => {
	const { users } = props;

	return users.map(user => {
		const { avatarURL, username, displayName } = user;

		return (
			<Link to={`/user/${username}`}>
				<div className="user-info-container">
					<UserAvatar src={avatarURL} className="user-avatar" />
					<div className="user-name-container">
						<div className="user-name">{displayName}</div>
						<div className="user-username">{`@${username}`}</div>
					</div>
				</div>
			</Link>
		);
	});
};

export default UserList;
