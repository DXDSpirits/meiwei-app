
MeiweiApp.Views.CreditList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['member-credit-item'],
		className: 'detail-list-item'
	})
});

MeiweiApp.Pages.MemberCredits = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
	onClickRightBtn: function() { MeiweiApp.goTo('ProductRedeem'); },
	initPage: function() {
		this.credits = new MeiweiApp.Collections.Credits();
		this.views = {
			creditList: new MeiweiApp.Views.CreditList({
				collection: this.credits,
				el: this.$('.scroll-inner')
			})
		}
	},
	render: function() {
		this.credits.fetch({reset: true, success: this.showPage});
	}
}))({el: $("#view-member-credits")});
