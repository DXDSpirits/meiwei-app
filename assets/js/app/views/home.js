
MeiweiApp.Views.RecommendItem = MeiweiApp.ModelView.extend({
	tagName: 'section',
	className: 'recommend-list-item',
	template: MeiweiApp.Templates['recommend-list-item'],
	initModelView: function() {
		_.bindAll(this, 'viewRestaurant');
		this.bindFastButton(this.$el, this.viewRestaurant);
	},
	viewRestaurant: function(e) {
		var restaurantId = this.model.get('restaurant').id;
		var dest = (e.target || e.srcElement) == this.$('.order-button')[0] ? 'RestaurantOrder' : 'RestaurantDetail';
		MeiweiApp.goTo(dest, { restaurantId: restaurantId });
	},
	render: function() {
		var self = this;
		var img = $('<img></img>').attr('src', this.model.get('restaurant').frontpic).load(function() {
			self.$el.html(self.template(self.model.toJSON()));
			self.$el.prepend(img);
		});
		return this;
	}
});

MeiweiApp.Views.RecommendItems = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.Views.RecommendItem
});

MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
	onClickRightBtn: function() { MeiweiApp.goTo('Attending'); },
	events: { 'click header form': 'gotoSearch' },
	initPage: function() {
		_.bindAll(this, 'initScroller', 'hero');
		this.recommend = new MeiweiApp.Models.Recommend({id: 5});
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
		if (y > 0 && modelViews[y-1]) {
			modelViews[y-1].$el.addClass('hero');
		}
	},
	initScroller: function() {
		if (this.scroller == null) {
			if (this.$('.iscroll').length > 0) {
			    this.scroller = new IScroll(this.$('.iscroll').selector, {
					snap: true, snapStepY: 300
				});
				this.hero();
				this.scroller.on('scrollEnd', this.hero);
			}
		} else {
			this.scroller.refresh();
			this.hero();
		}
	},
	render: function() {
		this.recommend.fetch({ reset: true, success: this.initScroller });
	}
}))({el: $("#view-home")});
