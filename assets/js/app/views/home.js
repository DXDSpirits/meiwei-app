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
	            var $filter = MeiweiApp.Pages.Home.$('.recommends-filter');
	            if ($filter.length > 0) this.scroller = new IScroll($filter.selector, { tap: true, bounce: false });
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
    	template: TPL['hero-carousel'],
    	events: { 'fastclick .carousel-item': 'viewProducts' },
    	initView: function() {
    		this.heros = new MeiweiApp.Collections.Heros();
    		this.listenTo(this.heros, 'reset add remove change', this.renderCarousel);
    	},
    	viewProducts: function(e) {
            var el = e.currentTarget;
            var target = $(el).attr('data-target');
            var uri = $(el).attr('data-item');
            if (target == 'product') {
                MeiweiApp.goTo('ProductPurchase', {itemId: +uri});
            } else if (target == 'internal') {
                MeiweiApp.goTo(uri);
            } else if (target == 'external') {
                window.open(uri, '_blank', 'location=no');
            }
    	},
    	renderCarousel: function() {
    	    window.Bootstrap && Bootstrap.set('home-heros', this.heros.toJSON());
    		this.renderTemplate({
                items: this.heros.toJSON()
            });
    		var items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(),
                wrapperWidth = this.$('.carousel').innerWidth(),
                margin = (wrapperWidth - itemWidth) / 2;
            this.$('.carousel-inner').css({
                'width': items.length * itemWidth + 2 * margin,
                'padding-left': margin,
                'padding-right': margin
            });
    	},
    	render: function() {
    	    if (!this.bootstrapped) {
    	        this.bootstrapped = true;
    	        var heros = window.Bootstrap && Bootstrap.get('home-heros');
                if (heros) this.heros.reset(heros);
    	    } else {
    	        this.heros.fetch();
    	    }
    		return this;
    	}
    });
    
    var RecommendItem = MeiweiApp.ModelView.extend({
    	tagName: 'section',
    	className: 'recommend-list-item img',
    	template: TPL['recommend-list-item'],
    	events: {
    		'fastclick': 'viewRestaurant',
    		'fastclick .order-button': 'gotoOrder'
    	},
    	viewRestaurant: function(e) {
    		MeiweiApp.goTo('RestaurantDetail', { restaurant: this.model.get('restaurant') });
    	},
    	gotoOrder: function(e) {
    		if (e.stopPropagation) e.stopPropagation();
    		var restaurantId = this.model.get('restaurant').id;
    		MeiweiApp.goTo('RestaurantOrder', { restaurantId: restaurantId });
    	},
    	render: function() {
    		MeiweiApp.ModelView.prototype.render.call(this);
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
    		'fastclick .header-title': 'toggleFilter',
    		'touchend .wrapper': 'hero'
    	},
    	initPage: function() {
    		this.defaultRecommendId = 5;
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
    		var y = $(window).scrollTop();
    		if (y >= 0) {
        		var page = parseInt(y / wrapperHeight);
        		var begin = Math.max(page - 1, 0);
        		var end = page + 2;
        		var items = this.$('.recommend-list-item');
        		items.slice(0, begin).removeClass('hero');
        		items.slice(end).removeClass('hero');
        		items.slice(begin, end).addClass('hero');
        	}
    	},
    	renderAll: function() {
    		if (this.recommend.id == this.defaultRecommendId) {
    	    	window.Bootstrap && Bootstrap.set('home-recommend-items', this.recommend.items.toJSON());
    	    }
    	    this.$('.show-more').removeClass('hidden');
    	    this.$('.header-title > span').html(this.recommend.get('name'));
    	},
    	firstVisit: function() {
            var key = 'visited-view-home';
            if (!localStorage.getItem(key)) {
                this.$el.addClass('first-visit');
                this.$el.one('touchstart click', function(e) {
                	if (e.preventDefault) e.preventDefault();
                    $(this).removeClass('first-visit');
                    localStorage.setItem(key, true);
                });
            }
        },
    	render: function() {
	        this.views.masterHero.render();
	        var listId = this.options.listId;
	        if (!this.bootstrapped && !listId) {
                this.bootstrapped = true;
                this.firstVisit();
                var recommendNames = window.Bootstrap && Bootstrap.get('home-recommendnames');
                if (recommendNames) this.recommendNames.reset(recommendNames);
                var recommends = window.Bootstrap && Bootstrap.get('home-recommend-items');
                if (recommends) this.recommend.items.reset(recommends);
            } else {
                if (listId) MeiweiApp.Pages.Home.recommend.id = listId;
                this.recommend.fetch();
                this.recommendNames.fetch();
            }
    	}
    }))({el: $("#view-home")});
});
