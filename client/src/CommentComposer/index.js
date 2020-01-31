import React from 'react';

import { connect } from 'react-redux';

import { Input } from 'antd';

import UserAvatar from '../UserAvatar/index.js';
import PostCommentButton from '../PostCommentButton';

import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

class CommentComposer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: ''
		};
	}

	onCommentChange = e => {
		const {
			target: { value: comment }
		} = e;
		this.setState({ comment });
	};

	onPressEnter = () => {
		this.onPostCommentButtonClick();
	};

	onPostCommentButtonClick = () => {
		const { comment } = this.state;

		if (comment !== '') {
			this.postComment(comment);
		}
	};

	postComment = async comment => {
		const { post, onCommentPosted } = this.props;
		const { id: postId } = post;

		const response = await Api.postComment(postId, comment);

		onCommentPosted(response);

		this.setState({ comment: '' });

		AnalyticsUtil.track('Post Comment', {
			postId
		});
	};

	render() {
		const { comment } = this.state;
		const { auth, user } = this.props;
		const { avatarURL } = user;

		if (!auth) {
			return null;
		}

		return (
			<div className="comment-composer-container">
				<UserAvatar src={avatarURL} className="user-avatar" />
				<div className="comment-composer-input-container ">
					<Input
						className="comment-text-box"
						placeholder="Say something nice..."
						value={comment}
						onChange={this.onCommentChange}
						onPressEnter={this.onPressEnter}
					/>
					{comment.length > 0 && (
						<PostCommentButton onClick={this.onPostCommentButtonClick} />
					)}
				</div>
			</div>
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

export default connect(mapStateToProps, null)(CommentComposer);
