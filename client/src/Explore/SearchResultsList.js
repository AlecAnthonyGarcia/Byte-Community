import React from 'react';
import './style.scss';

import { Tabs } from 'antd';

import UserList from '../UserList';
import HashtagList from '../HashtagList';

import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

const { TabPane } = Tabs;

class SearchResultsList extends React.Component {
	state = {
		users: [],
		hashtags: [],
		activeTabKey: '1'
	};

	componentDidMount() {
		const { query } = this.props;
		this.searchUser(query);
	}

	searchUser = async (query) => {
		const response = await Api.searchUser(query);

		const { accounts: users } = response;

		this.setState({ users });

		AnalyticsUtil.track(
			'Search',
			{
				query,
				type: 'user'
			},
			true
		);
	};

	searchHashtag = async (query) => {
		const response = await Api.searchHashtag(query);

		const { hashtags } = response;

		this.setState({ hashtags });

		AnalyticsUtil.track(
			'Search',
			{
				query,
				type: 'hashtag'
			},
			true
		);
	};

	onTabChange = (activeTabKey) => {
		const { query } = this.props;

		this.setState({ activeTabKey });

		switch (activeTabKey) {
			case '1':
				this.searchUser(query);
				break;
			case '2':
				this.searchHashtag(query);
				break;
			default:
		}
	};

	onResultClicked = () => {
		const { onResultClicked } = this.props;

		if (onResultClicked) {
			onResultClicked();
		}
	};

	render() {
		const { activeTabKey, hashtags, users } = this.state;

		return (
			<Tabs
				className="explore-search-results-container"
				defaultActiveKey="1"
				activeKey={activeTabKey}
				onChange={this.onTabChange}
			>
				<TabPane tab="People" key="1">
					<UserList users={users} onUserClick={this.onResultClicked} />
				</TabPane>
				<TabPane tab="Hashtags" key="2">
					<HashtagList
						hashtags={hashtags}
						onHashtagClick={this.onResultClicked}
					/>
				</TabPane>
			</Tabs>
		);
	}
}

export default SearchResultsList;
