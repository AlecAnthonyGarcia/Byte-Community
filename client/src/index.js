import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './configureStore';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';

import AnalyticsUtil from './utils/AnalyticsUtil';

const store = configureStore();

// Mixpanel Analytics
AnalyticsUtil.initializeMixpanel();

// Sentry Analytics
// Sentry.init({ dsn: '' });

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
