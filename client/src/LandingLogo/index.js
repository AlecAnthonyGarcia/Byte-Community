import React from 'react';
import './style.scss';

import { connect } from 'react-redux';

import logo from '../static/img/logo.png';
import backgroundVideo from '../static/img/background_landing.mp4';

import { Button } from 'antd';

import {
	logout,
	setLoginModalVisibility,
	setSignupModalVisibility
} from '../AuthModal/authActions';

import LoginModal from '../AuthModal/LoginModal';

import { GOOGLE_AUTH_LINK } from '../utils/Constants';

const LandingLogo = props => {
	const { auth, logout, isLoginModalOpen, setLoginModalVisibility } = props;

	const LoginButton = () => {
		const onClick = () => {
			setLoginModalVisibility(true);
			window.open(GOOGLE_AUTH_LINK);
		};

		return (
			<Button icon="google" className="login-button" onClick={onClick}>
				Sign in with Google
			</Button>
		);
	};

	const LogoutButton = () => {
		return (
			<Button icon="logout" className="login-button" onClick={logout}>
				Logout
			</Button>
		);
	};

	const onLoginModalClose = () => {
		const { setLoginModalVisibility } = props;
		setLoginModalVisibility(false);
	};

	return (
		<div className="landing-logo-container">
			<video
				className="landing-video"
				src={backgroundVideo}
				autoPlay
				muted
				loop
				playsInline
			/>

			<div className="landing-logo-container">
				<img className="landing-logo" src={logo} alt="byte logo" />
				{auth ? <LogoutButton /> : <LoginButton />}
			</div>

			<LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />
		</div>
	);
};

function mapStateToProps(state) {
	const { authReducer } = state;
	const { isAuthenticated, isLoginModalOpen, isSignupModalOpen } = authReducer;
	return {
		auth: isAuthenticated,
		isLoginModalOpen,
		isSignupModalOpen
	};
}

export default connect(mapStateToProps, {
	logout,
	setLoginModalVisibility,
	setSignupModalVisibility
})(LandingLogo);
