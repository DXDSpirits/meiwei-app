
MeiweiApp.Views.MemberProfileBox = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['member-profile-box'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
});

MeiweiApp.Views.FavoriteRestoCarousel = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['favorite-resto-carousel'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
});

MeiweiApp.Pages.MemberCenter = new (MeiweiApp.PageView.extend({
	events: {
		'click .member-center-nav li:nth-child(1)': 'gotoMyOrder',
		'click .member-center-nav li:nth-child(2)': 'gotoMyCredits',
		'click .member-center-nav li:nth-child(3)': 'gotoMyFavorites',
		'click .member-center-nav li:nth-child(4)': 'gotoMyContacts',
		'click .member-center-nav li:nth-child(5)': 'gotoViewProducts'
	},
	gotoMyOrder:      function() { MeiweiApp.Pages.OrderList.go(); },
	gotoMyCredits:    function() { MeiweiApp.Pages.MemberCredits.go(); },
	gotoMyFavorites:  function() { MeiweiApp.Pages.MemberFavorites.go(); },
	gotoMyContacts:   function() { MeiweiApp.Pages.MemberContacts.go(); },
	gotoViewProducts: function() { MeiweiApp.Pages.ProductPurchase.go(); },
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
