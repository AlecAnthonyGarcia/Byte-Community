import React from 'react';
import './style.scss';

import backgroundVideo from '../static/img/background_landing.mp4';
import logo from '../static/img/logo.png';

const LandingLogo = () => {
	return (
		<div className="landing-logo-container">
			<img className="landing-logo" src={logo} alt="byte logo" />
			<video
				className="landing-video"
				src={backgroundVideo}
				autoPlay
				muted
				loop
			/>
		</div>
	);
};

export default LandingLogo;
