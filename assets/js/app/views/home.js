$(function() {
    function checkFirstTime() {
        return !localStorage.getItem('visited-view-home');
    }
    var RecommendsFilter = MeiweiApp.CollectionView.extend({
        initCollectionView: function() {
        	this.listenTo(this.collection, 'reset add remove', this.initScroller);
        },
        initScroller: function() {
	        if (this.scroller == null) {
	            if (MeiweiApp.Pages.Home.$('.recommends-filter').length > 0) {
	                this.scroller = new IScroll(MeiweiApp.Pages.Home.$('.recommends-filter').selector, {
	                    tap: true, tagName: /^(INPUT|TEXTAREA|SELECT)$/
	                });
	            }
	        } else {
	            this.scroller.refresh();
	        }
	    },
        ModelView: MeiweiApp.ModelView.extend({
            className: 'filter-item',
            template: Mustache.compile('{{name}}'),
            events: { 'tap': 'onclick' },
            onclick: function() {
                MeiweiApp.sendGaEvent('homepage list', 'select', 'recommend', this.model.id);
                MeiweiApp.Pages.Home.recommend.clear();
                MeiweiApp.Pages.Home.recommend.id = this.model.id;
                MeiweiApp.Pages.Home.recommend.fetch();
                MeiweiApp.Pages.Home.$('.recommends-filter').addClass('closed');
            }
        })
    });
    
    var MasterHero = MeiweiApp.View.extend({
    	template: TPL['product-carousel'],
    	events: { 'tap .carousel-item': 'viewProducts' },
    	initView: function() {
    		_.bindAll(this, 'renderAd');
    		this.productItems = new MeiweiApp.Collections.ProductItems();
    		this.listenTo(this.productItems, 'reset add remove', this.renderCarousel);
    		this.ad = new MeiweiApp.Models.Ad();
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
                MeiweiApp.loadBgImage($(this).find('.img'), items.get(id).get('picture'), {
                	height: 150, width: 150
                });
            });
    		var items = this.$('.carousel-inner > .carousel-item');
        	this.$('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
    		this.scroller = new IScroll(this.$('.carousel').selector, { tap: true, scrollX: true, scrollY: false });
    	},
    	renderConcierge: function() {
    	    var products = MeiweiApp.Bootstrap.get('home-product-items');
            if (products) {
                this.productItems.smartSet(products);
            }
            if (!checkFirstTime()) { 
                this.productItems.fetch({ data: {recommend: 1} });
            }
        },
        renderAd: function() {
            if (this.ad.get('online')) {
                this.$el.html(this.ad.get('template'));
            }
        },
    	render: function() {
    	    this.renderConcierge();
    	    if (!checkFirstTime()) {
                this.ad.fetch({success: this.renderAd});
            }
    		return this;
    	}
    });
    
    var RecommendItem = MeiweiApp.ModelView.extend({
    	tagName: 'section',
    	className: 'recommend-list-item img',
    	template: TPL['recommend-list-item'],
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
    		MeiweiApp.loadBgImage(this.$el, this.model.get('restaurant').frontpic, {
    			src_local: 'assets/img/bootstrap/restaurant/' + this.model.get('restaurant').id + '.jpg',
    			height: 250
    		});
    		return this;
    	}
    });
    
    var RecommendItems = MeiweiApp.CollectionView.extend({
    	ModelView: RecommendItem
    });
    
    MeiweiApp.Pages.Home = new (MeiweiApp.PageView.extend({
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick .show-more': 'goToSearch',
    		'submit .search-form form': 'searchKeywords',
    		'fastclick .header-title': 'toggleFilter'
    	},
    	initPage: function() {
    		this.defaultRecommendId = 5;
    		_.bindAll(this, 'hero');
    		this.recommendNames = new MeiweiApp.Collections.RecommendNames();
    		this.recommend = new MeiweiApp.Models.Recommend({id: this.defaultRecommendId});
    		this.views = {
    			masterHero: new MasterHero({ el: this.$('.master-hero') }),
    			recommendItems: new RecommendItems({ collection: this.recommend.items, el: this.$('.recommend-flow') }),
    			recommendsFilter: new RecommendsFilter({ collection: this.recommendNames, el: this.$('.recommends-filter-wrapper') })
    		};
    		/* It's important to put listenTo after view initialization.
    		 * The CollectionView.addAll should be executed before this.renderAll
    		 */
    		this.listenTo(this.recommend.items, 'reset add remove', this.renderAll);
    	},
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	onClickRightBtn: function() { MeiweiApp.goTo('Attending'); },
    	toggleFilter: function() {
    	    this.$('.recommends-filter').toggleClass('closed');
    	    MeiweiApp.sendGaEvent('homepage list', 'select');
    	},
    	goToSearch: function() {
    		MeiweiApp.goTo('RestaurantSearch');
    	},
    	searchKeywords: function(e) {
            if (e.preventDefault) e.preventDefault();
            var keywords = this.$('.search-form input').val();
            this.$('.search-form input').val('');
            MeiweiApp.goTo('RestaurantSearch', { keywords: keywords });
        },
    	hero: function() {
    		var wrapperHeight = 250;
    		if (this.scroller.y <= 0) {
        		var page = parseInt((-this.scroller.y) / wrapperHeight);
        		var begin = Math.max(page - 1, 0);
        		var end = page + 2;
        		this.$('.recommend-list-item').slice(0, begin).removeClass('hero');
        		this.$('.recommend-list-item').slice(end).removeClass('hero');
        		this.$('.recommend-list-item').slice(begin, end).addClass('hero');
        	}
    	},
    	initScroller: function() {
    		if (this.scroller == null) {
    			if (this.$('.iscroll').length > 0) {
    			    this.scroller = new IScroll(this.$('.iscroll').selector, { tap: true });
    				this.scroller.on('scrollEnd', this.hero);
    				this.scroller.scrollTo(0, -52);
    				this.hero();
    			}
    		} else {
    			this.scroller.refresh();
    			if (this.scroller.y > -52) this.scroller.scrollTo(0, -52);
    			this.hero();
    		}
    	},
    	renderAll: function() {
    		if (this.recommend.id == this.defaultRecommendId) {
    	    	MeiweiApp.Bootstrap.set('home-recommend-items', this.recommend.items.toJSON());
    	    }
    	    this.$('.show-more').removeClass('hidden');
    	    this.$('.header-title > span').html(this.recommend.get('name'));
    	    this.initScroller();
    	},
    	firstVisit: function() {
            var key = 'visited-view-home';
            if (!localStorage.getItem(key)) {
                this.$el.addClass('first-visit');
                this.$el.one('touchstart', function(e) {
                	if (e.preventDefault) e.preventDefault();
                    $(this).removeClass('first-visit');
                    localStorage.setItem(key, true);
                });
            }
        },
    	render: function() {
    	    this.firstVisit();
    	    var listId = this.options.listId;
	        this.views.masterHero.render();
	        var recommendNames = MeiweiApp.Bootstrap.get('home-recommendnames');
	        if (recommendNames) {
	            this.recommendNames.smartSet(recommendNames);
	        }
    		var recommends = MeiweiApp.Bootstrap.get('home-recommend-items');
    		if (recommends) {
    			this.recommend.items.smartSet(recommends);
    		}
    		if (listId) {
                MeiweiApp.Pages.Home.recommend.id = listId;
            }
            if (!checkFirstTime()) {
                this.recommend.fetch();
                this.recommendNames.fetch();
            }
    	}
    }))({el: $("#view-home")});
});
