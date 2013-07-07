
MeiweiApp.Views.RestaurantListItem = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'restaurant-list-item',
	template: MeiweiApp.Templates['restaurant-list-item'],
	viewRestaurant: function() {
		MeiweiApp.Router.navigate('restaurant/' + this.model.id, {trigger: true});
	}
});

MeiweiApp.Views.RestaurantList = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.Views.RestaurantListItem
});

MeiweiApp.Views.Filter = MeiweiApp.CollectionView.extend({
	modelView: MeiweiApp.ModelView.extend({
		template: Mustache.compile('<li>{{name}}</li>'),
		events: { 'click': 'selectFilter' },
		selectFilter: function() {
			this.model.trigger('select');
		}
	})
});

MeiweiApp.Pages.RestaurantList = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.restaurants = new MeiweiApp.Collections.Restaurants();
		this.views.restaurantList = new MeiweiApp.Views.RestaurantList({
			collection: this.restaurants,
			el: this.$('.scroll .wrapper')
		});
		this.cuisines = new MeiweiApp.Collections.Cuisines();
		this.circles = new MeiweiApp.Collections.Circles();
		this.views.cuisineFilter = new MeiweiApp.Views.Filter({
			collection: this.cuisines,
			el: this.$('.filter :nth-child(1)')
		});
		this.views.circleFilter = new MeiweiApp.Views.Filter({
			collection: this.circles,
			el: this.$('.filter :nth-child(2)')
		});
		_.bindAll(this, 'renderRestaurantList', 'filterRestaurant', 'bindCuisineFilters', 'bindCircleFilters');
	},
	renderRestaurantList: function() {
		this.views.restaurantList.render();
		this.scroller = new IScroll(this.$('.scroll').selector, {
			scrollX: false, scrollY: true, momentum: true, snap: true, snapStepY: 200
		});
	},
	filterRestaurant: function(filter) {
		this.restaurants.fetch({ reset: true, success: this.renderRestaurantList, data: filter });
	},
	bindCuisineFilters: function(cuisines, response, options) {
		var bindFilter = function(cuisine) {
			cuisine.on("select", function() { this.filterRestaurant({cuisine: cuisine.id}); }, this)
		}; cuisines.forEach(bindFilter, this);
	},
	bindCircleFilters: function(circles, response, options) {
		var bindFilter = function(circle) {
			circle.on("select", function() { this.filterRestaurant({circle: circle.id}); }, this)
		}; circles.forEach(bindFilter, this);
	},
	show: function() {
		this.filterRestaurant();
		this.cuisines.fetch({ reset: true, success: this.bindCuisineFilters });
		this.circles.fetch({ reset: true, success: this.bindCircleFilters });
		this.slideIn();
	}
}))({el: $("#view-restaurant-search")});
