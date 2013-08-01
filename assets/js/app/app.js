
var MeiweiApp = new (Backbone.View.extend({
	
	Models: {},
	Views: {},
	Collections: {},
	
	Templates: {},
	Pages: {},
	
	configs: {
		APIHost: "http://localhost:8000",
		StaticHost: "http://localhost:8000",
		MediaHost: "http://localhost:8000"
	},

	log: function(msg) { console.log(msg) },
    
	start: function() {	
		MeiweiApp.bindBasicAuth();
		Backbone.history.start();
	}
}))({el: document.body});

MeiweiApp.bindBasicAuth = function() {
	var token = null;
	var encode = function(username, password) {
		return btoa(username + ':' + password);
	};
	
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
	
	Backbone.BasicAuth = {
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
