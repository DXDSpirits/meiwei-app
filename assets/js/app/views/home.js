$(function() {
    MeiweiApp.Views.MasterHero = MeiweiApp.View.extend({
    	events: { 'tap': 'viewProducts' },
    	initView: function() {
    		this.productItems = new MeiweiApp.Collections.ProductItems();
    		_.bindAll(this, 'renderCarousel');
    	},
    	template: MeiweiApp.Templates['product-carousel'],
    	viewProducts: function(e) {
    		MeiweiApp.goTo('ProductPurchase');
    	},
    	renderCarousel: function() {
    		if (this.scroller) this.scroller.destroy();
    		this.$el.html(this.template({
    			items: _.first(this.productItems.toJSON(), 6),
    			product: {name: MeiweiApp._('Meiwei Concierge')}
    		}));
    		this.$el.prepend('<img src="assets/img/hero.png" />');
    		var items = this.$('.carousel-inner > .carousel-item');
        	this.$('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
    		this.scroller = new IScroll(this.$('.carousel').selector, {
    			tap: true, scrollX: true, scrollY: false
    		});
    		this.scroller.on('scrollStart', function() {
    		    MeiweiApp.Pages.Home.scroller.disable();
    		});
    		this.scroller.on('scrollEnding', function() {
                MeiweiApp.Pages.Home.scroller.enable();
            });
    	},
    	render: function() {
    		if (window.bootstrap && bootstrap.Home && bootstrap.Home.products) {
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
    	events: {
    		'tap': 'viewRestaurant',
    		'tap .order-button': 'gotoOrder'
    	},
    	viewRestaurant: function(e) {
    		var restaurantId = this.model.get('restaurant').id;
    		MeiweiApp.goTo('RestaurantDetail', { restaurantId: restaurantId });
    	},
    	gotoOrder: function(e) {
    		if (e.stopPropagation) e.stopPropagation();
    		var restaurantId = this.model.get('restaurant').id;
    		MeiweiApp.goTo('RestaurantOrder', { restaurantId: restaurantId });
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
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick >header h1': 'goToSearch'
    	},
    	initPage: function() {
    		this.snapStep = 250;
    		this.lazy = 30 * 60 * 1000;
    		_.bindAll(this, 'hero');
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
    	goToSearch: function() { MeiweiApp.goTo('RestaurantSearch'); },
    	hero: function() {
    		var wrapperHeight = 250;
    		if (this.scroller.y <= 0) {
    		    this.$('.hero').removeClass('hero');
        		var page = parseInt((-this.scroller.y) / wrapperHeight);
        		this.$('.recommend-list-item').slice(Math.max(page - 1, 0), page + 2).addClass('hero');
        	}
    	},
    	initScroller: function() {
    		if (this.scroller == null) {
    			if (this.$('.iscroll').length > 0) {
    			    this.scroller = new IScroll(this.$('.iscroll').selector, {
    			    	tap: true
    				});
    				this.hero();
    				this.scroller.on('scrollEnd', this.hero);
    			}
    		} else {
    			this.scroller.refresh();
    			this.hero();
    		}
    	},
    	firstVisit: function() {
            var key = 'visited-view-home';
            if (!localStorage.getItem(key)) {
                this.$el.addClass('first-visit');
                this.$el.one('click', function() {
                    $(this).removeClass('first-visit');
                    localStorage.setItem(key, true);
                });
            }
        },
    	render: function() {
    	    //this.firstVisit();
    		this.views.masterHero.render();
    		if (window.bootstrap && bootstrap.Home && bootstrap.Home.recommend) {
    			this.recommend.items.reset(bootstrap.Home.recommend);
    		}
    		this.recommend.fetch({ reset: true });
    	}
    }))({el: $("#view-home")});
});
