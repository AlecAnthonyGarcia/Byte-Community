import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './HomePage/index.js';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/popular" component={HomePage} />
				<Route exact path="/latest" component={HomePage} />
				<Route
					exact
					path="/categories/:categoryName/:sort"
					component={HomePage}
				/>
				<Route exact path="/user/:username" component={HomePage} />
				<Route exact path="/user/:username/rebytes" component={HomePage} />
				<Route exact path="/post/:postId" component={HomePage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
