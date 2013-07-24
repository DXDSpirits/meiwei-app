
MeiweiApp.Views.MemberProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['member-profile-box'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});

MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['favorite-resto-carousel'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});

MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
	events: {
		'click .member-center-nav li:nth-child(1)': 'gotoMyOrder',
		'click .member-center-nav li:nth-child(2)': 'gotoMyCredits',
		'click .member-center-nav li:nth-child(3)': 'gotoMyFavorites',
		'click .member-center-nav li:nth-child(4)': 'gotoMyContacts',
		'click .member-center-nav li:nth-child(5)': 'gotoViewProducts'
	},
	gotoMyOrder:      function() { MeiweiApp.goTo('OrderList'); },
	gotoMyCredits:    function() { MeiweiApp.goTo('MemberCredits'); },
	gotoMyFavorites:  function() { MeiweiApp.goTo('MemberFavorites'); },
	gotoMyContacts:   function() { MeiweiApp.goTo('MemberContacts'); },
	gotoViewProducts: function() { MeiweiApp.goTo('ProductPurchase'); },
	initPage: function() {
		this.views = {
			profileBox: new MeiweiApp.Views.MemberProfileBox({
				model: MeiweiApp.me.profile,
				el: this.$('.member-profile-box')
			})
		}
	},
	render: function() {
		$.when(
			MeiweiApp.me.profile.fetch()
		).then(this.showPage);
	}
}))({el: $("#view-member-center")});
