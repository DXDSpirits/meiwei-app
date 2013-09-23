
MeiweiApp.Views.FavoriteList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['favorite-list-item'],
		className: 'restaurant-list-item',
		events: {
			'tap section': 'viewRestaurant',
			'tap .delete-button': 'deleteFav'
		},
		viewRestaurant: function() {
			MeiweiApp.goTo('RestaurantDetail', {
				restaurantId: this.model.get('restaurant')
			});
		},
		deleteFav: function(e) {
			this.$('.icon-favorite').removeClass('succeed');
			var self = this;
			setTimeout(function() {
				self.model.destroy();
				MeiweiApp.Pages.MemberFavorites.initScroller();
			}, 350);
		}
	})
});

MeiweiApp.Pages.MemberFavorites = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
	initPage: function() {
		this.favorites = MeiweiApp.me.favorites;
		this.views = {
			favoriteList: new MeiweiApp.Views.FavoriteList({
				collection: this.favorites,
				el: this.$('.restaurant-list')
			})
		};
		this.initPageNav(this, this.favorites);
	},
	render: function() {
		this.favorites.fetch({ reset: true });
	}
}))({el: $("#view-member-favorites")});
