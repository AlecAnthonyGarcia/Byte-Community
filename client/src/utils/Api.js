import axios from 'axios';

async function getPopularFeed(cursor) {
	const { data } = await axios.get(`/api/getPopularFeed?cursor=${cursor}`);
	return data;
}

async function getPopular2Feed(cursor) {
	const { data } = await axios.get(`/api/getPopular2Feed?cursor=${cursor}`);
	return data;
}

async function getLatestFeed(cursor) {
	const { data } = await axios.get(`/api/getLatestFeed?cursor=${cursor}`);
	return data;
}

async function getExploreCategories() {
	const { data } = await axios.get('/api/getExploreCategories');
	return data;
}

async function getCategoryFeed(categoryName, sort, cursor) {
	const { data } = await axios.get(
		`/api/getCategoryFeed?categoryName=${categoryName}&sort=${sort}&cursor=${cursor}`
	);
	return data;
}

async function getUser(userId) {
	const { data } = await axios.get(`/api/getUser?userId=${userId}`);
	return data;
}

async function getUserPosts(username, cursor) {
	const { data } = await axios.get(
		`/api/getUserPosts?username=${username}&cursor=${cursor}`
	);
	return data;
}

async function getUserRebytes(username, cursor) {
	const { data } = await axios.get(
		`/api/getUserRebytes?username=${username}&cursor=${cursor}`
	);
	return data;
}

async function getPost(postId) {
	const { data } = await axios.get(`/api/getPost?id=${postId}`);
	return data;
}

async function getPostComments(postId, cursor) {
	const { data } = await axios.get(
		`/api/getPostComments?id=${postId}&cursor=${cursor}`
	);
	return data;
}

async function getPostLikes(postId, cursor) {
	const { data } = await axios.get(
		`/api/getPostLikes?id=${postId}&cursor=${cursor}`
	);
	return data;
}

async function searchUser(query) {
	const { data } = await axios.get(`/api/searchUser?query=${query}`);
	return data;
}

const Api = {
	getPopularFeed,
	getPopular2Feed,
	getLatestFeed,
	getExploreCategories,
	getCategoryFeed,
	getUser,
	getUserPosts,
	getUserRebytes,
	getPost,
	getPostComments,
	getPostLikes,
	searchUser
};

export default Api;
