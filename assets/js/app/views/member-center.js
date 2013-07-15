
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
