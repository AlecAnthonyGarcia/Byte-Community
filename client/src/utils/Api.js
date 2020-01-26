async function getPopularFeed() {
	const response = await fetch('/api/getPopularFeed', {
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

const Api = {
	getPopularFeed,
	getExploreCategories
};

export default Api;
