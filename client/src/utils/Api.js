async function getPopularFeed() {
	const response = await fetch('/api/getPopularFeed', {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getLatestFeed() {
	const response = await fetch('/api/getLatestFeed', {
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

async function getCategoryFeed(categoryName, sort) {
	const response = await fetch(
		`/api/getCategoryFeed?categoryName=${categoryName}&sort=${sort}`,
		{
			method: 'get'
		}
	);
	const data = await response.json();
	return data;
}

async function getUserPosts(username) {
	const response = await fetch(`/api/getUserPosts?username=${username}`, {
		method: 'get'
	});
	const data = await response.json();
	return data;
}

async function getUserRebytes(username) {
	const response = await fetch(`/api/getUserRebytes?username=${username}`, {
		method: 'get'
	});
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
	getUserPosts,
	getUserRebytes,
	getPost,
	searchUser
};

export default Api;
