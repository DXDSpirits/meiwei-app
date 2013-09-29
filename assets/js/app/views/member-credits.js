
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
		};
	},
	render: function() {
		var self = this;
		this.credits.fetch({
			reset: true,
			success: function(collection) {
				var balance = _.reduce(collection.pluck('amount'), function(a,b) { return a + b; } );
				self.$('> header > h1 > .balance').html('(' + balance + ')');
				self.initScroller();
			}
		});
	}
}))({el: $("#view-member-credits")});
