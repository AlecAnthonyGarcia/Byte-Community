import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LogRocket from 'logrocket';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';

// LogRocket Analytics
// LogRocket.init('');

// Sentry Analytics
// Sentry.init({ dsn: '' });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
