
MeiweiApp.Views.MemberProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['member-profile-box'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});


MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.View.extend({
	initialize: function() {
		_.bindAll(this, 'render');
	},
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
		new MBP.fastButton(this.$('.member-center-nav > li:nth-child(1)')[0], this.gotoMyProfile);
		new MBP.fastButton(this.$('.member-center-nav > li:nth-child(2)')[0], this.gotoMyOrder);
		new MBP.fastButton(this.$('.member-center-nav > li:nth-child(3)')[0], this.gotoMyCredits);
		new MBP.fastButton(this.$('.member-center-nav > li:nth-child(4)')[0], this.gotoMyFavorites);
		new MBP.fastButton(this.$('.member-center-nav > li:nth-child(5)')[0], this.gotoViewProducts);
		new MBP.fastButton(this.$('.logout-button')[0], this.logout);
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
					self.showPage();
				}
			});
		}});
	}
}))({el: $("#view-member-center")});
