import React from 'react';
import './style.scss';

import emptyTvIcon from '../static/img/empty_tv.gif';

import { Link } from 'react-router-dom';

import { Button, Icon } from 'antd';

const EmptyState = props => {
	const { message } = props;

	const ExploreBytesButton = () => {
		return (
			<Link to="/">
				<Button className="empty-state-videos-button view-bytes-button">
					<Icon type="search" style={{ fontSize: '24px', color: 'black' }} />
					Explore Bytes
				</Button>
			</Link>
		);
	};

	return (
		<div className="empty-state-videos">
			<img className="empty-tv-icon" src={emptyTvIcon} />
			<div>{message}</div>
			<ExploreBytesButton />
		</div>
	);
};

export default EmptyState;
