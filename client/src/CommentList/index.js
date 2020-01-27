import React from 'react';

import { Link } from 'react-router-dom';

import { List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import UserAvatar from '../UserAvatar/index.js';

import Api from '../utils/Api';
import moment from 'moment';

class CommentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			accounts: {},
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			cursor: null
		};
	}

	componentDidMount() {
		this.getPostComments();
	}

	getPostComments = async () => {
		const { comments, accounts, cursor } = this.state;
		const { post } = this.props;
		const { id: postId } = post;

		const response = await Api.getPostComments(postId, cursor);

		const {
			comments: newComments,
			accounts: newAccounts,
			cursor: newCursor
		} = response;

		this.setState({
			loading: false,
			isFirstLoad: false,
			comments: comments.concat(newComments),
			accounts: { ...accounts, ...newAccounts },
			cursor: newCursor
		});
	};

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getPostComments();
	};

	onListItemClick = () => {
		const { onListItemClick } = this.props;

		if (onListItemClick) {
			onListItemClick();
		}
	};

	render() {
		const { isFirstLoad, loading, hasMore, comments, accounts } = this.state;

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
						dataSource={comments}
						loading={loading}
						renderItem={item => {
							const { authorID, body, date } = item;
							const user = accounts[authorID];
							const { avatarURL, username } = user;

							return (
								<Link to={`/user/${username}`} onClick={this.onListItemClick}>
									<div className="user-info-container">
										<UserAvatar src={avatarURL} className="user-avatar" />
										<div className="user-name-container">
											<div className="comment-username">
												{`@${username}`}
												<span className="comment-timestamp">
													{moment.unix(date).fromNow()}
												</span>
											</div>
											<div>{body}</div>
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

export default CommentList;
