import React from 'react';
import './style.scss';

import { Row, Col } from 'antd';

import LandingLogo from '../LandingLogo';
import ByteVideo from '../ByteVideo';
import Explore from '../Explore';

import Slider from 'react-slick';

class HomePage extends React.Component {
	state = {
		posts: [],
		accounts: {},
		currentIndex: 0
	};

	beforeSlideChange = (currentSlide, nextSlide) => {
		const video = document.getElementById(`byte-video-${currentSlide}`);
		this.setState({ currentIndex: nextSlide });
		video.pause();
	};

	afterSlideChange = currentSlide => {
		const video = document.getElementById(`byte-video-${currentSlide}`);
		video.play();
	};

	render() {
		const { posts, accounts, currentIndex } = this.state;

		const sliderSettings = {
			dots: false,
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			vertical: true,
			verticalSwiping: true,
			swipeToSlide: true,
			beforeChange: this.beforeSlideChange,
			afterChange: this.afterSlideChange
		};

		return (
			<div>
				<Row>
					<Col span={8}>
						<LandingLogo />
					</Col>
					<Col span={8}>
						<Slider {...sliderSettings}>
							{posts.map((post, index) => {
								const { authorID } = post;
								return (
									<ByteVideo
										index={index}
										currentIndex={currentIndex}
										post={post}
										author={accounts[authorID]}
									/>
								);
							})}
						</Slider>
					</Col>
					<Col span={8}>
						<Explore />
					</Col>
				</Row>
			</div>
		);
	}
}

export default HomePage;
