
MeiweiApp.Views.FavoriteList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['favorite-list-item'],
		events: {
			'click section': 'viewRestaurant',
			'click .delete-button': 'deleteFav',
		},
		className: 'restaurant-list-item',
		viewRestaurant: function() {
			MeiweiApp.goTo('RestaurantDetail', {
				restaurantId: this.model.get('restaurant')
			});
		},
		deleteFav: function(e) {
			this.model.destroy();
		}
	})
});

MeiweiApp.Pages.MemberFavorites = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.favorites = new MeiweiApp.Collections.Favorites();
		this.views = {
			favoriteList: new MeiweiApp.Views.FavoriteList({
				collection: this.favorites,
				el: this.$('.scroll-inner')
			})
		}
	},
	render: function() {
		$.when(
			this.favorites.fetch({reset: true})
		).then(this.showPage);
	}
}))({el: $("#view-member-favorites")});
