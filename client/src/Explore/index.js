import React from 'react';
import './style.scss';

import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { Button, Icon, Input, Row, Col } from 'antd';

import UserList from '../UserList';

import AnalyticsUtil from '../utils/AnalyticsUtil';
import Api from '../utils/Api';

class Explore extends React.Component {
	state = {
		searchQuery: '',
		users: [],
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
			return (
				uri &&
				(whitelistedCategories.includes(uri) ||
					uri.startsWith('byte://feed/categories/') ||
					uri.startsWith('byte://feed/picks/') ||
					uri.startsWith('byte://account/id/'))
			);
		});

		this.setState({ categories });
	}

	async searchUser(query) {
		const response = await Api.searchUser(query);

		const { accounts: users } = response;

		this.setState({ users });
	}

	getCategoryLink = (uri) => {
		const [, categoryType] = uri.split('byte://');

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
			if (feedType === 'latest') {
				return '/latest/';
			}
			if (feedType === 'mix') {
				return '/mix/';
			}
			if (feedType.startsWith('categories') || feedType.startsWith('picks')) {
				return '/' + feedType;
			}
		}
	};

	onCategoryClick = (category) => {
		const { title, uri } = category;
		const { title: categoryName } = title;

		this.onClose();

		const [, categoryType] = uri.split('byte://');

		if (categoryType.startsWith('account')) {
			const [, userId] = uri.split('id/');
			this.goToUserPage(userId);
		}

		AnalyticsUtil.track(
			'Category Click',
			{
				categoryName
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
		if (onClose) {
			onClose();
		}
	};

	render() {
		const { showBackButton } = this.props;

		const CategoryList = () => {
			const { categories } = this.state;

			return categories.map((category) => {
				const { icon, background, title, description, uri } = category;
				const { color, url } = background;
				const { title: titleName } = title;
				const { title: descriptionName, color: descriptionColor } =
					description || {};

				if (icon) {
					const CategoryContainer = () => (
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
					);

					return (
						<Col span={12} key={titleName}>
							<Link
								to={this.getCategoryLink(uri)}
								onClick={() => this.onCategoryClick(category)}
							>
								<CategoryContainer />
							</Link>
						</Col>
					);
				} else {
					const MainCategoryContainer = () => (
						<div className="explore-category-main-container">
							<img
								className="explore-category-main"
								src={url}
								alt={titleName}
							/>
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
									onClick={() => this.onCategoryClick(category)}
								>
									<MainCategoryContainer />
								</Link>
							) : (
								<div
									style={{ cursor: 'pointer' }}
									onClick={() => this.onCategoryClick(category)}
								>
									<MainCategoryContainer />
								</div>
							)}
						</Col>
					);
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
					this.searchUser(value);
					AnalyticsUtil.track(
						'Search',
						{
							query: value
						},
						true
					);
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
						placeholder="username"
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
			const { searchQuery, users } = this.state;

			if (searchQuery === '') {
				return <CategoryList />;
			} else {
				return <UserList users={users} onUserClick={this.onClose} />;
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
