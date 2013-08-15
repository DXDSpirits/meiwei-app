
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
		timeout: 10000
	},
	
	start: function() {	
		MeiweiApp.bindSync();
		MeiweiApp.bindAjaxEvents();
		Backbone.history.start();
		navigator.splashscreen.show();
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 3000);
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
		options.timeout = options.timeout || MeiweiApp.configs.timeout;
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
	}
}

MeiweiApp.bindAjaxEvents = function() {
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
