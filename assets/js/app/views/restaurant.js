
MeiweiApp.Views.RestaurantProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['restaurant-profile-box'],
});

MeiweiApp.Views.RestaurantPictureList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['restaurant-picture'],
	})
});

MeiweiApp.Views.RestaurantReviewList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['restaurant-review'],
	})
});

MeiweiApp.Pages.Restaurant = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.views.restaurantProfileBox = new MeiweiApp.Views.RestaurantProfileBox({
			model: this.restaurant,
			el: this.$('.restaurant-profile')
		});
		this.views.pictures = new MeiweiApp.Views.RestaurantPictureList({
			collection: this.restaurant.pictures,
			el: this.$('.restaurant-pictures')
		});
		this.views.reviews = new MeiweiApp.Views.RestaurantReviewList({
			collection: this.restaurant.reviews,
			el: this.$('.restaurant-reviews')
		});
		_.bindAll(this, 'renderRestaurantProfileBox')
	},
	renderRestaurantProfileBox: function() {
		this.restaurant.pictures.fetch({reset: true});
		this.restaurant.reviews.fetch({reset: true});
	},
	show: function(rid) {
		this.restaurant.set({id: rid});
		this.restaurant.fetch({ success: this.renderRestaurantProfileBox });
		this.slideIn();
	}
}))({el: $("#view-restaurant")});
