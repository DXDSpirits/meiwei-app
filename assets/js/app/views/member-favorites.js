$(function() {
    MeiweiApp.Views.FavoriteList = MeiweiApp.CollectionView.extend({
    	initCollectionView: function() {
    		if (this.collection) this.stopListening(this.collection, 'add');
    	},
    	ModelView: MeiweiApp.ModelView.extend({
    		template: TPL['favorite-list-item'],
    		className: 'restaurant-list-item',
    		events: {
    			'fastclick section': 'viewRestaurant',
    			'fastclick .delete-button': 'deleteFav'
    		},
    		viewRestaurant: function() {
    			MeiweiApp.goTo('RestaurantDetail', {
    				restaurant: this.model.get('restaurantinfor')
    			});
    		},
    		deleteFav: function(e) {
    			this.$('.icon-favorite').removeClass('succeed');
    			var self = this;
    			setTimeout(function() {
    				self.model.destroy();
    			}, 350);
    		},
    		render: function() {
    			MeiweiApp.ModelView.prototype.render.call(this);
    			if (this.model) {
    				MeiweiApp.loadBgImage(this.$('.thumbnail'), this.model.get('restaurantinfor').frontpic, {
    					width: 89, height: 89
    				});
    			}
    			return this;
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
});
