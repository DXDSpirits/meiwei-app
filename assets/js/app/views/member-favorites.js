
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
		_.bindAll(this, 'refreshList', 'fetchPrev', 'fetchNext');
		new MBP.fastButton(this.$('.page-prev')[0], this.fetchPrev);
		new MBP.fastButton(this.$('.page-next')[0], this.fetchNext);
		this.favorites = MeiweiApp.me.favorites;
		this.views = {
			favoriteList: new MeiweiApp.Views.FavoriteList({
				collection: this.favorites,
				el: this.$('.restaurant-list')
			})
		}
	},
	fetchNext: function() {
		this.scroller.scrollTo(0, 0, 1000);
		var self = this;
		setTimeout(function() { self.favorites.fetchNext({ success: self.refreshList }); }, 1000);
	},
	fetchPrev: function() {
		this.scroller.scrollTo(0, 0, 1000);
		var self = this;
		setTimeout(function() { self.favorites.fetchPrev({ success: self.refreshList }); }, 1000);
	},
	refreshList: function() {
		this.$('.page-next').toggleClass('hide', (this.favorites.next == null));
		this.$('.page-prev').toggleClass('hide', (this.favorites.previous == null));
		this.initScroller();
	},
	render: function() {
		this.favorites.fetch({reset: true, success: this.refreshList});
	}
}))({el: $("#view-member-favorites")});
