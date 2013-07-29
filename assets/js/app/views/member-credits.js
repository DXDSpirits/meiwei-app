
MeiweiApp.Views.CreditList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['member-credit-item'],
		className: 'detail-list-item'
	})
});

MeiweiApp.Pages.MemberCredits = new (MeiweiApp.PageView.extend({
	onClickRightBtn: function() { MeiweiApp.goTo('ProductPurchase'); },
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
		$.when(
			this.credits.fetch({reset: true})
		).then(this.showPage);
	}
}))({el: $("#view-member-credits")});
