import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Dropdown, Icon, Menu, message } from 'antd';
import moment from 'moment';

import UserAvatar from '../UserAvatar';
import CommentsOverlay from '../CommentsOverlay';

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

	showCommentsOverlay = defaultCommentsOverlayTabKey => {
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
		const { index, post, author } = this.props;
		const {
			id: postId,
			videoSrc,
			date,
			caption,
			commentCount,
			likeCount
		} = post;
		const { avatarURL, username } = author;

		const CommentCount = () => {
			return (
				<div
					className="video-stat-icon-container"
					onClick={() => this.showCommentsOverlay('comments')}
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
					onClick={() => {
						this.showCommentsOverlay('likes');
					}}
				>
					<Icon type="heart" theme="filled" style={{ fontSize: '24px' }} />
					<span>{likeCount}</span>
				</div>
			);
		};

		const ShareButton = () => {
			const baseUrl = window.location.origin;
			const postUrl = `${baseUrl}/post/${postId}`;
			const socialShareWindowOptions =
				'toolbar=0,status=0,resizable=1,width=626,height=436';

			const handleMenuClick = ({ key }) => {
				switch (key) {
					case 'open':
						window.open(postUrl, '_blank');
						break;
					case 'download':
						window.open(videoSrc, '_blank');
						break;
					case 'facebook':
						shareToFacebook();
						break;
					case 'twitter':
						shareToTwitter();
						break;
					default:
				}
			};

			const shareToFacebook = () => {
				const url = `https://facebook.com/sharer.php?display=popup&u=${postUrl}`;
				window.open(url, 'sharer', socialShareWindowOptions);
			};

			const shareToTwitter = () => {
				const shareText = `Check out this byte by ${username} on the byte community:`;

				const url = `http://twitter.com/intent/tweet?text=${shareText}&url=${postUrl}`;

				window.open(url, 'sharer', socialShareWindowOptions);
			};

			const onLinkCopied = () => {
				message.success('Post link has been copied.');
			};

			const shareMenu = (
				<Menu onClick={handleMenuClick}>
					<Menu.Item key="open">
						<Icon type="link" /> Open link
					</Menu.Item>
					<Menu.Item key="copy">
						<CopyToClipboard text={postUrl} onCopy={onLinkCopied}>
							<span>
								<Icon type="copy" /> Copy link
							</span>
						</CopyToClipboard>
					</Menu.Item>
					<Menu.Item key="download">
						<Icon type="download" /> Download Video
					</Menu.Item>
					<Menu.Item key="facebook">
						<Icon type="facebook" /> Share to Facebook
					</Menu.Item>
					<Menu.Item key="twitter">
						<Icon type="twitter" /> Share to Twitter
					</Menu.Item>
				</Menu>
			);

			return (
				<Dropdown overlay={shareMenu} trigger={['click']}>
					<div className="video-stat-icon-container">
						<Icon type="share-alt" style={{ fontSize: '24px' }} />
						<span>Share</span>
					</div>
				</Dropdown>
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
					<CommentsOverlay
						defaultTabKey={defaultCommentsOverlayTabKey}
						post={post}
						onClose={this.onCloseCommentsOverlay}
					/>
				)}
			</div>
		);
	}
}

export default ByteVideo;
