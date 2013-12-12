
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
		response.positive = (response.amount > 0);
		response.negative = (response.amount < 0);
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
		this.favorites = new MeiweiApp.Collections.Favorites();
		this.contacts = new MeiweiApp.Collections.Contacts();
		this.profile = new MeiweiApp.Models.Profile(this.get('profile'));
		this.on('change:profile', function() {
            this.profile.set(this.get('profile'));
        }, this);
        this.on('login', function() {
            this.fetch();
            this.favorites.fetch();
            this.contacts.fetch();
        });
	},
	parse: function(response) {
		return _.isArray(response.results) ? response.results[0] : response;
	},
	login: function(auth, options) {
	    this.clear().set(auth);
	    options = options || {};
        options.url = MeiweiApp.configs.APIHost + '/members/login/';
        var success = options.success;
        options.success = function(model, response, options) {
            MeiweiApp.TokenAuth.set(response.token);
            if (success) success(model, response, options);
            model.trigger('login');
        };
        this.save({}, options);
	},
	logout: function(callback) {
		this.clear();
		MeiweiApp.TokenAuth.clear();
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
		Backbone.sync('update', this, options);
	}
}));
