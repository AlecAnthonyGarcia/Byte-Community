import React from 'react';
import './style.scss';

import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { Button, Icon, Input, Row, Col } from 'antd';

import SearchResultsList from './SearchResultsList';

import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

class Explore extends React.Component {
	state = {
		searchQuery: '',
		categories: [],
		whitelistedCategories: [
			'byte://feed/popular/v2',
			'byte://feed/popular/v3',
			'byte://feed/latest'
		]
	};

	componentDidMount() {
		this.getExploreCategories();
	}

	async getExploreCategories() {
		const { whitelistedCategories } = this.state;
		const { auth } = this.props;

		if (auth) {
			whitelistedCategories.push('byte://feed/mix');
		}

		const response = await Api.getExploreCategories();

		const { layout: explore } = response;

		const categories = explore.filter((category) => {
			const { uri } = category;

			if (uri) {
				return (
					whitelistedCategories.includes(uri) ||
					uri.startsWith('byte://community/id/') ||
					uri.startsWith('byte://feed/picks/') ||
					uri.startsWith('byte://feed/hashtags/') ||
					uri.startsWith('byte://account/id/')
				);
			}

			return category;
		});

		this.setState({ categories });
	}

	getCategoryLink = (uri) => {
		const [, categoryType] = uri.split('byte://');

		if (!categoryType) {
			return '';
		}

		if (categoryType.startsWith('feed')) {
			const [, feedType] = uri.split('feed/');

			if (feedType.startsWith('popular')) {
				const [, popularFeedType] = feedType.split('popular/');
				switch (popularFeedType) {
					case 'v2':
						return '/popular/';
					case 'v3':
						return '/popular2/';
					default:
						return '/popular/';
				}
			}
			if (feedType.startsWith('hashtags')) {
				const [, hashtag] = feedType.split('hashtags/');
				return `/hashtag/${hashtag}`;
			}
			if (feedType === 'latest') {
				return '/latest/';
			}
			if (feedType === 'mix') {
				return '/mix/';
			}
			if (feedType.startsWith('picks')) {
				return '/' + feedType;
			}
		}

		if (categoryType.startsWith('community/id/')) {
			const [, communityId] = categoryType.split('community/id/');
			return `/community/${communityId}`;
		}
	};

	onCommunityClick = (category) => {
		const { title, uri } = category;
		const { title: communityName } = title;

		this.onClose();

		const [, communityType] = uri.split('byte://');

		if (communityType.startsWith('account')) {
			const [, userId] = uri.split('id/');
			this.goToUserPage(userId);
		}

		AnalyticsUtil.track(
			'Community Click',
			{
				communityName
			},
			true
		);
	};

	goToUserPage = async (userId) => {
		const { history } = this.props;

		const user = await Api.getUser(userId);
		const { username } = user;

		history.push(`/user/${username}`);
	};

	onClose = () => {
		const { onClose } = this.props;

		// clear searchQuery so UI re-renders and removes SearchResultsList
		this.setState({ searchQuery: '' });

		if (onClose) {
			onClose();
		}
	};

	render() {
		const { showBackButton } = this.props;

		const CategoryHeader = (props) => {
			const { category } = props;
			const { title } = category;
			const { title: titleName, color } = title || {};

			return (
				<h3 className="explore-category-header" style={{ color }}>
					{titleName}
				</h3>
			);
		};

		const CategoryLinkContainer = (props) => {
			const { children, spanLength, keyName, category } = props;
			const { uri } = category;

			return (
				<Col span={spanLength} key={keyName}>
					<Link
						to={this.getCategoryLink(uri)}
						onClick={() => this.onCommunityClick(category)}
					>
						{children}
					</Link>
				</Col>
			);
		};

		const CategoryLink = (props) => {
			const { category } = props;
			const { title } = category;
			const { title: titleName, backgroundColor, color } = title || {};

			return (
				<CategoryLinkContainer
					spanLength={24}
					keyName={titleName}
					category={category}
				>
					<h3 className="explore-category-link" style={{ color }}>
						<span
							style={{ backgroundColor }}
							className="explore-category-link-title"
						>
							{titleName}
						</span>
					</h3>
				</CategoryLinkContainer>
			);
		};

		const CategoryMediumButton = (props) => {
			const { category } = props;
			const { icon, background, title } = category;
			const { color } = background || {};
			const { title: titleName } = title || {};

			return (
				<CategoryLinkContainer
					spanLength={12}
					keyName={titleName}
					category={category}
				>
					<div
						className="explore-category-container"
						style={{ background: color }}
						src={icon}
					>
						<img
							className="explore-category-icon"
							style={{ background: color }}
							src={icon}
							alt={titleName}
						/>
						<p>{titleName}</p>
					</div>
				</CategoryLinkContainer>
			);
		};

		const CategoryLargeButton = (props) => {
			const { category } = props;
			const { background, title, description, uri } = category;
			const { url } = background || {};
			const { title: titleName } = title || {};
			const { title: descriptionName, color: descriptionColor } =
				description || {};

			const MainCategoryContainer = () => (
				<div className="explore-category-main-container">
					<img className="explore-category-main" src={url} alt={titleName} />
					<span className="title">{titleName}</span>
					<span className="description" style={{ color: descriptionColor }}>
						{descriptionName}
					</span>
				</div>
			);

			const categoryLink = this.getCategoryLink(uri);

			return (
				<Col span={24} key={titleName}>
					{categoryLink ? (
						<Link
							to={categoryLink}
							onClick={() => this.onCommunityClick(category)}
						>
							<MainCategoryContainer />
						</Link>
					) : (
						<div
							style={{ cursor: 'pointer' }}
							onClick={() => this.onCommunityClick(category)}
						>
							<MainCategoryContainer />
						</div>
					)}
				</Col>
			);
		};

		const CategoryList = () => {
			const { categories } = this.state;

			return categories.map((category) => {
				const { type } = category;

				switch (type) {
					case 'header':
						return <CategoryHeader category={category} />;
					case 'link':
						return <CategoryLink category={category} />;
					case 'medium':
						return <CategoryMediumButton category={category} />;
					case 'large':
						return <CategoryLargeButton category={category} />;
				}
			});
		};

		const SearchBar = () => {
			const { searchQuery } = this.state;

			const onChange = (e) => {
				const {
					target: { value: searchQuery }
				} = e;

				if (searchQuery === '') {
					this.setState({ searchQuery });
				}
			};

			const onPressEnter = (e) => {
				e.preventDefault();

				const { searchQuery } = this.state;
				const {
					target: { value }
				} = e;

				if (value.trim() !== '' && searchQuery !== value) {
					this.setState({ searchQuery: value });
				}
			};

			return (
				<div className="explore-search">
					{showBackButton && (
						<Button
							primary
							icon="arrow-left"
							className="back-button"
							onClick={this.onClose}
						/>
					)}
					<Input
						placeholder="Search"
						prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
						onPressEnter={onPressEnter}
						onChange={onChange}
						size="large"
						defaultValue={searchQuery}
						allowClear
					/>
				</div>
			);
		};

		const ExploreList = () => {
			const { searchQuery } = this.state;

			if (searchQuery === '') {
				return <CategoryList />;
			} else {
				return (
					<SearchResultsList
						query={searchQuery}
						onResultClicked={this.onClose}
					/>
				);
			}
		};

		return (
			<div className="explore-container">
				<Row>
					<SearchBar />
					<ExploreList />
				</Row>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer } = state;
	const { isAuthenticated } = authReducer;
	return {
		auth: isAuthenticated
	};
}

export default withRouter(connect(mapStateToProps, null)(Explore));
