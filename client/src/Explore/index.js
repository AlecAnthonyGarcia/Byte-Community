import React from 'react';
import './style.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
			'byte://feed/global'
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

		const categories = explore.filter(category => {
			const { uri } = category;
			return (
				whitelistedCategories.includes(category.uri) ||
				uri.startsWith('byte://feed/categories/')
			);
		});

		this.setState({ categories });
	}

	async searchUser(query) {
		const response = await Api.searchUser(query);

		const { accounts: users } = response;

		this.setState({ users });
	}

	getCategoryLink = uri => {
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
		if (feedType === 'global') {
			return '/latest/';
		}
		if (feedType === 'mix') {
			return '/mix/';
		}
		if (feedType.startsWith('categories')) {
			return '/' + feedType;
		}
	};

	onCategoryClick = categoryName => {
		this.onClose();
		AnalyticsUtil.track(
			'Category Click',
			{
				categoryName
			},
			true
		);
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

			return categories.map(category => {
				const { icon, background, title, uri } = category;
				const { color, url } = background;
				const { title: titleName } = title;

				if (icon) {
					return (
						<Col span={12} key={titleName}>
							<Link
								to={this.getCategoryLink(uri)}
								onClick={() => this.onCategoryClick(titleName)}
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
							</Link>
						</Col>
					);
				} else {
					return (
						<Col span={24} key={titleName}>
							<Link
								to={this.getCategoryLink(uri)}
								onClick={() => this.onCategoryClick(titleName)}
							>
								<div className="explore-category-main-container">
									<img
										className="explore-category-main"
										src={url}
										alt={titleName}
									/>
									<span className="title">{titleName}</span>
								</div>
							</Link>
						</Col>
					);
				}
			});
		};

		const SearchBar = () => {
			const { searchQuery } = this.state;

			const onChange = e => {
				const {
					target: { value: searchQuery }
				} = e;

				if (searchQuery === '') {
					this.setState({ searchQuery });
				}
			};

			const onPressEnter = e => {
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

export default connect(mapStateToProps, null)(Explore);
