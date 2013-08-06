
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
		MeiweiApp.bindCustomSync();
		Backbone.history.start();
	}
}))({el: document.body});

MeiweiApp.bindCustomSync = function() {
	var token = null;
	var encode = function(username, password) {
		return btoa(username + ':' + password);
	};
	var defaultOptions = {
		timeout: MeiweiApp.configs.timeout,
		headers : { 'Accept-Language': 'zh' }
	};
	var originalSync = Backbone.sync;
	Backbone.sync = function(method, model, options) {
		var options = _.defaults(options || {}, defaultOptions);
		if (typeof token !== "undefined" && token !== null) {
			options.headers = options.headers || {};
			_.extend(options.headers, { 'Authorization': 'Basic ' + token });
		}
		return originalSync.call(model, method, model, options);
	};
	MeiweiApp.BasicAuth = {
		set: function(username, password) {
			token = encode(username, password);
		},
		clear: function() {
			token = null;
		}
	};
};

$(function() {
	MeiweiApp.start();
	document.addEventListener("deviceready", MeiweiApp.start, false);
});
