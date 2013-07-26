
MeiweiApp.Views.MemberProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['member-profile-box'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});


MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: 'img',
		template: Mustache.compile('{{{ restaurant.frontpic }}}'),
		render: function() {
			this.$el.attr('src', this.template(this.model.toJSON()));
			return this;
		}
	})
});


MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
	events: {
		'click .member-center-nav li:nth-child(1)': 'gotoMyProfile',
		'click .member-center-nav li:nth-child(2)': 'gotoMyOrder',
		'click .member-center-nav li:nth-child(3)': 'gotoMyCredits',
		'click .member-center-nav li:nth-child(4)': 'gotoMyFavorites',
		'click .member-center-nav li:nth-child(5)': 'gotoMyContacts',
		'click .member-center-nav li:nth-child(6)': 'gotoViewProducts',
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
	carousel: function() {
		var A = this.$('.favorite-resto-carousel img');
		var L=A.length;
		var i=0;
		$(A[i]).addClass('front');
		var timedCount = function() {
			$(A[i]).removeClass('front');
			$(A[(i+1)%L]).addClass('front');
			i=(i+1)%L;
		};
		this.itv = setInterval(timedCount, 3000);
	},
	render: function() {
		var self = this;
		$.when(
			MeiweiApp.me.profile.fetch(),
			this.favorites.fetch({reset: true})
		).then(function() {
			self.carousel();
			self.showPage();
		});
	}
}))({el: $("#view-member-center")});
