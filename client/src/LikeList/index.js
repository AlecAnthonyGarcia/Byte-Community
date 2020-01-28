import React from 'react';

import { Link } from 'react-router-dom';

import { ConfigProvider, List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import UserAvatar from '../UserAvatar/index.js';

import Api from '../utils/Api';

class LikeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			likes: [],
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			cursor: null
		};
	}

	componentDidMount() {
		this.getPostLikes();
	}

	getPostLikes = async () => {
		const { likes, cursor } = this.state;
		const { post } = this.props;
		const { id: postId } = post;

		const response = await Api.getPostLikes(postId, cursor);

		const { accounts: newLikes, cursor: newCursor } = response;

		this.setState({
			loading: false,
			isFirstLoad: false,
			likes: likes.concat(newLikes || []),
			cursor: newCursor,
			hasMore: newCursor ? true : false
		});
	};

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getPostLikes();
	};

	onListItemClick = () => {
		const { onListItemClick } = this.props;

		if (onListItemClick) {
			onListItemClick();
		}
	};

	render() {
		const { isFirstLoad, loading, hasMore, likes } = this.state;

		const ListEmptyState = () => (
			<div className="empty-state-container">
				<p>Nobody here...</p>
			</div>
		);

		return (
			<div className="comments-overlay-tab-list">
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
					<ConfigProvider renderEmpty={ListEmptyState}>
						<List
							dataSource={likes}
							loading={loading}
							renderItem={item => {
								const { avatarURL, username, displayName } = item;

								return (
									<Link to={`/user/${username}`} onClick={this.onListItemClick}>
										<div className="user-info-container">
											<UserAvatar src={avatarURL} className="user-avatar" />
											<div className="user-name-container">
												<div className="user-name">{displayName}</div>
												<div className="user-username">{`@${username}`}</div>
											</div>
										</div>
									</Link>
								);
							}}
						>
							{loading && !isFirstLoad && hasMore && (
								<div className="loading-container">
									<Spin />
								</div>
							)}
						</List>
					</ConfigProvider>
				</InfiniteScroll>
			</div>
		);
	}
}

export default LikeList;
