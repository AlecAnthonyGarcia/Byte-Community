import React from 'react';
import './style.scss';

import { Link, withRouter } from 'react-router-dom';
import { Button, Icon, Spin } from 'antd';

import UserAvatar from '../UserAvatar';
import BetaBadge from '../BetaBadge';

import moment from 'moment';
import RebyteIcon from '../RebyteIcon';
import LoopsIcon from '../LoopsIcon';

const User = props => {
	const {
		loading,
		user,
		match: { path }
	} = props;
	const {
		avatarURL,
		bio,
		username,
		displayName,
		backgroundColor,
		foregroundColor,
		registrationDate
	} = user || {};

	const ViewBytesButton = () => {
		if (path.startsWith('/post/') || path.endsWith('/rebytes')) {
			return (
				<Link to={`/user/${username}`}>
					<Button
						className="view-bytes-button"
						style={{ backgroundColor: foregroundColor, color: backgroundColor }}
					>
						<Icon
							component={LoopsIcon}
							style={{
								fontSize: '24px',
								textAlign: 'left',
								color: backgroundColor
							}}
						/>
						View Bytes
					</Button>
				</Link>
			);
		}
		return null;
	};

	const ViewRebytesButton = () => {
		if (
			path.startsWith('/post/') ||
			(path.startsWith('/user/') && !path.endsWith('/rebytes'))
		) {
			return (
				<Link to={`/user/${username}/rebytes`}>
					<Button
						className="view-bytes-button"
						style={{ backgroundColor: foregroundColor, color: backgroundColor }}
					>
						<Icon
							component={RebyteIcon}
							style={{
								fontSize: '24px',
								textAlign: 'left',
								color: backgroundColor
							}}
						/>
						View Rebytes
					</Button>
				</Link>
			);
		}
		return null;
	};

	return (
		<div
			className="user-container"
			style={{ background: backgroundColor, color: foregroundColor }}
		>
			<div className="user-info-container">
				<Spin spinning={loading}></Spin>
				{!loading && <UserAvatar className="user-avatar" src={avatarURL} />}
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

				{!loading && (
					<div className="action-buttons-container">
						<ViewBytesButton />
						<ViewRebytesButton />
					</div>
				)}
			</div>
		</div>
	);
};

export default withRouter(User);
