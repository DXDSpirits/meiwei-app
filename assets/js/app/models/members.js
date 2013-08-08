
MeiweiApp.Models.Profile = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/profile/',
	parse: function(response) {
		if (response.results != null) return response.results[0]; else return response;
	}
});

MeiweiApp.Models.Member = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/member/',
	parse: function(response) {
		if (response.results != null) return response.results[0]; else return response;
	}
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

MeiweiApp.Models.Favorite = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/members/favorite/'
});

MeiweiApp.Collections.Favorites = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/members/favorite/',
	model: MeiweiApp.Models.Favorite
});

MeiweiApp.me = new (MeiweiApp.Models.Member.extend({
	initialize: function() {
		if (this.contacts == null) this.contacts = new MeiweiApp.Collections.Contacts();
		if (this.profile == null) this.profile = new MeiweiApp.Models.Profile();
	},
	login: function(auth, options) {
		MeiweiApp.BasicAuth.set(auth.username, auth.password);
		this.profile.clear();
		this.profile.fetch({
			success: options.success,
			error: options.error
		});
	},
	logout: function(callback) {
		MeiweiApp.BasicAuth.clear();
	},
	register: function(auth, options) {
		var newUser = new MeiweiApp.Models.Member({ username: auth.username, password: auth.password });
		newUser.save({}, {
			async: false, 
			success: options.success,
			error: options.error
		});
	}
}));
