import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ConfigProvider, Dropdown, Menu, List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';

import UserAvatar from '../UserAvatar/index.js';
import CommentComposer from '../CommentComposer';

import moment from 'moment';

import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

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
			comments: comments.concat(newComments || []),
			accounts: { ...accounts, ...newAccounts },
			cursor: newCursor,
			hasMore: newCursor ? true : false
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

	onCommentPosted = commentResponse => {
		const { comments, accounts } = this.state;
		const { accounts: newAccounts, ...comment } = commentResponse;

		this.setState({
			comments: comments.concat([comment]),
			accounts: { ...accounts, ...newAccounts }
		});
	};

	deleteComment = async deletedCommentId => {
		const { comments } = this.state;
		const { post } = this.props;
		const { id: postId } = post;

		await Api.deleteComment(deletedCommentId);

		const newComments = comments.filter(comment => {
			const { id: commentId } = comment;
			return commentId !== deletedCommentId;
		});

		this.setState({
			comments: newComments
		});

		AnalyticsUtil.track(
			'Delete Comment',
			{
				postId
			},
			false
		);
	};

	render() {
		const { isFirstLoad, loading, hasMore, comments, accounts } = this.state;
		const { auth, user: authUser, post } = this.props;
		const { id: authUserId } = authUser;

		const ListEmptyState = () => (
			<div className="empty-state-container">
				<p>No comments here yet...</p>
			</div>
		);

		return (
			<>
				<div
					className="comments-overlay-tab-list"
					style={{ height: auth ? '59vh' : '65vh' }}
				>
					<InfiniteScroll
						initialLoad={false}
						pageStart={0}
						loadMore={this.onLoadMore}
						hasMore={!loading && hasMore}
						useWindow={false}
					>
						<ConfigProvider renderEmpty={ListEmptyState}>
							<List
								dataSource={comments}
								loading={loading}
								renderItem={item => {
									const { id: commentId, authorID, body, date } = item;
									const user = accounts[authorID];
									const { avatarURL, username } = user;

									const isCommentMenuEnabled = auth && authorID === authUserId;

									const commentMenu = (
										<Menu>
											<Menu.Item
												key="delete"
												onClick={() => this.deleteComment(commentId)}
											>
												Delete Comment
											</Menu.Item>
										</Menu>
									);

									return (
										<div className="user-info-container">
											<Link
												to={`/user/${username}`}
												onClick={this.onListItemClick}
											>
												<UserAvatar src={avatarURL} className="user-avatar" />
											</Link>
											<Dropdown
												overlay={commentMenu}
												trigger={['click']}
												disabled={!isCommentMenuEnabled}
											>
												<div
													className="user-name-container"
													style={{
														cursor: isCommentMenuEnabled ? 'pointer' : 'initial'
													}}
												>
													<div className="comment-username">
														<Link
															to={`/user/${username}`}
															onClick={this.onListItemClick}
														>
															{`@${username}`}
														</Link>
														<span className="comment-timestamp">
															{moment.unix(date).fromNow()}
														</span>
													</div>

													<div>{body}</div>
												</div>
											</Dropdown>
										</div>
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
				<CommentComposer post={post} onCommentPosted={this.onCommentPosted} />
			</>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer } = state;
	const { isAuthenticated, user } = authReducer;
	return {
		auth: isAuthenticated,
		user
	};
}

export default connect(mapStateToProps, null)(CommentList);
