
MeiweiApp.Models.Profile = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/profile/',
});

MeiweiApp.Models.Member = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/member/',
});

MeiweiApp.Models.Contact = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/contact/'
});

MeiweiApp.Collections.Contacts = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/members/contact/',
	model: MeiweiApp.Models.Contact
});

MeiweiApp.Models.Credit = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/credit/',
	parse: function(response) {
		var time = (new Date(response.time_created)).toISOString();
		response.time_created = time.slice(0, 10) + ' ' + time.slice(11, 16);
		return response;
	}
});

MeiweiApp.Collections.Credits = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/members/credit/',
	model: MeiweiApp.Models.Credit
});

MeiweiApp.Models.Anniversary = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/anniversary/',
	parse: function(response) {
		var date = (new Date(response.date)).toISOString();
		response.month = date.slice(5, 7);
		response.day = date.slice(8, 10);
		return response;
	}
});

MeiweiApp.Collections.Anniversaries = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/members/anniversary/',
	model: MeiweiApp.Models.Anniversary
});

MeiweiApp.Models.Favorite = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/favorite/'
});

MeiweiApp.Collections.Favorites = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/members/favorite/',
	model: MeiweiApp.Models.Favorite
});

MeiweiApp.me = new (MeiweiApp.Models.Member.extend({
	initialize: function() {
		if (this.favorites == null) this.favorites = new MeiweiApp.Collections.Favorites();
		if (this.contacts == null) this.contacts = new MeiweiApp.Collections.Contacts();
		if (this.profile == null) this.profile = new MeiweiApp.Models.Profile();
	},
	parse: function(response) {
		if (_.isArray(response.results)) response = response.results[0];
		if (response.profile) this.profile.set(response.profile);
		return response;
	},
	login: function(auth, options) {
		MeiweiApp.BasicAuth.set(auth.username, auth.password);
		this.clear();
		this.fetch({ success: options.success, error: options.error });
		this.trigger('login');
	},
	logout: function(callback) {
		this.clear();
		MeiweiApp.BasicAuth.clear();
		this.trigger('logout');
	},
	register: function(auth, options) {
		var newUser = new MeiweiApp.Models.Member();
		newUser.save({ username: auth.username, password: auth.password }, {
			success: options.success,
			error: options.error,
			url: MeiweiApp.configs.APIHost + '/members/register/'
		});
	},
	changePassword: function(password, options) {
		this.set({password: password});
		options = options || {};
		options.url = this.url() + 'change_password/';
		var success = options.success;
		options.success = function(model, response, options) {
			var auth = MeiweiApp.BasicAuth.get();
			auth.password = password;
			MeiweiApp.BasicAuth.set(auth.username, auth.password)
			if (success) success(model, response, options);
		};
		Backbone.sync('update', this, options);
	}
}));
