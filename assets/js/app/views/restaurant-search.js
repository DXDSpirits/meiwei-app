
MeiweiApp.Views.RestaurantListItem = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'restaurant-list-item',
	template: MeiweiApp.Templates['restaurant-list-item'],
	viewRestaurant: function() {
		MeiweiApp.goTo('restaurant/' + this.model.id);
	}
});

MeiweiApp.Views.RestaurantList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.Views.RestaurantListItem
});

MeiweiApp.Views.Filter = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: 'span',
		template: Mustache.compile('{{name}}'),
		events: { 'click': 'selectFilter' },
		selectFilter: function() {
			this.model.trigger('select');
		}
	})
});

MeiweiApp.Pages.RestaurantSearch = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.restaurants = new MeiweiApp.Collections.Restaurants();
		this.cuisines = new MeiweiApp.Collections.Cuisines();
		this.circles = new MeiweiApp.Collections.Circles();
		
		this.views = {
			restaurantList: new MeiweiApp.Views.RestaurantList({
				collection: this.restaurants,
				el: this.$('.wrapper')
			}),
			cuisineFilter: new MeiweiApp.Views.Filter({
				collection: this.cuisines,
				el: this.$('.filter-circles')
			}),
			circleFilter: new MeiweiApp.Views.Filter({
				collection: this.circles,
				el: this.$('.filter-cuisines')
			})
		}
		_.bindAll(this, 'renderRestaurantList', 'filterRestaurant', 'bindCuisineFilters', 'bindCircleFilters');
	},
	renderRestaurantList: function() {
		this.views.restaurantList.render();
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
	render: function() {
		$.when(
			this.restaurants.fetch({ reset: true, success: this.renderRestaurantList }),
			this.cuisines.fetch({ reset: true, success: this.bindCuisineFilters }),
			this.circles.fetch({ reset: true, success: this.bindCircleFilters })
		).then(this.showPage);
	}
}))({el: $("#view-restaurant-search")});
