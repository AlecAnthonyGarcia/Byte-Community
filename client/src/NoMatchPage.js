import React from 'react';

import { Row, Col } from 'antd';

import LandingLogo from './LandingLogo';
import EmptyState from './EmptyState';

const NoMatchPage = () => {
	return (
		<Row>
			<Col xs={0} sm={0} md={0} lg={8}>
				<LandingLogo />
			</Col>
			<Col md={24} lg={16}>
				<EmptyState message="Sorry, this page isn't available." />
			</Col>
		</Row>
	);
};

export default NoMatchPage;
