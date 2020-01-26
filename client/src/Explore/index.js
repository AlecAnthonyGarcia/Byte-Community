import React from 'react';
import './style.scss';

import { Row, Col } from 'antd';

class Explore extends React.Component {
	state = {
		categories: []
	};

	render() {
		const { categories } = this.state;
		return (
			<div className="explore-container">
				<Row>
					{categories.map(category => {
						const { icon, background, title } = category;
						const { color, url } = background;
						const { title: titleName } = title;

						if (icon) {
							return (
								<Col span={12}>
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
								</Col>
							);
						} else {
							return (
								<Col span={24}>
									<div className="explore-category-main-container">
										<img
											className="explore-category-main"
											src={url}
											alt={titleName}
										/>
										<span className="title">{titleName}</span>
									</div>
								</Col>
							);
						}
					})}
				</Row>
			</div>
		);
	}
}

export default Explore;
