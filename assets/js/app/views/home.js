
MeiweiApp.Views.RecommendItem = MeiweiApp.ModelView.extend({
	events: { 'click img': 'viewRestaurant' },
	tagName: 'section',
	className: 'recommend-list-item',
	template: MeiweiApp.Templates['recommend-list-item'],
	viewRestaurant: function() {
		var restaurantId = this.model.get('restaurant').id
		MeiweiApp.goTo('restaurant/' + restaurantId);
	}
});

MeiweiApp.Views.RecommendItems = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.Views.RecommendItem,
});

MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
	events: _.extend({
		"click header input": function() { MeiweiApp.goTo('restaurant/search'); }
	}, MeiweiApp.PageView.events),
	initPage: function() {
		this.recommend = new MeiweiApp.Models.Recommend({id: 1});
		this.views = {
			recommendItems: new MeiweiApp.Views.RecommendItems({
				collection: this.recommend.items,
				el: this.$('.recommend-flow')
			})
		};
		//this.recommend.items.on('reset', this.initScroller, this);
		_.bindAll(this, 'initScroller', 'hero');
		this.$('header input').click(function() {});
	},
	onClickLeftBtn: function() { MeiweiApp.goTo('member'); },
	onClickRightBtn: function() { console.log('Checkin'); },
	hero: function() {
		var x = this.scroller.currentPage.pageX;
		var y = this.scroller.currentPage.pageY;
		var modelViews = this.views.recommendItems.modelViews;
		this.$('.hero').removeClass('hero');
		modelViews[modelViews.length - y - 1].$el.addClass('hero');
	},
	initScroller: function() {
		if (this.scroller == null) {
		    this.scroller = new IScroll(this.$('.scroll').selector, {
				scrollX: false, scrollY: true, snap: true, snapStepY: 125,
				click: true
			});
			this.scroller.on('scrollEnd', this.hero);
		} else {
			this.scroller.refresh();
		}
	},
	render: function() {
		$.when(
			this.recommend.fetch({ reset: true })
		).then(this.showPage);
	}
}))({el: $("#view-home")});
