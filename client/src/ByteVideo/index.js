import React from 'react';
import './style.scss';

import { likePost, unlikePost } from '../HomePage/homeActions';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import moment from 'moment';

import UserAvatar from '../UserAvatar';
import CommentsOverlay from '../CommentsOverlay';
import ShareButton from '../ShareButton';

import AnalyticsUtil from '../utils/AnalyticsUtil';

class ByteVideo extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.state = {
			isVideoPlaying: false,
			isCommentOverlayOpen: false,
			defaultCommentsOverlayTabKey: 'comments'
		};
	}

	onLikeButtonClick = async () => {
		const { auth, post, likesMap, likePost, unlikePost } = this.props;
		const { id: postId } = post;

		const { likedByMe, likeCount } = likesMap[postId] || {};

		if (auth) {
			if (likedByMe) {
				unlikePost(postId, likeCount);
				AnalyticsUtil.track(
					'Unlike Post',
					{
						postId
					},
					false
				);
			} else {
				likePost(postId, likeCount);
				AnalyticsUtil.track(
					'Like Post',
					{
						postId
					},
					false
				);
			}
		} else {
			this.showCommentsOverlay('likes');
			AnalyticsUtil.track(
				'Like Button Click',
				{
					postId
				},
				false
			);
		}
	};

	onCommentButtonClick = () => {
		const { post } = this.props;
		const { id: postId } = post;

		this.showCommentsOverlay('comments');

		AnalyticsUtil.track(
			'Comment Button Click',
			{
				postId
			},
			false
		);
	};

	onVideoClick = (e) => {
		e.preventDefault();
		const { index, currentIndex } = this.props;
		const { isVideoPlaying } = this.state;

		const { current: video } = this.videoRef;

		if (index === currentIndex) {
			if (video.paused && !isVideoPlaying) {
				video.play();
				this.setState({ isVideoPlaying: true });
			} else {
				video.pause();
				this.setState({ isVideoPlaying: false });
			}
		}
	};

	showCommentsOverlay = (defaultCommentsOverlayTabKey) => {
		const { onCommentsOverlayChange } = this.props;
		this.setState({ isCommentOverlayOpen: true, defaultCommentsOverlayTabKey });
		onCommentsOverlayChange(true);
	};

	onCloseCommentsOverlay = () => {
		const { onCommentsOverlayChange } = this.props;
		this.setState({ isCommentOverlayOpen: false });
		onCommentsOverlayChange(false);
	};

	onPause = () => {
		const { current: video } = this.videoRef;

		if (!video.paused) {
			video.pause();
		}

		this.setState({ isVideoPlaying: false });
	};

	render() {
		const { isCommentOverlayOpen, defaultCommentsOverlayTabKey } = this.state;
		const { index, post, author, muted, likesMap } = this.props;
		const { id: postId, videoSrc, date, caption, commentCount } = post;
		const { avatarURL, username } = author;

		const CommentCount = () => {
			return (
				<div
					className="video-stat-icon-container"
					onClick={this.onCommentButtonClick}
				>
					<Icon type="message" theme="filled" style={{ fontSize: '24px' }} />
					<span>{commentCount}</span>
				</div>
			);
		};

		const LikeCount = () => {
			const { likedByMe, likeCount } = likesMap[postId] || {};
			return (
				<div
					className="video-stat-icon-container"
					onClick={this.onLikeButtonClick}
				>
					<Icon
						type="heart"
						theme="filled"
						style={{ color: likedByMe ? 'red' : 'white', fontSize: '24px' }}
					/>
					<span>{likeCount}</span>
				</div>
			);
		};

		const VideoCaption = () => {
			const replaceHashtagsWithLinks = (text) => {
				return text.replace(
					/#([^\b#.,， ]*)/gi,
					`<a class="video-caption-hashtag" href="/hashtag/$1/">#$1</a>`
				);
			};

			const getCaptionText = () => {
				return { __html: replaceHashtagsWithLinks(caption) };
			};

			return (
				<div className="video-caption">
					<span
						className="caption"
						dangerouslySetInnerHTML={getCaptionText()}
					/>
				</div>
			);
		};

		return (
			<div className="video-container">
				<video
					ref={this.videoRef}
					id={`byte-video-${index}`}
					className="byte-video"
					src={videoSrc}
					onClick={this.onVideoClick}
					onPause={this.onPause}
					loop
					playsInline
					muted={muted}
					autoPlay={index === 0}
				/>

				<div className="video-info-container">
					<VideoCaption />
					<span className="user-info-container">
						<Link to={`/user/${username}`} className="user-avatar-container">
							<UserAvatar className="user-avatar" src={avatarURL} />
						</Link>
						<Link to={`/user/${username}`} className="user-username">
							{username}
						</Link>
						<span className="timestamp">{moment.unix(date).fromNow()}</span>
						<div className="video-stat-container">
							<ShareButton post={post} author={author}>
								<div className="video-stat-icon-container">
									<Icon type="share-alt" style={{ fontSize: '24px' }} />
									<span>Share</span>
								</div>
							</ShareButton>
							<CommentCount />
							<LikeCount />
						</div>
					</span>
				</div>

				{isCommentOverlayOpen && (
					<CommentsOverlay
						defaultTabKey={defaultCommentsOverlayTabKey}
						post={post}
						author={author}
						onClose={this.onCloseCommentsOverlay}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer, homeReducer } = state;
	const { isAuthenticated } = authReducer;
	const { likesMap } = homeReducer;
	return {
		auth: isAuthenticated,
		likesMap
	};
}

export default connect(mapStateToProps, {
	likePost,
	unlikePost
})(ByteVideo);
