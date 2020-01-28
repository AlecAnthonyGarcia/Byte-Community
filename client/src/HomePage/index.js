import React from 'react';
import './style.scss';

import logo from '../static/img/logo.png';
import topOverlay from '../static/img/top_shadow_overlay.png';

import { Link, withRouter } from 'react-router-dom';

import { Dropdown, Icon, Menu, Row, Col, Spin } from 'antd';

import LandingLogo from '../LandingLogo';
import SearchIcon from '../SearchIcon';
import ByteVideo from '../ByteVideo';
import Explore from '../Explore';
import User from '../User';
import EmptyState from '../EmptyState';

import Slider from 'react-slick';
import MediaQuery from 'react-responsive';

import { FEED_TYPES, SORT_TYPES } from '../utils/Constants';
import Api from '../utils/Api';
import MuteButton from '../MuteButton';

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
			allowSwipe: true,
			isExploreOverlayOpen: false,
			isMuted: true,
			currentSortType: SORT_TYPES.POPULAR
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
			match: { params }
		} = this.props;
		const { username } = params;

		switch (this.getCurrentFeedType()) {
			case FEED_TYPES.POPULAR:
				this.getPopularFeed();
				break;
			case FEED_TYPES.LATEST:
				this.getLatestFeed();
				break;
			case FEED_TYPES.CATEGORY:
				let { categoryName, sort } = params;
				this.getCategoryFeed(categoryName, sort);
				break;
			case FEED_TYPES.USER:
				this.getUserPosts(username);
				break;
			case FEED_TYPES.REBYTES:
				this.getUserRebytes(username);
				break;
			case FEED_TYPES.POST:
				const { postId } = params;
				this.getPost(postId);
				break;
			default:
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
		if (sort) {
			sort = sort.toLowerCase();
		}
		if (!Object.values(SORT_TYPES).includes(sort)) {
			sort = SORT_TYPES.POPULAR;
		}
		this.setState({ currentSortType: sort });
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

		this.updateFeedData({ posts, accounts, user: userObj });
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

	getCurrentFeedType = () => {
		const {
			match: { path }
		} = this.props;

		if (path === '/' || path.startsWith('/popular')) {
			return FEED_TYPES.POPULAR;
		}
		if (path.startsWith('/latest')) {
			return FEED_TYPES.LATEST;
		}
		if (path.startsWith('/categories/')) {
			return FEED_TYPES.CATEGORY;
		}
		if (path.startsWith('/post/')) {
			return FEED_TYPES.POST;
		}
		if (path.startsWith('/user/')) {
			if (path.endsWith('/rebytes')) {
				return FEED_TYPES.REBYTES;
			} else {
				return FEED_TYPES.USER;
			}
		}
	};

	getCategoryName = () => {
		switch (this.getCurrentFeedType()) {
			case FEED_TYPES.POPULAR:
				return 'Popular Now';
			case FEED_TYPES.LATEST:
				return 'Latest';
			case FEED_TYPES.CATEGORY:
				const {
					match: { params }
				} = this.props;
				const { categoryName } = params;
				return categoryName;
			case FEED_TYPES.REBYTES:
				return 'Rebytes';
			default:
				return '';
		}
	};

	getMiddleComponent = () => {
		const {
			loading,
			posts,
			showSliderArrows,
			allowSwipe,
			isExploreOverlayOpen,
			currentSortType,
			currentIndex
		} = this.state;

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
			swipe: allowSwipe,
			beforeChange: this.beforeSlideChange,
			afterChange: this.afterSlideChange
		};

		if (posts.length === 0 && !loading) {
			return <EmptyState message="Nothing to see here yet..." />;
		}

		const {
			match: { params }
		} = this.props;
		const { categoryName } = params;

		const sortMenu = (
			<Menu onClick={this.onSortChange}>
				<Menu.Item key="popular">
					<Link to={`/categories/${categoryName}/popular`}>Popular</Link>
				</Menu.Item>
				<Menu.Item key="recent">
					<Link to={`/categories/${categoryName}/recent`}>Recent</Link>
				</Menu.Item>
			</Menu>
		);

		const currentFeedType = this.getCurrentFeedType();

		return (
			<>
				{this.shouldShowUserComponent() && (
					<MediaQuery maxWidth={768}>
						<User user={this.state.user} loading={loading} />
					</MediaQuery>
				)}

				<div style={{ position: 'relative' }}>
					<Slider ref={this.sliderRef} {...sliderSettings}>
						{this.getFeedData()}
					</Slider>

					<div className="video-overlay-container">
						<img className="top-shadow" src={topOverlay} alt="" />

						{!loading && (
							<MuteButton
								className="mute-button"
								index={currentIndex}
								onMuteChange={this.onMuteChange}
							/>
						)}

						<div className="video-overlay-header">
							{!loading && (
								<div className="logo-container">
									<Link to="/">
										<img className="logo" src={logo} alt="byte logo" />
									</Link>
								</div>
							)}

							<div className="video-overlay-header-title-container ">
								{!loading && (
									<div className="category-name">{this.getCategoryName()}</div>
								)}

								{!loading && currentFeedType === FEED_TYPES.CATEGORY && (
									<Dropdown
										className="sort-dropdown"
										overlay={sortMenu}
										trigger={['click']}
									>
										<div className="sort-dropdown-button">
											<span className="current-sort-type">
												{currentSortType}
											</span>
										</div>
									</Dropdown>
								)}
							</div>

							<MediaQuery maxWidth={768}>
								<Icon
									className="search-button"
									component={SearchIcon}
									style={{
										fontSize: '48px',
										color: 'white'
									}}
									onClick={this.showExploreOverlay}
								/>
							</MediaQuery>
						</div>
					</div>
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
			const { loading, user } = this.state;
			return <User user={user} loading={loading} />;
		} else {
			return <Explore />;
		}
	};

	getFeedData = () => {
		const { posts, accounts, currentIndex, isMuted } = this.state;

		return posts.map((post, index) => {
			const { authorID } = post;
			return (
				<ByteVideo
					key={authorID}
					index={index}
					muted={isMuted}
					currentIndex={currentIndex}
					post={post}
					author={accounts[authorID]}
					onCommentsOverlayChange={this.onCommentsOverlayChange}
				/>
			);
		});
	};

	onCommentsOverlayChange = isVisible => {
		this.setState({
			showSliderArrows: isVisible ? false : true,
			allowSwipe: isVisible ? false : true
		});
	};

	onSortChange = e => {
		const { key: currentSortType } = e;
		this.setState({ currentSortType });
	};

	shouldShowUserComponent = () => {
		const getCurrentFeedType = this.getCurrentFeedType();
		return (
			getCurrentFeedType === FEED_TYPES.USER ||
			getCurrentFeedType === FEED_TYPES.REBYTES ||
			getCurrentFeedType === FEED_TYPES.POST
		);
	};

	showExploreOverlay = () => {
		this.setState({ isExploreOverlayOpen: true, showSliderArrows: false });
	};

	onCloseExploreOverlay = () => {
		this.setState({ isExploreOverlayOpen: false, showSliderArrows: true });
	};

	onMuteChange = isMuted => {
		this.setState({ isMuted });
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
