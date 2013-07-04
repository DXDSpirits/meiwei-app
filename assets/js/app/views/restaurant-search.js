
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
})

MeiweiApp.Pages.RestaurantList = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.collection = new MeiweiApp.Collections.Restaurants();
		this.restaurantListView = new MeiweiApp.Views.RestaurantList({
			collection: this.collection,
			el: this.$('.scroll')
		});
		_.bindAll(this, 'renderRestaurantList');
	},
	renderRestaurantList: function() {
		this.restaurantListView.render();
		this.scroller = new IScroll('#view-restaurant-list .wrapper', {
			scrollX: false, scrollY: true, momentum: true, snap: true, snapStepY: 200
		});
	},
	show: function() {
		this.collection.fetch({
			reset: true,
			success: this.renderRestaurantList 
		});
		this.slideIn();
	}
}))({el: $("#view-restaurant-search")});
