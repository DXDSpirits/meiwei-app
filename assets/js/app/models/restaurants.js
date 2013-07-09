
MeiweiApp.Models.Cuisine = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/cuisine/'
});
MeiweiApp.Collections.Cuisines = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/cuisine/',
	model: MeiweiApp.Models.Cuisine
});

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
		this.hours.reset();
		this.hours.url = response.hours;
		this.reviews.reset();
		this.reviews.url = response.reviews;
		this.pictures.reset();
		this.pictures.url = response.pictures;
		this.floorplans.reset();
		this.floorplans.url = response.floorplans;
		return response;
	}
});

MeiweiApp.Collections.Restaurants = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/restaurant/',
	model: MeiweiApp.Models.Restaurant
});
