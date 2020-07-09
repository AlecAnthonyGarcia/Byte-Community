import React from 'react';
import './style.scss';

import { Link, withRouter } from 'react-router-dom';
import { Button, Icon, Spin } from 'antd';

import RebyteIcon from '../RebyteIcon';
import LoopsIcon from '../LoopsIcon';
import UserAvatar from '../UserAvatar';
import BetaBadge from '../BetaBadge';
import FollowButton from '../FollowButton';

import moment from 'moment';
import AnalyticsUtil from '../utils/AnalyticsUtil';

const User = (props) => {
	const {
		loading,
		user,
		match: { path },
		isPageScrollLocked
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
		const onViewBytesButtonClick = () => {
			AnalyticsUtil.track(
				'View Bytes Button Click',
				{
					username
				},
				true
			);
		};

		if (path.startsWith('/post/') || path.endsWith('/rebytes')) {
			return (
				<Link to={`/user/${username}`}>
					<Button
						className="view-bytes-button"
						style={{ backgroundColor: foregroundColor, color: backgroundColor }}
						onClick={onViewBytesButtonClick}
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
		const onViewRebytesButtonClick = () => {
			AnalyticsUtil.track(
				'View Rebytes Button Click',
				{
					username
				},
				true
			);
		};

		if (
			path.startsWith('/post/') ||
			(path.startsWith('/user/') && !path.endsWith('/rebytes'))
		) {
			return (
				<Link to={`/user/${username}/rebytes`}>
					<Button
						className="view-bytes-button"
						style={{ backgroundColor: foregroundColor, color: backgroundColor }}
						onClick={onViewRebytesButtonClick}
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
			style={{
				display: isPageScrollLocked ? 'none' : 'flex',
				background: backgroundColor,
				color: foregroundColor
			}}
		>
			<div className="user-info-container">
				<Spin spinning={loading}></Spin>
				{!loading && <UserAvatar className="user-avatar" src={avatarURL} />}

				<h1 style={{ color: foregroundColor }} className="user-display-name">
					{displayName}
				</h1>

				{!loading && <FollowButton user={user} />}

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
