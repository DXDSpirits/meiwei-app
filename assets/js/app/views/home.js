
MeiweiApp.Views.MasterHero = MeiweiApp.View.extend({
	initialize: function() {
		this.productItems = new MeiweiApp.Collections.ProductItems();
		_.bindAll(this, 'renderCarousel', 'viewProducts');
		this.bindFastButton(this.$el, this.viewProducts);
	},
	template: MeiweiApp.Templates['product-carousel'],
	viewProducts: function(e) {
		MeiweiApp.goTo('ProductPurchase');
	},
	renderCarousel: function() {
		this.$el.append(this.template({
			items: _.first(this.productItems.toJSON(), 6)
		}));
		this.$('>header').html('<h1>美位私人管家</h1>');
		var items = $('.carousel-inner > .carousel-item');
		this.$('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
		this.$('.indicator').removeClass('hide').css('width', items.length * 15 - 5);
		this.scroller = new IScroll(this.$('.carousel').selector, {
			scrollX: true, scrollY: false, momentum: false, snap: true,
			indicators: {
				el: this.$('.indicator')[0],
				resize: false
			}
		});
		this.scroller.goToPage(1,0);
	},
	render: function() {
		this.productItems.fetch({
			reset: true,
			success: this.renderCarousel,
			data: {recommend: 1}
		});
		return this;
	}
});

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
			self.$('.item-wrapper').prepend(img);
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
	events: {
		'click header form': 'gotoSearch'
	},
	initPage: function() {
		_.bindAll(this, 'initScroller', 'hero', 'handleScroll', 'handleScrollEnd');
		this.recommend = new MeiweiApp.Models.Recommend({id: 5});
		this.views = {
			masterHero: new MeiweiApp.Views.MasterHero({
				el: this.$('.master-hero')
			}),
			recommendItems: new MeiweiApp.Views.RecommendItems({
				collection: this.recommend.items,
				el: this.$('.recommend-flow')
			})
		};
		this.views.masterHero.render();
	},
	handleScroll: function(e) {
		var snapStep = 150;
		var modelViews = this.views.recommendItems.modelViews;
		var page = parseInt(-this.scroller.y / snapStep);
		var delta = snapStep * page + this.scroller.y;
		if (delta < 0) {
			var add = parseInt((-delta) / snapStep);
			this.newPage = page + add;
			delta = -((-delta) % snapStep);
			if (modelViews[page+add])
				modelViews[page+add].$('.item-wrapper').css('-webkit-transform', 'translate3d(0, ' + delta + 'px, 0)');
		} else {
			var add = parseInt(delta / snapStep) + 1;
			this.newPage = page - add;
			delta = delta % snapStep;
			if (modelViews[page-add])
				modelViews[page-add].$('.item-wrapper').css('-webkit-transform', 'translate3d(0, ' + (-snapStep + delta) + 'px, 0)');
		}
	},
	handleScrollEnd: function() {
		var snapStep = 150;
		var modelViews = this.views.recommendItems.modelViews;
		var page = parseInt(-this.scroller.y / snapStep);
		var delta = snapStep * page + this.scroller.y;
		if (delta == 0) {
			return;
		}
		if (page >= (this.currentPage || 0)) {
			page += 1;
		}
		this.scroller.scrollTo(0, -snapStep * (page), 500);
		this.currentPage = page;
		
		for (var i=0; i<modelViews.length; i++) {
			modelViews[i].$('.item-wrapper').addClass('snaping');
			if (i < page) {
				modelViews[i].$('.item-wrapper').css('-webkit-transform', 'translate3d(0, -150px, 0)');
			} else {
				modelViews[i].$('.item-wrapper').css('-webkit-transform', 'translate3d(0, 0, 0)');
			}
		}
		setTimeout(function() {
			for (var i=0; i<modelViews.length; i++) {
				modelViews[i].$('.item-wrapper').removeClass('snaping');
			}
		}, 500);
	},
	gotoSearch: function() { MeiweiApp.goTo('RestaurantSearch'); },
	hero: function() {
		var page = this.scroller.currentPage.pageY - 1;
		var modelViews = this.views.recommendItems.modelViews;
		this.$('.hero').removeClass('hero');
		if (page >= 0 && modelViews[page]) {
			modelViews[page].$el.addClass('hero');
		}
	},
	initScroller: function() {
		if (this.scroller == null) {
			if (this.$('.iscroll').length > 0) {
			    this.scroller = new IScroll(this.$('.iscroll').selector, {
					//snap: true, snapStepY: 150, snapSpeed: 500, momentum: false
					momentum: false
				});
				//this.hero();
				//this.scroller.on('scrollEnd', this.hero);
				this.scroller.on('scrollMove', this.handleScroll);
				this.scroller.on('scrollEnd', this.handleScrollEnd);
				//this.scroller.on('gotPage', this.handleScrollEnd);
				//this.scroller.on('flick', this.handleScrollEnd);
			}
		} else {
			this.scroller.refresh();
			//this.hero();
		}
	},
	render: function() {
		this.recommend.fetch({ reset: true, success: this.initScroller });
	}
}))({el: $("#view-home")});
