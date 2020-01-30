const express = require('express');
const api = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const ByteApi = require('../utils/Api');

const authorizationTokens = ['']; // TODO: add your own authorization tokens

const getAuthorizationToken = getNextAuthorizationToken(authorizationTokens);

const limiter = rateLimit({
	windowMs: 2 * 1000, // 2 seconds
	max: 21 // limit each IP to 21 requests per windowMs
});

api.use(limiter);

api.all('/api/*', function(req, res, next) {
	setAuthorizationToken();
	next();
});

api.get('/api/getUser', async function(req, res) {
	const userId = req.query.userId;

	const response = await ByteApi.getUser(userId);

	const { data } = response;

	res.send(data);
});

api.get('/api/searchUser', async function(req, res) {
	const { query } = req.query;

	const response = await ByteApi.searchUser(query);

	const { data } = response;

	res.send(data);
});

api.get('/api/getUserPosts', async function(req, res) {
	const { username, cursor } = req.query;

	const response = await ByteApi.getUserPosts(username, cursor);

	const { data } = response;

	res.send(data);
});

api.get('/api/getUserRebytes', async function(req, res) {
	const { username, cursor } = req.query;

	const response = await ByteApi.getUserRebytes(username, cursor);

	const { data } = response;

	res.send(data);
});

api.get('/api/getPost', async function(req, res) {
	const { id } = req.query;

	const response = await ByteApi.getPost(id);

	const { data, error } = response;

	res.send(error ? response : data);
});

api.get('/api/getPostComments', async function(req, res) {
	const { id, cursor } = req.query;

	const response = await ByteApi.getPostComments(id, cursor);

	const { data } = response;

	res.send(data);
});

api.get('/api/getPostLikes', async function(req, res) {
	const { id, cursor } = req.query;

	const response = await ByteApi.getPostLikes(id, cursor);

	const { data } = response;

	res.send(data);
});

api.get('/api/getPopularFeed', async function(req, res) {
	return await getFeed(req, res, ByteApi.getPopularFeed);
});

api.get('/api/getPopular2Feed', async function(req, res) {
	return await getFeed(req, res, ByteApi.getPopular2Feed);
});

api.get('/api/getLatestFeed', async function(req, res) {
	return await getFeed(req, res, ByteApi.getLatestFeed);
});

async function getFeed(req, res, apiMethod) {
	const { cursor } = req.query;

	const response = await apiMethod(cursor);

	const { data } = response;

	res.send(data);
}

api.get('/api/getCategoryFeed', async function(req, res) {
	const { categoryName, sort, cursor } = req.query;

	const response = await ByteApi.getCategoryFeed(categoryName, sort, cursor);

	const { data } = response;

	res.send(data);
});

api.get('/api/getExploreCategories', async function(req, res) {
	const response = await ByteApi.getExploreCategories();

	const { data } = response;

	res.send(data);
});

api.post('/api/authenticate', async function(req, res) {
	const { code: googleCode } = req.body;

	const response = await ByteApi.authenticate(googleCode);

	const { data } = response;

	res.send(data);
});

function setAuthorizationToken() {
	axios.defaults.headers.common['Authorization'] = getAuthorizationToken();
}

function getNextAuthorizationToken(authorizationTokens) {
	let currentTokenIndex = 0;
	return function() {
		if (currentTokenIndex >= authorizationTokens.length) currentTokenIndex = 0;
		return authorizationTokens[currentTokenIndex++];
	};
}

module.exports = api;
