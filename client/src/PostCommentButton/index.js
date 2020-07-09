import React from 'react';

import { Icon } from 'antd';

const PostCommentIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" id="vector">
		<path
			id="path"
			d="M 16.5 16.5 M 0 16.5 C 0 12.126 1.74 7.926 4.833 4.833 C 7.926 1.74 12.126 0 16.5 0 C 20.874 0 25.074 1.74 28.167 4.833 C 31.26 7.926 33 12.126 33 16.5 C 33 20.874 31.26 25.074 28.167 28.167 C 25.074 31.26 20.874 33 16.5 33 C 12.126 33 7.926 31.26 4.833 28.167 C 1.74 25.074 0 20.874 0 16.5"
			fill="#838899"
			width="1em"
			height="1em"
		/>
		<path
			id="path_1"
			d="M 16.587 24.87 L 16.587 9.927"
			fill="#00000000"
			stroke="#000000"
			strokeWidth="2.5"
		/>
		<path
			id="path_2"
			d="M 22.639 15.956 L 16.587 9.904 L 10.535 15.956"
			fill="#00000000"
			stroke="#000000"
			strokeWidth="2.5"
		/>
	</svg>
);

const PostCommentButton = (props) => {
	return (
		<Icon
			{...props}
			className="post-comment-button"
			component={PostCommentIcon}
		/>
	);
};

export default PostCommentButton;
