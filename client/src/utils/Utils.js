export function isBetaTester(registrationDate) {
	return registrationDate <= 1579860000;
}

export function kFormatter(num) {
	return Math.abs(num) > 999
		? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
		: Math.sign(num) * Math.abs(num);
}
