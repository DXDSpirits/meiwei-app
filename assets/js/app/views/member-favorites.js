
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
			this.$('.icon-favorite').removeClass('succeed');
			var self = this;
			setTimeout(function() { self.model.destroy(); }, 350);
		}
	})
});

MeiweiApp.Pages.MemberFavorites = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
	initPage: function() {
		new MBP.fastButton(this.$('.page-prev')[0], this.fetchPrev);
		new MBP.fastButton(this.$('.page-next')[0], this.fetchNext);
		this.favorites = MeiweiApp.me.favorites;
		this.views = {
			favoriteList: new MeiweiApp.Views.FavoriteList({
				collection: this.favorites,
				el: this.$('.restaurant-list')
			})
		}
		this.initPageNav(this, this.favorites);
	},
	render: function() {
		this.favorites.fetch({ reset: true });
	}
}))({el: $("#view-member-favorites")});
