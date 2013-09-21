
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
		if (this.scroller) this.scroller.destroy();
		this.$el.html(this.template({
			items: _.first(this.productItems.toJSON(), 6),
			product: {name: '美位私人管家'}
		}));
		this.$el.prepend('<img src="assets/img/hero.png" />')
		var items = this.$('.carousel-inner > .carousel-item');
		this.$('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
		this.$('.indicator').removeClass('hide').css('width', items.length * 15 - 5);
		this.scroller = new IScroll(this.$('.carousel').selector, {
			scrollX: true, scrollY: false, momentum: false, snap: true,
			indicators: { el: this.$('.indicator')[0], resize: false }
		});
		this.scroller.goToPage(1,0);
	},
	render: function() {
		this.rendered = true;
		if (bootstrap && bootstrap.Home && bootstrap.Home.products) {
			this.productItems.reset(bootstrap.Home.products);
			this.renderCarousel();
		}
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
		this.$el.html(this.template(this.model.toJSON()));
		var $wrapper = this.$('.item-wrapper');
		var img = $('<img></img>').attr('src', this.model.get('restaurant').frontpic).load(function() {
			$wrapper.prepend(img);
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
	initPage: function() {
		this.snapStep = 250;
		this.lazy = 30 * 60 * 1000;
		_.bindAll(this, 'initScroller', 'hero', 'handleScroll', 'handleScrollEnd');
		this.bindFastButton(this.$('>header form'), function() { MeiweiApp.goTo('RestaurantSearch'); });
		this.recommend = new MeiweiApp.Models.Recommend({id: 5});
		this.views = {
			masterHero: new MeiweiApp.Views.MasterHero({
				el: this.$('.master-hero .item-wrapper')
			}),
			recommendItems: new MeiweiApp.Views.RecommendItems({
				collection: this.recommend.items,
				el: this.$('.recommend-flow')
			})
		};
		this.listenTo(this.recommend.items, 'reset', this.initScroller);
	},
	handleScroll: function(e) {
		if (this.scroller.directionY == 1) {
			var distY = Math.max(-50, this.scroller.distY);
			distY = - distY * distY / 50;
			var hero = this.$('.hero').length > 0 ? this.$('.hero') : this.$('.master-hero');
			var nextAll = this.$('.hero').length > 0 ? this.$('.hero').nextAll() : this.$('.recommend-list-item');
			hero.find('.item-wrapper').css('-webkit-transform', 'translate3d(0, ' + distY + 'px, 0)');
			var i = 3;
			nextAll.each(function() {
				var newDistY = Math.min(0, distY * 2 / i);
				$(this).find('.item-wrapper').css('-webkit-transform', 'translate3d(0, ' + newDistY + 'px, 0)');
				i += 1;
			});
		}
	},
	handleScrollEnd: function() {
		this.$('.item-wrapper').addClass('snaping');
		this.$('.item-wrapper').css('-webkit-transform', 'translate3d(0, 0, 0)');
		var self = this;
		setTimeout(function() {
			self.$('.item-wrapper').removeClass('snaping');
		}, 350);
	},
	hero: function() {
		var page = this.scroller.currentPage.pageY - 1;
		var newHero = this.$('.recommend-list-item')[page];
		if (newHero) {
			this.$('.hero').removeClass('hero');
			$(newHero).addClass('hero');
		}
	},
	initScroller: function() {
		if (this.scroller == null) {
			if (this.$('.iscroll').length > 0) {
			    this.scroller = new IScroll(this.$('.iscroll').selector, {
					snap: true, snapStepY: this.snapStep, snapSpeed: 350, bounceEasing: 'quadratic'
					//, momentum: false
				});
				this.hero();
				this.scroller.on('scrollEnd', this.hero);
				//this.scroller.on('scrollMoving', this.handleScroll);
				//this.scroller.on('scrollEnding', this.handleScrollEnd);
			}
		} else {
			this.scroller.refresh();
			this.hero();
		}
	},
	render: function() {
		if (!this.views.masterHero.rendered) this.views.masterHero.render();
		if (bootstrap && bootstrap.Home && bootstrap.Home.recommend) {
			this.recommend.items.reset(bootstrap.Home.recommend);
		}
		this.recommend.fetch({ reset: true });
	}
}))({el: $("#view-home")});
