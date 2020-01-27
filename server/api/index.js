const express = require('express');
const api = express.Router();

const ByteApi = require('../utils/Api');

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
	const { username } = req.query;

	const response = await ByteApi.getUserPosts(username);

	const { data } = response;

	res.send(data);
});

api.get('/api/getUserRebytes', async function(req, res) {
	const { username } = req.query;

	const response = await ByteApi.getUserRebytes(username);

	const { data } = response;

	res.send(data);
});

api.get('/api/getPost', async function(req, res) {
	const { id } = req.query;

	const response = await ByteApi.getPost(id);

	const { data } = response;

	res.send(data);
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
	const response = await ByteApi.getPopularFeed();

	const { data } = response;

	res.send(data);
});

api.get('/api/getLatestFeed', async function(req, res) {
	const response = await ByteApi.getLatestFeed();

	const { data } = response;

	res.send(data);
});

api.get('/api/getCategoryFeed', async function(req, res) {
	const { categoryName, sort } = req.query;

	const response = await ByteApi.getCategoryFeed(categoryName, sort);

	const { data } = response;

	res.send(data);
});

api.get('/api/getExploreCategories', async function(req, res) {
	const response = await ByteApi.getExploreCategories();

	const { data } = response;

	res.send(data);
});

module.exports = api;
