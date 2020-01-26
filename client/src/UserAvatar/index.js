import React from 'react';

import defaultAvatar from '../static/img/icon_default_avatar.png';

function UserAvatar(props) {
	let { src } = props;

	if (src === '' || src === undefined) {
		src = defaultAvatar;
	}

	return <img {...props} src={src} alt="" />;
}

export default UserAvatar;
