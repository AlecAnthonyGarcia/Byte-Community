import React from 'react';

import { Icon } from 'antd';

import { isBetaTester } from '../utils/Utils';

const BetaBadgeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 8 14"
		id="vector"
		width="1em"
		height="1em"
	>
		<path
			id="path"
			d="M 0 4.595 L 0 9.19 L 3.943 6.892 L 0 4.595 Z"
			fill="currentColor"
			fill-rule="evenodd"
		/>
		<path
			id="path_1"
			d="M 0 9.19 L 0 13.785 L 7.886 9.19 L 3.943 6.892 L 0 9.19 Z"
			fill="currentColor"
			fill-opacity="0.5"
			stroke-opacity="0.5"
			fill-rule="evenodd"
		/>
		<path
			id="path_2"
			d="M 3.943 6.892 L 7.886 4.595 L 0 0 L 0 4.595 L 3.943 6.892 Z"
			fill="currentColor"
			fill-opacity="0.5"
			stroke-opacity="0.5"
			fill-rule="evenodd"
		/>
	</svg>
);

const BetaBadge = props => {
	const { color, registrationDate } = props;

	if (isBetaTester(registrationDate)) {
		return (
			<Icon
				title="Beta User"
				component={BetaBadgeIcon}
				style={{
					fontSize: '24px',
					textAlign: 'left',
					color
				}}
			/>
		);
	}

	return null;
};

export default BetaBadge;
