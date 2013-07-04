
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

MeiweiApp.me = new (MeiweiApp.Models.Member.extend({
	initialize: function() {
		if (this.contacts == null) this.contacts = new MeiweiApp.Collections.Contacts();
		if (this.profile == null) this.profile = new MeiweiApp.Models.Profile();
	},
	login: function(username, password, callback) {
		Backbone.BasicAuth.set(username, password);
	},
	logout: function(callback) {
		Backbone.BasicAuth.clear();
	},
	register: function(email, moblie, password, callback) {
		$.ajax({
			async: false, type: 'POST',
			url: MeiweiApp.configs.APIHost + '/members/register/',
			data: {"email": email, "mobile": mobile, "password": password},
			success: function(data) {
				MeiweiApp.me.login(data.username, password);
			}
		});
	}
}));
