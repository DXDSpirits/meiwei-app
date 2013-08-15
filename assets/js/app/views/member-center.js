
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
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	events: {
		'click .member-center-nav > li:nth-child(1)': 'gotoMyProfile',
		'click .member-center-nav > li:nth-child(2)': 'gotoMyOrder',
		'click .member-center-nav > li:nth-child(3)': 'gotoMyCredits',
		'click .member-center-nav > li:nth-child(4)': 'gotoMyFavorites',
		'click .member-center-nav > li:nth-child(5)': 'gotoMyContacts',
		'click .member-center-nav > li:nth-child(6)': 'gotoViewProducts',
		'click .logout-button': 'logout'
	},
	gotoMyProfile:    function() { MeiweiApp.goTo('MemberProfile'); },
	gotoMyOrder:      function() { MeiweiApp.goTo('OrderList'); },
	gotoMyCredits:    function() { MeiweiApp.goTo('MemberCredits'); },
	gotoMyFavorites:  function() { MeiweiApp.goTo('MemberFavorites'); },
	gotoMyContacts:   function() { MeiweiApp.goTo('MemberContacts'); },
	gotoViewProducts: function() { MeiweiApp.goTo('ProductPurchase'); },
	logout:           function() {
		MeiweiApp.me.logout();
		MeiweiApp.goTo('Home');
	},
	initPage: function() {
		this.favorites = new MeiweiApp.Collections.Favorites();
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
		MeiweiApp.me.profile.fetch({success: this.showPage});
		this.favorites.fetch({reset: true, success: this.views.favoriteCarousel.render });
	}
}))({el: $("#view-member-center")});
