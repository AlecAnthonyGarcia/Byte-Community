import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import moment from 'moment';

import UserAvatar from '../UserAvatar';
import CommentsOverlay from '../CommentsOverlay';

class ByteVideo extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.state = {
			isVideoPlaying: false,
			isCommentOverlayOpen: false
		};
	}

	onVideoClick = e => {
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

	showCommentsOverlay = () => {
		const { onCommentsOverlayChange } = this.props;
		this.setState({ isCommentOverlayOpen: true });
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
		const { isCommentOverlayOpen } = this.state;
		const { index, post, author } = this.props;
		const {
			id: postId,
			authorID,
			videoSrc,
			thumbSrc,
			date,
			caption,
			comments,
			commentCount,
			likeCount,
			loopCount
		} = post;
		const { avatarURL, username } = author;

		const CommentCount = () => {
			return (
				<div
					className="video-stat-icon-container"
					onClick={this.showCommentsOverlay}
				>
					<Icon type="message" theme="filled" style={{ fontSize: '24px' }} />
					<span>{commentCount}</span>
				</div>
			);
		};

		const LikeCount = () => {
			return (
				<div
					className="video-stat-icon-container"
					onClick={this.showCommentsOverlay}
				>
					<Icon type="heart" theme="filled" style={{ fontSize: '24px' }} />
					<span>{likeCount}</span>
				</div>
			);
		};

		const ShareButton = () => {
			return (
				<Link to={`/post/${postId}`}>
					<div className="video-stat-icon-container">
						<Icon type="share-alt" style={{ fontSize: '24px' }} />
						<span>Share</span>
					</div>
				</Link>
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
				/>

				<div className="video-info-container">
					<div className="video-caption">{caption}</div>
					<span className="user-info-container">
						<Link to={`/user/${username}`}>
							<UserAvatar className="user-avatar" src={avatarURL} />
						</Link>
						<Link to={`/user/${username}`} className="user-username">
							{username}
						</Link>
						<span className="timestamp">{moment.unix(date).fromNow()}</span>
						<div className="video-stat-container">
							<ShareButton />
							<CommentCount />
							<LikeCount />
						</div>
					</span>
				</div>

				{isCommentOverlayOpen && (
					<CommentsOverlay post={post} onClose={this.onCloseCommentsOverlay} />
				)}
			</div>
		);
	}
}

export default ByteVideo;
