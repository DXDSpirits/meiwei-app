
MeiweiApp.Views.FavoriteList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['favorite-list-item'],
		events: { 'click': 'viewRestaurant' },
		className: 'restaurant-list-item',
		viewRestaurant: function() {
			MeiweiApp.Pages.RestaurantDetail.go({restaurantId: this.model.id});
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
	onClickLeftBtn: function() { MeiweiApp.Pages.MemberCenter.go(); },
	render: function() {
		$.when(
			this.favorites.fetch({reset: true})
		).then(this.showPage);
	}
}))({el: $("#view-member-favorites")});
