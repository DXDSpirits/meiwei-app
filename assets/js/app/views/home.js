$(function() {
    var timeWaitToRefresh = 60 * 1000;
    var MasterHero = MeiweiApp.View.extend({
    	template: MeiweiApp.Templates['product-carousel'],
    	events: { 'tap .carousel-item': 'viewProducts' },
    	initView: function() {
    		this.productItems = new MeiweiApp.Collections.ProductItems();
    		this.ad = new MeiweiApp.Models.Ad();
    		_.bindAll(this, 'renderCarousel', 'renderAd', 'renderConcierge');
    	},
    	viewProducts: function(e) {
    	    if (this.ad.get('online') && this.ad.get('target') == 'external') {
                window.open(this.ad.get('uri'), '_blank', 'location=no');
            } else if (this.ad.get('online') && this.ad.get('target') == 'internal') {
                MeiweiApp.goTo(this.ad.get('uri'));
            } else {
                var el = e.currentTarget;
                MeiweiApp.goTo('ProductPurchase', {itemId: +$(el).attr('data-item')});
            }
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
    		this.scroller = new IScroll(this.$('.carousel').selector, {tap: true, scrollX: true, scrollY: false});
    		this.scroller.on('scrollStart', function() { MeiweiApp.Pages.Home.scroller.disable(); });
    		this.scroller.on('scrollEnding', function() { MeiweiApp.Pages.Home.scroller.enable(); });
    	},
    	renderConcierge: function() {
            if (MeiweiApp.Bootstrap.Home && MeiweiApp.Bootstrap.Home.products) {
                this.productItems.reset(MeiweiApp.Bootstrap.Home.products);
                this.renderCarousel();
            }
            var self = this;
            setTimeout(function() {
                self.productItems.fetch({
                    reset: true, success: self.renderCarousel, data: {recommend: 1}
                });
            }, timeWaitToRefresh);
        },
        renderAd: function() {
            if (this.ad.get('online')) {
                this.$el.html(this.ad.get('template'));
            } else {
                this.renderConcierge();
            }
        },
    	render: function() {
    		this.ad.fetch({success: this.renderAd, error: this.renderConcierge});
    		return this;
    	}
    });
    
    var RecommendItem = MeiweiApp.ModelView.extend({
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
    
    var RecommendItems = MeiweiApp.CollectionView.extend({
    	ModelView: RecommendItem
    });
    
    MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	onClickRightBtn: function() { MeiweiApp.goTo('Attending'); },
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick >header h1, .show-more': 'goToSearch'
    	},
    	initPage: function() {
    		this.snapStep = 250;
    		_.bindAll(this, 'hero', 'renderAll');
    		this.recommend = new MeiweiApp.Models.Recommend({id: 5});
    		this.views = {
    			masterHero: new MasterHero({
    				el: this.$('.master-hero .item-wrapper')
    			}),
    			recommendItems: new RecommendItems({
    				collection: this.recommend.items,
    				el: this.$('.recommend-flow')
    			})
    		};
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
    	renderAll: function() {
    	    this.$('.show-more').removeClass('hidden');
    	    this.initScroller();
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
    	    if (this.checkLazy(30)) {
        		this.views.masterHero.render();
        		if (MeiweiApp.Bootstrap.Home && MeiweiApp.Bootstrap.Home.recommend) {
        			this.recommend.items.reset(MeiweiApp.Bootstrap.Home.recommend);
        			this.renderAll();
        		}
        		var self = this;
        		setTimeout(function() {
        		    self.recommend.fetch({ reset: true, success: self.renderAll });
        		}, timeWaitToRefresh);
        	}
    	}
    }))({el: $("#view-home")});
});
