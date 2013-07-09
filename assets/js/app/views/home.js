
MeiweiApp.Views.RecommendItem = MeiweiApp.ModelView.extend({
	events: { 'click img': 'viewRestaurant' },
	tagName: 'section',
	className: 'recommend-list-item',
	template: MeiweiApp.Templates['recommend-list-item'],
	viewRestaurant: function() {
		var restaurantId = this.model.get('restaurant').id
		MeiweiApp.Router.navigate('restaurant/' + restaurantId, {trigger: true});
	}
});

MeiweiApp.Views.RecommendItems = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.Views.RecommendItem,
});

MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.recommend = new MeiweiApp.Models.Recommend({id: 1});
		this.views = {
			recommendItems: new MeiweiApp.Views.RecommendItems({
				collection: this.recommend.items,
				el: this.$('.recommend-flow')
			})
		};
		this.recommend.items.on('reset', this.initScroller, this);
		_.bindAll(this, 'initScroller', 'hero');
	},
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
	show: function() {
		this.recommend.fetch({ reset: true });
		this.slideIn();
	}
}))({el: $("#view-home")});
