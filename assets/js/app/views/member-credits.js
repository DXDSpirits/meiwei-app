
MeiweiApp.Views.CreditList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: Mustache.compile('<div class="span"><h1>{{amount}}</h1></div><div class="span"><small>{{reason}}</small></div>'),
		className: 'simple-list-item',
	})
});

MeiweiApp.Pages.MemberCredits = new (MeiweiApp.PageView.extend({
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
