import React from 'react';

import { Link } from 'react-router-dom';

import { List, Spin } from 'antd';

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
			likes: likes.concat(newLikes),
			cursor: newCursor
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

		return (
			<div className="comments-overlay-tab-list">
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
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
				</InfiniteScroll>
			</div>
		);
	}
}

export default LikeList;
