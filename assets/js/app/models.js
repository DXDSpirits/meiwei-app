MeiweiApp.Collection = Backbone.Collection.extend({
	parse: function(response) {
		if (response.results != null) {
			this.count = response.count;
			this.previous = response.previous;
			this.next = response.next;
			return response.results;
		} else {
			return response;
		}
	}
});

MeiweiApp.Model = Backbone.Model.extend({
	url: function() {
		if (this.attributes.url) {
			return this.attributes.url;
		} else {
			var origUrl = Backbone.Model.prototype.url.call(this);
        	return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
		}
	}
});


/********************************** Restaurants **********************************/


MeiweiApp.Models.Circle = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/circle/'
});
MeiweiApp.Collections.Circles = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/circle/',
	model: MeiweiApp.Models.Circle
});

MeiweiApp.Models.District = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/district/'
});
MeiweiApp.Collections.Districts = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/district/',
	model: MeiweiApp.Models.District
});

MeiweiApp.Models.Review = MeiweiApp.Model.extend({});
MeiweiApp.Collections.Reviews = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.Review
});

MeiweiApp.Models.Picture = MeiweiApp.Model.extend({});
MeiweiApp.Collections.Pictures = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.Picture
});

MeiweiApp.Models.Floorplan = MeiweiApp.Model.extend({});
MeiweiApp.Collections.Floorplans = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.Floorplan
});

MeiweiApp.Models.Hour = MeiweiApp.Model.extend({});
MeiweiApp.Collections.Hours = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.Hour
});

MeiweiApp.Models.Restaurant = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/restaurant/',
	hours: new MeiweiApp.Collections.Hours(),
	reviews: new MeiweiApp.Collections.Reviews(),
	pictures: new MeiweiApp.Collections.Pictures(),
	floorplans: new MeiweiApp.Collections.Floorplans(),
	parse: function(response) {
		this.hours.url = response.hours;
		this.reviews.url = response.reviews;
		this.pictures.url = response.pictures;
		this.floorplans.url = response.floorplans;
		return response;
	}
});

MeiweiApp.Collections.Restaurants = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/restaurant/',
	model: MeiweiApp.Models.Restaurant
});


/********************************** Recommends **********************************/


MeiweiApp.Models.Recommend = MeiweiApp.Model.extend({
	parse: function(response) {
		return response;
	}
});

MeiweiApp.Collections.Recommends = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/recommend/1/',
	model: MeiweiApp.Models.Recommend,
	parse: function(response) {
		return response.recommends;
	}
});


/********************************** Member **********************************/


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
	contacts: new MeiweiApp.Collections.Contacts(),
	profile: new MeiweiApp.Models.Profile(),
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


/********************************** Orders **********************************/


MeiweiApp.Models.Order = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/orders/order/'
});

MeiweiApp.Collections.Orders = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/orders/order/',
	model: MeiweiApp.Models.Order
});
