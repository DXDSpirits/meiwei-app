
$(function() {
	MeiweiApp.start();
	document.addEventListener("deviceready", MeiweiApp.start, false);
});

var MeiweiApp = new (Backbone.View.extend({
	
	Models: {},
	Views: {},
	Collections: {},
	
	Templates: {},
	Pages: {},
	
	configs: {
		APIHost: "http://localhost:8000",
		StaticHost: "http://localhost:8000",
		MediaHost: "http://localhost:8000",
		timeout: 10000
	},
	
	start: function() {	
		MeiweiApp.bindSync();
		Backbone.history.start();
	}
}))({el: document.body});

MeiweiApp.bindSync = function() {
	var encode = function(username, password) {
		return btoa(username + ':' + password);
	};
	var auth = JSON.parse(localStorage.getItem('basic-auth'));
	var token = auth && auth.username && auth.password ? encode(auth.username, auth.password) : null;
	
	var originalSync = Backbone.sync;
	Backbone.sync = function(method, model, options) {
		if (typeof token !== "undefined" && token !== null) {
			options.headers = options.headers || {};
			_.extend(options.headers, {
				'Authorization': 'Basic ' + token,
				'Accept-Language': 'zh'
			});
		}
		return originalSync.call(model, method, model, options);
	};
	MeiweiApp.BasicAuth = {
		set: function(username, password) {
			localStorage.setItem('basic-auth', JSON.stringify({username: username, password: password}));
			token = encode(username, password);
		},
		clear: function() {
			localStorage.removeItem('basic-auth');
			token = null;
		}
	};
};
