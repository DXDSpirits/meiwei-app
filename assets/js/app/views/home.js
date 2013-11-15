$(function() {
    var timeWaitToRefresh = 60 * 1000;
    
    var RecommendsFilter = MeiweiApp.CollectionView.extend({
        events: { 'fastclick': 'closeFilter' },
        closeFilter: function() { MeiweiApp.Pages.Home.$('.recommends-filter').addClass('closed'); },
        ModelView: MeiweiApp.ModelView.extend({
            className: 'filter-item',
            template: Mustache.compile('{{name}}'),
            events: { 'fastclick': 'onclick' },
            onclick: function() {
                MeiweiApp.sendGaEvent('homepage list', 'select', 'recommend', this.model.id);
                MeiweiApp.Pages.Home.recommend.clear();
                MeiweiApp.Pages.Home.recommend.id = this.model.id;
                MeiweiApp.Pages.Home.recommend.fetch({ reset: true, success: MeiweiApp.Pages.Home.renderAll });
                MeiweiApp.Pages.Home.$('.recommends-filter').addClass('closed');
            }
        })
    });
    
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
    	    MeiweiApp.Bootstrap.set('home-product-items', this.productItems.toJSON());
    		if (this.scroller) this.scroller.destroy();
    		this.$el.html(this.template({
    			items: _.first(this.productItems.toJSON(), 6),
    			product: {name: MeiweiApp._('Meiwei Concierge')}
    		}));
    		var items = this.productItems;
            this.$('.carousel-item').each(function() {
                var id = +$(this).attr('data-item');
                var localImage = 'assets/img/bootstrap/product/'+ id +'.jpg';
                MeiweiApp.preloadImage($(this).find('.img img'), localImage, items.get(id).get('picture'));
            });
    		this.$el.prepend('<img src="assets/img/hero.png" />');
    		var items = this.$('.carousel-inner > .carousel-item');
        	this.$('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
    		this.scroller = new IScroll(this.$('.carousel').selector, {tap: true, scrollX: true, scrollY: false});
    		this.scroller.on('scrollStart', function() { MeiweiApp.Pages.Home.scroller.disable(); });
    		this.scroller.on('scrollEnding', function() { MeiweiApp.Pages.Home.scroller.enable(); });
    	},
    	renderConcierge: function() {
    	    var products = MeiweiApp.Bootstrap.get('home-product-items');
            if (products) {
                this.productItems.reset(products);
                this.renderCarousel();
            } else {
                timeWaitToRefresh = 0;
            }
            this.productItems.fetch({
                reset: true, success: this.renderCarousel, data: {recommend: 1}, delay: timeWaitToRefresh
            });
        },
        renderAd: function() {
            if (this.ad.get('online')) {
                this.$el.html(this.ad.get('template'));
            }
        },
    	render: function() {
    	    this.renderConcierge();
    		this.ad.fetch({success: this.renderAd});
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
    		var localImage = 'assets/img/bootstrap/restaurant/' + this.model.get('restaurant').id + '.jpg';
    		$wrapper.prepend('<img></img>');
    		MeiweiApp.preloadImage($wrapper.find('>img'), localImage, this.model.get('restaurant').frontpic);
    		return this;
    	}
    });
    
    var RecommendItems = MeiweiApp.CollectionView.extend({
    	ModelView: RecommendItem
    });
    
    MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	//onClickRightBtn: function() { MeiweiApp.goTo('Attending'); },
    	onClickRightBtn: function() {
    	    this.$('.recommends-filter').toggleClass('closed');
    	    MeiweiApp.sendGaEvent('homepage list', 'select');
    	},
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick >header h1, .show-more': 'goToSearch'
    	},
    	initPage: function() {
    		this.snapStep = 250;
    		_.bindAll(this, 'hero', 'renderAll');
    		this.recommendNames = new MeiweiApp.Collections.RecommendNames();
    		this.recommend = new MeiweiApp.Models.Recommend({id: 5});
    		this.views = {
    			masterHero: new MasterHero({ el: this.$('.master-hero .item-wrapper') }),
    			recommendItems: new RecommendItems({ collection: this.recommend.items, el: this.$('.recommend-flow') }),
    			recommendsFilter: new RecommendsFilter({ collection: this.recommendNames, el: this.$('.recommends-filter') })
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
    			    this.scroller = new IScroll(this.$('.iscroll').selector, { tap: true });
    				this.hero();
    				this.scroller.on('scrollEnd', this.hero);
    			}
    		} else {
    			this.scroller.refresh();
    			this.hero();
    		}
    	},
    	renderAll: function() {
    	    MeiweiApp.Bootstrap.set('home-recommend-items', this.recommend.items.toJSON());
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
    	    var listId = this.options.listId;
    	    if (listId || this.checkLazy(30)) {
    	        this.views.masterHero.render();
    	        var recommendNames = MeiweiApp.Bootstrap.get('home-recommendnames');
    	        if (recommendNames) {
    	            this.recommendNames.reset(recommendNames);
    	        } else {
    	            timeWaitToRefresh = 0;
    	        }
        		var recommends = MeiweiApp.Bootstrap.get('home-recommend-items');
        		if (recommends) {
        			this.recommend.items.reset(recommends);
        			this.renderAll();
        		} else {
        		    timeWaitToRefresh = 0;
        		}
        		if (listId) {
                    MeiweiApp.Pages.Home.recommend.id = listId;
                    timeWaitToRefresh = 0;
                }
        		this.recommend.fetch({ reset: true, success: this.renderAll, delay: timeWaitToRefresh });
                this.recommendNames.fetch({ reset: true, delay: timeWaitToRefresh });
        	}
    	}
    }))({el: $("#view-home")});
});
