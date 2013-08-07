var bootstrap = {};

for (var key in bootstrap) {
	localStorage.setItem(key, JSON.stringify(bootstrap[key]));
}
