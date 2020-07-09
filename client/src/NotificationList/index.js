import React from 'react';
import './style.scss';

import { setFollowsMap } from '../HomePage/homeActions';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Button, ConfigProvider, Icon, List, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import NotificationIcon from '../NotificationIcon';
import UserAvatar from '../UserAvatar/index.js';
import FollowButton from '../FollowButton';

import { NOTIFICATION_TYPES, NOTIFICATION_SUB_TYPES } from '../utils/Constants';
import Api from '../utils/Api';

class NotificationList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
			accounts: {},
			posts: {},
			isFirstLoad: true,
			loading: true,
			hasMore: true,
			cursor: null
		};
	}

	componentDidMount() {
		this.getNotifications();
	}

	getNotifications = async () => {
		const { notifications, accounts, posts, cursor } = this.state;
		const { setFollowsMap } = this.props;

		const response = await Api.getActivity(cursor);

		const {
			activity,
			accounts: newAccounts,
			posts: newPosts,
			cursor: newCursor
		} = response;

		const newNotificationsList = notifications.concat(activity);
		const newPostsMap = { ...posts, ...newPosts };
		const newAccountsMap = { ...accounts, ...newAccounts };

		setFollowsMap(newAccountsMap);

		this.setState({
			loading: false,
			notifications: newNotificationsList,
			posts: newPostsMap,
			accounts: newAccountsMap,
			cursor: newCursor,
			hasMore: newCursor ? true : false
		});
	};

	getNotificationTypeLabel = (type) => {
		switch (type) {
			case NOTIFICATION_TYPES.LIKE:
				return 'liked your post';
			case NOTIFICATION_TYPES.FOLLOW:
				return 'followed you';
			case NOTIFICATION_TYPES.COMMENT:
				return 'left a comment';
			case NOTIFICATION_TYPES.MENTION:
				return 'mentioned you';
			default:
		}
	};

	getNotificationUser = (notification) => {
		const { accounts, posts } = this.state;
		const { subType, body } = notification;
		const { id: postId, authorID, followerAccountID } = body;

		let user;

		const isPostMention =
			subType && subType === NOTIFICATION_SUB_TYPES.POST_MENTION;

		if (isPostMention) {
			const post = posts[postId];
			const { authorID: postAuthorId } = post;
			user = accounts[postAuthorId];
		} else {
			const userId = authorID ? authorID : followerAccountID;
			user = accounts[userId];
		}

		return user;
	};

	getNotificationText = (notification) => {
		const { posts } = this.state;
		const { subType, body } = notification;
		const { id: postId, body: notificationText } = body;

		if (subType && subType === NOTIFICATION_SUB_TYPES.POST_MENTION) {
			const post = posts[postId];
			const { caption } = post;
			return caption;
		} else {
			return notificationText;
		}
	};

	getNotificationPost = (notification) => {
		const { posts } = this.state;
		const { subType, body } = notification;
		const { id: authorPostId, postID } = body;

		const isPostMention =
			subType && subType === NOTIFICATION_SUB_TYPES.POST_MENTION;
		const post = posts[isPostMention ? authorPostId : postID];

		return post;
	};

	onLoadMore = () => {
		this.setState({ loading: true });
		this.getNotifications();
	};

	onClose = () => {
		const { onClose } = this.props;

		if (onClose) {
			onClose();
		}
	};

	renderNotificationCta(item) {
		const { accounts } = this.state;
		const { type, body } = item;

		switch (type) {
			case NOTIFICATION_TYPES.LIKE:
			case NOTIFICATION_TYPES.COMMENT:
			case NOTIFICATION_TYPES.MENTION: {
				const post = this.getNotificationPost(item);
				const { id: postId, thumbSrc } = post;

				return (
					<Link to={`/post/${postId}`} onClick={this.onClose}>
						<img
							alt="Post Thumbnail"
							src={thumbSrc}
							className="notification-post-thumbnail"
						/>
					</Link>
				);
			}
			case NOTIFICATION_TYPES.FOLLOW: {
				const { followerAccountID } = body;
				const user = accounts[followerAccountID];

				return <FollowButton user={user} />;
			}
			default:
		}
	}

	render() {
		const { isFirstLoad, loading, hasMore, notifications } = this.state;

		const ListEmptyState = () => (
			<div className="empty-state-container">
				<p>No activity...</p>
			</div>
		);

		return (
			<div className="notification-list-container">
				<div className="notification-list-header-container">
					<Button
						icon="arrow-left"
						className="back-button"
						onClick={this.onClose}
					/>
					<Icon
						className="notification-button"
						component={NotificationIcon}
						style={{
							fontSize: '48px',
							color: 'white'
						}}
					/>
					<span className="header-title">Activity</span>
				</div>

				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.onLoadMore}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
					<ConfigProvider renderEmpty={ListEmptyState}>
						<List
							dataSource={notifications}
							loading={loading}
							renderItem={(item) => {
								const { type, date } = item;
								const user = this.getNotificationUser(item);
								const { avatarURL, username } = user;

								return (
									<div className="user-info-container">
										<Link to={`/user/${username}`} onClick={this.onClose}>
											<UserAvatar src={avatarURL} className="user-avatar" />
										</Link>

										<div className="notification-username">
											<Link to={`/user/${username}`} onClick={this.onClose}>
												{`@${username}`}
											</Link>

											<span className="notification-timestamp">
												{moment.unix(date).fromNow()}
											</span>

											<div className="notification-type-label">
												{this.getNotificationTypeLabel(type)}
											</div>

											<div className="notification-text">
												{this.getNotificationText(item)}
											</div>
										</div>
										<div>{this.renderNotificationCta(item)}</div>
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
		);
	}
}

export default connect(null, { setFollowsMap })(NotificationList);
