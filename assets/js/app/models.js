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
	initialize: function() {
		if (this.hours == null) this.hours = new MeiweiApp.Collections.Hours();
		if (this.reviews == null) this.reviews = new MeiweiApp.Collections.Reviews();
		if (this.pictures == null) this.pictures = new MeiweiApp.Collections.Pictures();
		if (this.floorplans == null) this.floorplans = new MeiweiApp.Collections.Floorplans();
	},
	parse: function(response) {
		this.initialize();
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


/********************************** Products **********************************/


MeiweiApp.Models.ProductItem = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/productitem/',
});

MeiweiApp.Collections.ProductItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.ProductItem,
});

MeiweiApp.Models.Product = MeiweiApp.Model.extend({
	initialize: function() {
		if (this.items == null) this.items = new MeiweiApp.Collections.ProductItems();
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/product/',
	parse: function(response) {
		this.initialize();
		this.items.reset(response.productitem_set)
		response.productitem_set = null;
		return response;
	}
});

MeiweiApp.Collections.Products = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/product/',
	model: MeiweiApp.Models.Product,
});


/********************************** Recommends **********************************/


MeiweiApp.Models.RecommendItem = MeiweiApp.Model.extend({
});

MeiweiApp.Collections.RecommendItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.RecommendItem,
});

MeiweiApp.Models.Recommend = MeiweiApp.Model.extend({
	initialize: function() {
		if (this.items == null) this.items = new MeiweiApp.Collections.RecommendItems();
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	parse: function(response) {
		this.initialize();
		this.items.reset(response.recommenditem_set)
		response.recommenditem_set = null;
		return response;
	}
});

MeiweiApp.Collections.Recommends = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/recommend/',
	model: MeiweiApp.Models.Recommend,
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


/********************************** Orders **********************************/


MeiweiApp.Models.Order = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/orders/order/'
});

MeiweiApp.Collections.Orders = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/orders/order/',
	model: MeiweiApp.Models.Order
});
