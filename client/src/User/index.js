import React from 'react';
import './style.scss';

import UserAvatar from '../UserAvatar';
import BetaBadge from '../BetaBadge';

import moment from 'moment';

const User = props => {
	const { user } = props;
	const {
		avatarURL,
		bio,
		username,
		displayName,
		backgroundColor,
		foregroundColor,
		registrationDate
	} = user;

	return (
		<div
			className="user-container"
			style={{ background: backgroundColor, color: foregroundColor }}
		>
			<div className="user-info-container">
				<UserAvatar className="user-avatar" src={avatarURL} />
				<h1 style={{ color: foregroundColor }} className="user-display-name">
					{displayName}
				</h1>
				<span className="user-username">
					{username}
					<BetaBadge
						registrationDate={registrationDate}
						color={foregroundColor}
					/>
				</span>

				<p className="user-bio">{bio}</p>
				<span>joined {moment.unix(registrationDate).fromNow()}</span>
			</div>
		</div>
	);
};

export default User;
