
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
	urlRoot: MeiweiApp.configs.APIHost + '/members/credit/'
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
	login: function(username, password, callback) {
		Backbone.BasicAuth.set(username, password);
		this.trigger('login');
	},
	logout: function(callback) {
		Backbone.BasicAuth.clear();
	},
	register: function(username, password, callback) {
		var newUser = new MeiweiApp.Models.Member({ username: username, password: password });
		newUser.save({}, {
			async: false, 
			success: function(model, response, options) {
				MeiweiApp.me.login(username, password);
			},
			error: function(model, xhr, options) {
				
			}
		});
	}
}));
