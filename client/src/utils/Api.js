async function getPopularFeed(cursor) {
	const response = await fetch(`/api/getPopularFeed?cursor=${cursor}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getLatestFeed(cursor) {
	const response = await fetch(`/api/getLatestFeed?cursor=${cursor}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getExploreCategories() {
	const response = await fetch('/api/getExploreCategories', {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getCategoryFeed(categoryName, sort, cursor) {
	const response = await fetch(
		`/api/getCategoryFeed?categoryName=${categoryName}&sort=${sort}&cursor=${cursor}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getUser(userId) {
	const response = await fetch(`/api/getUser?userId=${userId}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getUserPosts(username, cursor) {
	const response = await fetch(
		`/api/getUserPosts?username=${username}&cursor=${cursor}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getUserRebytes(username, cursor) {
	const response = await fetch(
		`/api/getUserRebytes?username=${username}&cursor=${cursor}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getPost(postId) {
	const response = await fetch(`/api/getPost?id=${postId}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getPostComments(postId, cursor) {
	const response = await fetch(
		`/api/getPostComments?id=${postId}&cursor=${cursor}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getPostLikes(postId, cursor) {
	const response = await fetch(
		`/api/getPostLikes?id=${postId}&cursor=${cursor}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function searchUser(query) {
	const response = await fetch(`/api/searchUser?query=${query}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

const Api = {
	getPopularFeed,
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
