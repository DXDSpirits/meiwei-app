
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
	
	events: {},

	log: function(msg) { console.log(msg) },
    
    bindBasicAuth: function() {
		var token = null;
		var encode = function(username, password) {
			return btoa(username + ':' + password);
		};
		
		var originalSync = Backbone.sync;
		Backbone.sync = function(method, model, options) {
			if (typeof token !== "undefined" && token !== null) {
				options.headers = options.headers || {};
				_.extend(options.headers, { 'Authorization': 'Basic ' + token });
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
    },
    
	start: function() {
		MeiweiApp.bindBasicAuth();
		Backbone.BasicAuth.set('dxdeat', '123abc');
		Backbone.history.start();
	}
}))({el: document.body});


$(function(){
	MeiweiApp.start();
});

/*'click a[data-router]': function(e) {
	e.preventDefault();
	Backbone.history.navigate(e.target.pathname, {trigger: true});
},*/
/*'touchstart .view>.wrapper': function(e) {
	document.body.style.height = '600px';
	setTimeout( function(){ window.scrollTo(0, 0); }, 0 );
}*/
