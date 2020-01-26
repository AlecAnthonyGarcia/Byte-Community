const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./api');

const app = express();
const port = process.env.PORT || 3001;

const filePath = path.resolve(__dirname, '../client/build', 'index.html');

// Include internal API routes
app.use(api);

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
	const image = '/logo.png';

	data = replaceMetaTags(data, title, description, image);

	return data;
}

function replaceMetaTags(data, title, description, image) {
	data = data.replace(/\$OG_TITLE/g, title);
	data = data.replace(/\$OG_DESCRIPTION/g, description);
	data = data.replace(/\$OG_IMAGE/g, image);
	return data;
}
