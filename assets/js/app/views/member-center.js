
MeiweiApp.Views.MemberProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['member-profile-box'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});


MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.View.extend({
	render: function() {
		var path = 'assets/img/default.png';
		if (this.collection.length > 0) {
			var ran = _.random(0, this.collection.length - 1);
			var model = this.collection.at(ran);
			path = model.get('restaurantinfor').frontpic;
		}
		this.$el.html($('<img></img>').attr('src', path));
		return this;
	}
});


MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
	onClickLeftBtn:   function() { MeiweiApp.goTo('Home'); },
	gotoMyProfile:    function() { MeiweiApp.goTo('MemberProfile'); },
	gotoMyOrder:      function() { MeiweiApp.goTo('OrderList'); },
	gotoMyCredits:    function() { MeiweiApp.goTo('MemberCredits'); },
	gotoMyFavorites:  function() { MeiweiApp.goTo('MemberFavorites'); },
	gotoViewProducts: function() { MeiweiApp.goTo('ProductPurchase'); },
	logout:           function() {
		MeiweiApp.me.logout();
		MeiweiApp.goTo('Home');
	},
	initPage: function() {
		this.lazy = 5 * 60 * 1000;
		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(1)'), this.gotoMyProfile);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(2)'), this.gotoMyOrder);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(3)'), this.gotoMyCredits);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(4)'), this.gotoMyFavorites);
		this.bindFastButton(this.$('.member-center-nav > li:nth-child(5)'), this.gotoViewProducts);
		this.bindFastButton(this.$('.logout-button'), this.logout);
		this.favorites = MeiweiApp.me.favorites;
		this.views = {
			profileBox: new MeiweiApp.Views.MemberProfileBox({
				model: MeiweiApp.me.profile,
				el: this.$('.member-profile-box')
			}),
			favoriteCarousel: new MeiweiApp.Views.FavoriteRestoCarousel({
				collection: this.favorites,
				el: this.$('.favorite-resto-carousel')
			})
		}
	},
	render: function() {
		var self = this;
		MeiweiApp.me.fetch({success: function() {
			self.favorites.fetch({
				reset: true,
				success: function() {
					self.views.favoriteCarousel.render();
				}
			});
		}});
	}
}))({el: $("#view-member-center")});
