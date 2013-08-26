
$(function() {
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	document.addEventListener("deviceready", MeiweiApp.start, false);
});

var MeiweiApp = new (Backbone.View.extend({
	
	Models: {},
	Views: {},
	Collections: {},
	
	Templates: {},
	Pages: {},
	
	configs: {
		APIHost: "http://api.clubmeiwei.com",
		StaticHost: "http://api.clubmeiwei.com",
		MediaHost: "http://api.clubmeiwei.com",
		timeout: 30000
	},
	
	start: function() {
		MeiweiApp.showSplash();	
		MeiweiApp.initClientErrors();
		MeiweiApp.initAjaxEvents();
		MeiweiApp.initSync();
		Backbone.history.start();
	}
}))({el: document.body});

MeiweiApp.showSplash = function() {
	try {
		navigator.splashscreen.show();
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 1000);
	} catch (e) { }
}

MeiweiApp.initSync = function() {
	var encode = function(username, password) {
		return btoa(username + ':' + password);
	};
	var auth = JSON.parse(localStorage.getItem('basic-auth'));
	var token = auth && auth.username && auth.password ? encode(auth.username, auth.password) : null;
	var originalSync = Backbone.sync;
	Backbone.sync = function(method, model, options) {
		options.timeout = options.timeout || MeiweiApp.configs.timeout;
		_.extend((options.headers || (options.headers = {})), { 'Accept-Language': 'zh' });
		if (typeof token !== "undefined" && token !== null) {
			_.extend(options.headers, { 'Authorization': 'Basic ' + token });
		}
		return originalSync.call(model, method, model, options);
	};
	MeiweiApp.BasicAuth = {
		get: function() {
			return auth;
		},
		set: function(username, password) {
			auth = {username: username, password: password};
			token = encode(username, password);
			localStorage.setItem('basic-auth', JSON.stringify(auth));
		},
		clear: function() {
			auth = null;
			token = null;
			localStorage.removeItem('basic-auth');
		}
	}
}

MeiweiApp.initAjaxEvents = function() {
	var timeout = 0;
	$(document).ajaxStart(function() {
		$('#apploader').removeClass('hide');
	});
	$(document).ajaxStop(function() {
		setTimeout(function() {
			$('#apploader').addClass('hide');
			timeout = 0;
		}, timeout);
	});
	$(document).ajaxError(function(event, jqxhr, settings, exception) {
		var response = jqxhr.responseJSON || {};
		if (jqxhr.status == 401 || jqxhr.status == 403 || jqxhr.status == 499) {
			if (response.detail != 'Authentication credentials were not provided.') {
				var text = $('#apploader .ajax-error').html();
				$('#apploader .ajax-error').html(response.detail).removeClass('hide');
				setTimeout(function() {
					$('#apploader .ajax-error').html(text).addClass('hide');
				}, (timeout = 2000) + 500);
			}
			MeiweiApp.Pages.MemberLogin.go({ ref: MeiweiApp.history.active });
		} else if (settings.type == 'GET') {
			$('#apploader .ajax-error').removeClass('hide');
			setTimeout(function() {
				$('#apploader .ajax-error').addClass('hide');
				MeiweiApp.goBack();
			}, (timeout = 3000) + 500);
		}
	});
}

MeiweiApp.initClientErrors = function() {
	MeiweiApp.handleError = function(err) {
		var error = new MeiweiApp.Models.ClientError();
		error.save({message: err.message, detail: err.stack}, {global: false});
		console.error(err.message);
	}
	window.onerror = function(message, filaName, lineNumber) {
		var detail = [filaName, lineNumber].join(':');
		var error = new MeiweiApp.Models.ClientError();
		error.save({message: message, detail: detail}, {global: false});
		console.error(message, detail);
	}
}
