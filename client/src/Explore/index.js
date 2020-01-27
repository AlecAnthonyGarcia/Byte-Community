import React from 'react';
import './style.scss';

import { Link } from 'react-router-dom';
import { Button, Input, Row, Col } from 'antd';

import UserList from '../UserList';

import Api from '../utils/Api';

class Explore extends React.Component {
	state = {
		searchQuery: '',
		users: [],
		categories: [],
		excludedCategories: ['byte://feed/mix']
	};

	componentDidMount() {
		this.getExploreCategories();
	}

	async getExploreCategories() {
		const { excludedCategories } = this.state;

		const response = await Api.getExploreCategories();

		const { layout: explore } = response;

		const categories = explore.filter(category => {
			return !excludedCategories.includes(category.uri);
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
			return '/popular/';
		}
		if (feedType === 'global') {
			return '/latest/';
		}
		if (feedType.startsWith('categories')) {
			return '/' + feedType;
		}
	};

	onCategoryClick = () => {
		this.onClose();
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
								onClick={this.onCategoryClick}
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
								onClick={this.onCategoryClick}
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

				const {
					target: { value: searchQuery }
				} = e;

				this.setState({ searchQuery: searchQuery });

				if (searchQuery.trim() !== '') {
					this.searchUser(searchQuery);
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

export default Explore;
