
MeiweiApp.Views.RecommendItem = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'recommend-list-item',
	template: MeiweiApp.Templates['recommend-list-item'],
	viewRestaurant: function() {
		var restaurantId = this.model.get('restaurant').id;
		MeiweiApp.goTo('RestaurantDetail', {
			restaurant: null,
			restaurantId: restaurantId
		});
	}
});

MeiweiApp.Views.RecommendItems = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.Views.RecommendItem
});

MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
	onClickRightBtn: function() { MeiweiApp.goTo('Attending'); },
	events: { 'click header input': 'gotoSearch' },
	initPage: function() {
		_.bindAll(this, 'initScroller', 'hero');
		this.recommend = new MeiweiApp.Models.Recommend({id: 2});
		this.views = {
			recommendItems: new MeiweiApp.Views.RecommendItems({
				collection: this.recommend.items,
				el: this.$('.recommend-flow')
			})
		};
		//this.listenTo(this.recommend.items, 'reset', this.initScroller);
	},
	gotoSearch: function() { MeiweiApp.goTo('RestaurantSearch'); },
	hero: function() {
		var x = this.scroller.currentPage.pageX;
		var y = this.scroller.currentPage.pageY;
		var modelViews = this.views.recommendItems.modelViews;
		this.$('.hero').removeClass('hero');
		modelViews[modelViews.length - y - 1].$el.addClass('hero');
	},
	initScroller: function() {
		if (this.scroller == null) {
		    this.scroller = new IScroll(this.$('.iscroll').selector, {
				scrollX: false,
				scrollY: true,
				snap: true,
				snapStepY: 300,
				snapSpeed: 400,
				click: true
			});
			this.hero();
			this.scroller.on('scrollEnd', this.hero);
		} else {
			this.scroller.refresh();
		}
	},
	render: function() {
		$.when(
			this.recommend.fetch({ reset: true, success: this.initScroller })
		).then(this.showPage);
	}
}))({el: $("#view-home")});
