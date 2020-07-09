import React from 'react';
import './style.scss';

import logo from '../static/img/logo.png';
import emptyTvIcon from '../static/img/empty_tv.gif';

import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';

import { Button, Icon } from 'antd';

const EmptyState = (props) => {
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
			<MediaQuery maxWidth={992}>
				<Link to="/">
					<img className="logo" src={logo} alt="byte logo" />
				</Link>
			</MediaQuery>
			<img className="empty-tv-icon" src={emptyTvIcon} alt="" />
			<div>{message}</div>
			<ExploreBytesButton />
		</div>
	);
};

export default EmptyState;
