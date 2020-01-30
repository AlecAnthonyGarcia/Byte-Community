const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const moment = require('moment');
const Sentry = require('@sentry/node');
const api = require('./api');
const ByteApi = require('./utils/Api');

const app = express();
const port = process.env.PORT || 3001;

const filePath = path.resolve(__dirname, '../client/build', 'index.html');

// Sentry Analytics
// +Sentry.init({ dsn: '' });

// for rate limiting
app.set('trust proxy', 1);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Include internal API routes
app.use(api);

app.get('/user/:username', function(req, res) {
	fs.readFile(filePath, 'utf8', async function(err, fileData) {
		if (err) {
			return console.log(err);
		}

		const { username } = req.params;

		const response = await ByteApi.searchUser(username);

		const {
			data: { accounts }
		} = response;
		const [user] = accounts;

		if (!user) {
			fileData = replaceWithDefaultMetaTags(fileData);
			res.send(fileData);
			return;
		}

		let { avatarURL, username: userName, displayName } = user;

		if (!displayName) {
			displayName = `@${username}`;
		}

		fileData = fileData.replace(/\$OG_TITLE/g, `${displayName} on byte`);
		fileData = fileData.replace(
			/\$OG_DESCRIPTION/g,
			`@${userName} • Watch 6-second looping videos created by ${displayName}`
		);
		fileData = fileData.replace(/\$OG_IMAGE/g, avatarURL);
		res.send(fileData);
	});
});

app.get('/post/:postId', function(req, res) {
	fs.readFile(filePath, 'utf8', async function(err, fileData) {
		if (err) {
			return console.log(err);
		}

		const { postId } = req.params;

		const response = await ByteApi.getPost(postId);

		const { data } = response;

		if (!data) {
			fileData = replaceWithDefaultMetaTags(fileData);
			res.send(fileData);
			return;
		}

		const { authorID, accounts, date, caption: description, thumbSrc } = data;
		const user = accounts[authorID];
		const { username } = user;

		const timestampString = moment.unix(date).format('MMMM Do YYYY, h:mm A');
		const title = `byte post by @${username} • ${timestampString}`;

		fileData = replaceMetaTags(fileData, title, description, thumbSrc);

		res.send(fileData);
	});
});

app.get('/', function(req, res) {
	handleDefaultRoute(res);
});

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', function(req, res) {
	handleDefaultRoute(res);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

function handleDefaultRoute(response) {
	fs.readFile(filePath, 'utf8', async function(err, fileData) {
		if (err) {
			return console.log(err);
		}

		fileData = replaceWithDefaultMetaTags(fileData);

		response.send(fileData);
	});
}

function replaceWithDefaultMetaTags(data) {
	const title = 'byte community';
	const description = 'a new looping video app by the creator of vine';
	const image = 'https://www.byte.community/logo.png';

	data = replaceMetaTags(data, title, description, image);

	return data;
}

function replaceMetaTags(data, title, description, image) {
	data = data.replace(/\$OG_TITLE/g, title);
	data = data.replace(/\$OG_DESCRIPTION/g, description);
	data = data.replace(/\$OG_IMAGE/g, image);
	return data;
}
