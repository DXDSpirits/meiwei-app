(function() {
    
    var RecommendsFilter = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            className: 'filter-item',
            template: '{{name}}',
            events: { 'click': 'onclick' },
            onclick: function() {
                MeiweiApp.sendGaEvent('homepage list', 'select', 'recommend', this.model.id);
                var home = MeiweiApp.Pages.Home;
                home.recommend.clear({ silent: true });
                home.recommend.set({ id: this.model.id }, { silent: true });
                home.recommend.fetch({ reset: true });
                home.$('.recommends-filter').addClass('closed');
            }
        })
    });
    
    var MasterHeros = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            template: TPL['hero-carousel-item'],
            events: { 'click': 'viewProducts' },
            className: 'carousel-item',
            viewProducts: function(e) {
                var el = e.currentTarget;
                var target = this.model.get('target');
                var uri = this.model.get('uri');
                var options = this.model.get('options');
                if (target == 'product') {
                    MeiweiApp.goTo('ProductOrder', {productItemId: +uri});
                } else if (target == 'internal') {
                    MeiweiApp.goTo(uri, options);
                } else if (target == 'external') {
                    MeiweiApp.openWindow(uri);
                }
            }
        }),
        initCollectionView: function() {
            this.listenTo(this.collection, 'reset change add remove', this.renderCarousel);
        },
        renderCarousel: function() {
            var items = this.$('.carousel-item'), itemWidth = $(items[0]).outerWidth(),
                wrapperWidth = this.$el.closest('.carousel').innerWidth(),
                margin = (wrapperWidth - itemWidth) / 2;
            this.$el.css({
                'width': this.collection.length * itemWidth + 2 * margin,
                'padding-left': margin,
                'padding-right': margin
            });
            /* Since it tooks 350ms to remove an item (CSS3 Transition)
             * this.collection.length is used instead of items.length
             */
        },
        addAll: function() {
            MeiweiApp.CollectionView.prototype.addAll.call(this);
        }
    });
    
    var RecommendItem = MeiweiApp.ModelView.extend({
        tagName: 'section',
        className: 'recommend-list-item img',
        template: TPL['recommend-list-item'],
        events: {
            'click': 'viewRestaurant',
            'click .order-button': 'gotoOrder'
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
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .show-more': 'goToSearch',
            'click .btn-explore': 'goToSearch',
            'submit .search-form form': 'searchKeywords',
            'click .header-title': 'toggleFilter',
            'touchend .wrapper': 'hero'
        },
        initPage: function() {
            this.defaultRecommendId = 5;
            this.recommendNames = new MeiweiApp.Collections.RecommendNames();
            this.recommend = new MeiweiApp.Models.Recommend({id: this.defaultRecommendId});
            this.heros = new MeiweiApp.Collections.Heros();
            this.views = {
                masterHero: new MasterHeros({ collection: this.heros, el: this.$('.master-hero .carousel-inner') }),
                recommendItems: new RecommendItems({ collection: this.recommend.items, el: this.$('.recommend-flow') }),
                recommendsFilter: new RecommendsFilter({ collection: this.recommendNames, el: this.$('.recommends-filter-wrapper') })
            };
            /* It's important to put listenTo after view initialization.
             * The CollectionView.addAll should be executed before this.renderAll
             */
            this.listenTo(this.recommend.items, 'reset', this.renderAll);
            this.initRefresh();
        },
        initRefresh: function() {
            var self = this;
            this.throttleRefresh = _.throttle(function() {
                var after = _.after(3, function() {
                    if (!window.BOOST) return;
                    BOOST.set('home-heros', self.heros.toJSON());
                    BOOST.set('home-recommendnames', self.recommendNames.toJSON());
                    if (self.recommend.id == self.defaultRecommendId) {
                        BOOST.set('home-recommend-items', self.recommend.items.toJSON());
                    }
                });
                self.recommend.fetch({ success: after });
                self.recommendNames.fetch({ reset: true, success: after });
                self.heros.fetch({ reset: true, success: after });
            }, 60 * 1000);
        },
        onClickLeftBtn: function() {
            MeiweiApp.goTo('MemberCenter');
        },
        onClickRightBtn: function() {
            MeiweiApp.goTo('Attending');
        },
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
            var y = this.$('.wrapper').scrollTop();
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
            this.$('.show-more').removeClass('hidden');
            this.$('.header-title > span').html(this.recommend.get('name'));
        },
        firstVisit: function() {
            var key = 'visited-view-home';
            if (!localStorage.getItem(key)) {
                this.$el.addClass('first-visit');
                this.$el.one('click', function(e) {
                    if (e.preventDefault) e.preventDefault();
                    $(this).removeClass('first-visit');
                    localStorage.setItem(key, true);
                });
            }
        },
        leave: function() {
            MeiweiApp.Pages.Home.$('.recommends-filter').addClass('closed');
            this.throttleRefresh();
        },
        render: function() {
            this.views.masterHero.render();
            var listId = this.options.listId;
            if (!this.bootstrapped && !listId) {
                this.bootstrapped = true;
                this.firstVisit();
                var recommendNames = window.BOOST && BOOST.get('home-recommendnames');
                if (recommendNames) this.recommendNames.reset(recommendNames);
                var recommends = window.BOOST && BOOST.get('home-recommend-items');
                if (recommends) this.recommend.items.reset(recommends);
                var heros = window.BOOST && BOOST.get('home-heros');
                if (heros) this.heros.reset(heros);
            } else if (listId) {
                MeiweiApp.Pages.Home.recommend.set({ id: listId }, { silent: true });
                this.recommend.fetch();
                this.recommendNames.fetch({ reset: true });
                this.heros.fetch({ reset: true });
            }
        }
    }))({el: $("#view-home")});
})();
