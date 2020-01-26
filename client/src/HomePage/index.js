import React from 'react';
import './style.scss';

import { withRouter } from 'react-router-dom';

import { Row, Col, Spin } from 'antd';

import LandingLogo from '../LandingLogo';
import ByteVideo from '../ByteVideo';
import Explore from '../Explore';
import User from '../User';

import Slider from 'react-slick';

import Api from '../utils/Api';

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.sliderRef = React.createRef();
		this.state = {
			loading: true,
			posts: [],
			user: {},
			accounts: {},
			currentIndex: 0
		};
	}

	componentDidMount() {
		this.handleRoutes();
	}

	componentDidUpdate(prevProps) {
		const {
			match: { url }
		} = this.props;
		const prevUrl = prevProps.match.url;

		if (prevUrl !== url) {
			this.handleRoutes();
		}
	}

	handleRoutes = () => {
		const {
			match: { params, path }
		} = this.props;
		const { current: slider } = this.sliderRef;

		this.setState({ loading: true, user: {}, currentIndex: 0 });

		slider.slickGoTo(0);

		if (path === '/' || path.startsWith('/popular')) {
			this.getPopularFeed();
		}
		if (path.startsWith('/latest')) {
			this.getLatestFeed();
		}
		if (path.startsWith('/categories/')) {
			const { categoryName, sort } = params;
			this.getCategoryFeed(categoryName, sort);
		}
		if (path.startsWith('/user/')) {
			const { username } = params;
			if (path.endsWith('/rebytes')) {
				this.getUserRebytes(username);
			} else {
				this.getUserPosts(username);
			}
		}
		if (path.startsWith('/post/')) {
			const { postId } = params;
			this.getPost(postId);
		}
	};

	async getPopularFeed() {
		const response = await Api.getPopularFeed();

		const { posts, accounts } = response;

		this.setState({ loading: false, posts, accounts });
	}

	async getLatestFeed() {
		const response = await Api.getLatestFeed();

		const { posts, accounts } = response;

		this.setState({ loading: false, posts, accounts });
	}

	async getCategoryFeed(categoryName, sort) {
		const response = await Api.getCategoryFeed(categoryName, sort);

		const { posts, accounts } = response;

		this.setState({ loading: false, posts, accounts });
	}

	async getUserPosts(username) {
		const {
			accounts: [user]
		} = await Api.searchUser(username);
		const { id: userId } = user;

		const response = await Api.getUserPosts(userId);

		const { posts, accounts } = response;

		const userObj = accounts[userId];

		this.setState({ loading: false, posts, accounts, user: userObj });
	}

	async getUserRebytes(username) {
		const {
			accounts: [user]
		} = await Api.searchUser(username);
		const { id: userId } = user;

		const response = await Api.getUserRebytes(userId);

		const { rebytes, accounts } = response;

		const posts = rebytes.map(rebyte => {
			const { post } = rebyte;
			return post;
		});

		const userObj = accounts[userId];

		this.setState({ loading: false, posts, accounts, user: userObj });
	}

	async getPost(postId) {
		const response = await Api.getPost(postId);

		const { accounts } = response;
		const posts = [response];
		const [firstPost] = posts;
		const { authorID } = firstPost || {};

		const userObj = accounts[authorID];

		this.setState({
			loading: false,
			posts,
			accounts,
			user: userObj
		});
	}

	beforeSlideChange = (currentSlide, nextSlide) => {
		const video = document.getElementById(`byte-video-${currentSlide}`);
		this.setState({ currentIndex: nextSlide });
		if (video) {
			video.pause();
		}
	};

	afterSlideChange = currentSlide => {
		const video = document.getElementById(`byte-video-${currentSlide}`);
		if (video) {
			video.play();
		}
	};

	getRightComponent = () => {
		const {
			match: { url }
		} = this.props;
		const { user } = this.state;

		if (url.startsWith('/user/') || url.startsWith('/post/')) {
			return <User user={user} />;
		} else {
			return <Explore />;
		}
	};

	getFeedData = () => {
		const { posts, accounts, currentIndex } = this.state;

		return posts.map((post, index) => {
			const { authorID } = post;
			return (
				<ByteVideo
					key={authorID}
					index={index}
					currentIndex={currentIndex}
					post={post}
					author={accounts[authorID]}
				/>
			);
		});
	};

	render() {
		const { loading } = this.state;

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
						<Spin spinning={loading}>
							<Slider ref={this.sliderRef} {...sliderSettings}>
								{this.getFeedData()}
							</Slider>
						</Spin>
					</Col>
					<Col span={8}>{this.getRightComponent()}</Col>
				</Row>
			</div>
		);
	}
}

export default withRouter(HomePage);
