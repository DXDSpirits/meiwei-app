
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
				restaurant: null,
				restaurantId: this.model.get('restaurant')
			});
		},
		deleteFav: function(e) {
			this.$('.icon-favorite').removeClass('suceed');
			var self = this;
			setTimeout(function() { self.model.destroy(); }, 350);
		}
	})
});

MeiweiApp.Pages.MemberFavorites = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
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
		this.favorites.fetch({reset: true, success: this.showPage});
	}
}))({el: $("#view-member-favorites")});
