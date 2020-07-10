import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';

import { ConfigProvider, List } from 'antd';

import AnalyticsUtil from '../utils/AnalyticsUtil';

const HashtagList = (props) => {
	const { hashtags, onHashtagClick } = props;

	const onListItemClick = (hashtag) => {
		if (onHashtagClick) {
			onHashtagClick();
		}
		AnalyticsUtil.track('Search List Item Clicked', { hashtag }, true);
	};

	const ListEmptyState = () => (
		<div className="empty-state-container">
			<p>Nothing to see here yet...</p>
		</div>
	);

	return (
		<ConfigProvider renderEmpty={ListEmptyState}>
			<List
				className="hashtag-list"
				dataSource={hashtags}
				renderItem={(hashtag) => {
					return (
						<Link
							to={`/hashtag/${hashtag}`}
							onClick={() => onListItemClick(hashtag)}
							key={hashtag}
						>
							<div className="hashtag-container">{`# ${hashtag}`}</div>
						</Link>
					);
				}}
			></List>
		</ConfigProvider>
	);
};

export default HashtagList;
