import React from 'react';
import './style.scss';

import logo from '../static/img/logo.png';
import topOverlay from '../static/img/top_shadow_overlay.png';

import { Link, withRouter } from 'react-router-dom';

import { Icon, Row, Col, Spin } from 'antd';

import LandingLogo from '../LandingLogo';
import SearchIcon from '../SearchIcon';
import ByteVideo from '../ByteVideo';
import Explore from '../Explore';
import User from '../User';
import EmptyState from '../EmptyState';

import Slider from 'react-slick';
import MediaQuery from 'react-responsive';

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
			currentIndex: 0,
			cursor: null,
			hasMore: true,
			showSliderArrows: true,
			isExploreOverlayOpen: false
		};
	}

	componentDidMount() {
		this.loadFeedData();
	}

	componentDidUpdate(prevProps) {
		const {
			match: { url }
		} = this.props;
		const prevUrl = prevProps.match.url;

		if (prevUrl !== url) {
			this.onFeedTypeChange();
		}
	}

	loadFeedData = () => {
		const {
			match: { params, path }
		} = this.props;

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

	loadMoreFeedData = () => {
		const { hasMore } = this.state;
		if (hasMore) {
			this.loadFeedData();
		}
	};

	async getPopularFeed() {
		this.getFeed(Api.getPopularFeed);
	}

	async getLatestFeed() {
		this.getFeed(Api.getLatestFeed);
	}

	async getCategoryFeed(categoryName, sort) {
		this.getFeed(Api.getCategoryFeed, categoryName, sort);
	}

	async getUserPosts(username) {
		this.getUserFeed(Api.getUserPosts, username);
	}

	async getUserRebytes(username) {
		this.getUserFeed(Api.getUserRebytes, username);
	}

	async getUserId(username) {
		const {
			accounts: [user]
		} = await Api.searchUser(username);
		const { id } = user;
		return id;
	}

	async getFeed(apiMethod, ...args) {
		const { cursor: currentCursor } = this.state;

		const response = await apiMethod(...args, currentCursor);

		const { posts, accounts, cursor } = response;

		this.updateFeedData({ posts, accounts, cursor });
	}

	async getUserFeed(apiMethod, username) {
		const { cursor: currentCursor, user } = this.state;
		let { id: userId } = user;

		if (!userId) {
			userId = await this.getUserId(username);
		}

		const response = await apiMethod(userId, currentCursor);

		let { posts, rebytes, accounts, cursor } = response;

		if (rebytes) {
			posts = rebytes.map(rebyte => {
				const { post } = rebyte;
				return post;
			});
		}

		const hasPosts = posts.length > 0;

		const userObj = hasPosts ? accounts[userId] : await Api.getUser(userId);

		this.updateFeedData({ posts, accounts, cursor, user: userObj });
	}

	async getPost(postId) {
		const response = await Api.getPost(postId);

		const { accounts } = response;
		const posts = [response];
		const [firstPost] = posts;
		const { authorID } = firstPost || {};

		const userObj = accounts[authorID];

		this.updateFeedData(posts, accounts, userObj);
	}

	onFeedTypeChange = () => {
		const { current: slider } = this.sliderRef;

		if (slider) {
			slider.slickGoTo(0);
		}

		this.setState(
			{ loading: true, posts: [], currentIndex: 0, cursor: null, user: {} },
			() => {
				this.loadFeedData();
			}
		);
	};

	updateFeedData = ({
		posts: newPosts,
		accounts: newAccounts,
		user,
		cursor
	}) => {
		const { posts, accounts } = this.state;

		this.setState({
			loading: false,
			posts: posts.concat(newPosts),
			accounts: { ...accounts, ...newAccounts },
			user,
			cursor,
			hasMore: cursor ? true : false
		});
	};

	beforeSlideChange = (currentSlide, nextSlide) => {
		const video = document.getElementById(`byte-video-${currentSlide}`);
		this.setState({ currentIndex: nextSlide });
		if (video) {
			video.pause();
		}
	};

	afterSlideChange = currentSlide => {
		const { posts } = this.state;
		const video = document.getElementById(`byte-video-${currentSlide}`);
		if (video) {
			video.play();
		}

		if (currentSlide === 0) {
			document.body.style.overflowY = 'auto';
		} else {
			document.body.style.overflowY = 'hidden';
		}

		if (posts.length - (currentSlide + 1) === 3) {
			this.loadMoreFeedData();
		}
	};

	getMiddleComponent = () => {
		const { posts, showSliderArrows, isExploreOverlayOpen } = this.state;

		const sliderSettings = {
			dots: false,
			arrows: showSliderArrows,
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			touchThreshold: 20,
			vertical: true,
			verticalSwiping: true,
			swipeToSlide: true,
			beforeChange: this.beforeSlideChange,
			afterChange: this.afterSlideChange
		};

		if (posts.length === 0) {
			return <EmptyState message="Nothing to see here yet..." />;
		}

		return (
			<>
				{this.shouldShowUserComponent() && (
					<MediaQuery maxWidth={768}>
						<User user={this.state.user} />
					</MediaQuery>
				)}

				<div style={{ position: 'relative' }}>
					<Slider ref={this.sliderRef} {...sliderSettings}>
						{this.getFeedData()}
					</Slider>
					<img className="video-overlay-top-shadow" src={topOverlay} />

					<Link to="/">
						<img className="video-overlay-logo" src={logo} alt="byte logo" />
					</Link>

					<MediaQuery maxWidth={768}>
						<Icon
							className="video-overlay-search-button"
							component={SearchIcon}
							style={{
								fontSize: '48px',
								color: 'white'
							}}
							onClick={this.showExploreOverlay}
						/>
					</MediaQuery>
				</div>
				{isExploreOverlayOpen && (
					<MediaQuery maxWidth={768}>
						<div className="explore-overlay-container">
							<Explore showBackButton onClose={this.onCloseExploreOverlay} />
						</div>
					</MediaQuery>
				)}
			</>
		);
	};

	getRightComponent = () => {
		if (this.shouldShowUserComponent()) {
			const { user } = this.state;
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
					onCommentsOverlayChange={this.onCommentsOverlayChange}
				/>
			);
		});
	};

	onCommentsOverlayChange = isVisible => {
		this.setState({ showSliderArrows: isVisible ? false : true });
	};

	shouldShowUserComponent = () => {
		const {
			match: { url }
		} = this.props;
		return url.startsWith('/user/') || url.startsWith('/post/');
	};

	showExploreOverlay = () => {
		this.setState({ isExploreOverlayOpen: true });
	};

	onCloseExploreOverlay = () => {
		this.setState({ isExploreOverlayOpen: false });
	};

	render() {
		const { loading } = this.state;

		return (
			<div>
				<Row>
					<Col xs={0} sm={0} md={0} lg={8}>
						<LandingLogo />
					</Col>
					<Col md={12} lg={8}>
						<Spin spinning={loading}>{this.getMiddleComponent()}</Spin>
					</Col>
					<Col xs={0} md={12} lg={8}>
						{this.getRightComponent()}
					</Col>
				</Row>
			</div>
		);
	}
}

export default withRouter(HomePage);
