(function() {
    var MarkerItemInfo = MeiweiApp.ModelView.extend({
        template: TPL['restaurant-list-item'],
        events: { 'click': 'viewRestaurant' },
        viewRestaurant: function() {
            MeiweiApp.Pages.RestaurantSearch.resetFilters();
            MeiweiApp.goTo('RestaurantDetail', { restaurant: this.model.toJSON() });
        },
        toggle: function(resto) {
            var self = this;
            this.$el.animate({opacity: 0}, 100, function() {
                self.model.set(resto);
                self.$el.animate({opacity: 1}, 500);
            })
        },
        render: function() {
            MeiweiApp.ModelView.prototype.render.call(this);
            MeiweiApp.loadBgImage(this.$('.thumbnail'), this.model.get('frontpic'), { width: 89, height: 89 });
            this.$el.addClass('expand');
            return this;
        }
    });
    
    /*
    var Map = MeiweiApp.View.extend({
        events: { 'click .locate-btn': 'locate' },
        initView: function() {
            _.bindAll(this, 'initializeMap');
            this.restaurants = this.collection;
            this.views = {
                markerInfo: new MarkerItemInfo({ model: new MeiweiApp.Models.Restaurant(), el: this.$('.map-marker-info') })
            };
            this.opened = false;
        },
        hide: function() {
            if (this.map) this.map.clearMap();
            this.opened = false;
            this.stopListening(this.restaurants, 'reset');
            MeiweiApp.sendGaEvent('map', 'hide');
        },
        show: function() {
            if (!this.map) {
                this.initializeMap();
            } else {
                this.dropMarkers();
            }
            this.opened = true;
            this.listenTo(this.restaurants, 'reset', this.dropMarkers);
            MeiweiApp.sendGaEvent('map', 'show');
        },
        initializeMap: function () {
            if (!window.AMap) {
                window.initializeMap = this.initializeMap;
                $.getScript("http://webapi.amap.com/maps?v=1.2&key=88079b446671c954e1de335141228c28&callback=initializeMap");
                return;
            }
            this.markers = [];
            var mapObj = this.map = new AMap.Map('map_canvas', {
                center: new AMap.LngLat(MeiweiApp.coords.longitude, MeiweiApp.coords.latitude),
                continuousZoomEnable: true, level: 15, zooms: [3, 17], touchZoom: true
            });
            mapObj.plugin(["AMap.ToolBar"], function() {
                mapObj.toolBar = new AMap.ToolBar();
                mapObj.addControl(mapObj.toolBar);
                mapObj.toolBar.hide();
            });
            this.dropMarkers();
        },
        locate: function() {
            if (!this.map || !this.map.toolBar) return;
            var self = this;
            AMap.event.addListenerOnce(this.map.toolBar, 'location', function(e) {
                self.restaurants.fetch({ reset: true, data: { lng: e.lnglat.lng, lat: e.lnglat.lat } });
            });
            this.map.toolBar.doLocation();
        },
        dropMarkers: function () {
            if (!this.map) return;
            for (var i=0; i<this.markers.length; i++) {
                var marker = this.markers[i];
                this.removeMessage(marker);
                marker.setMap(null);
            }
            this.markers.length = 0;
            this.restaurants.forEach(function(item) {
                var coord = item.get('coordinate');
                if (coord) {
                    var marker = new AMap.Marker({
                        map: this.map,
                        position: new AMap.LngLat(coord.longitude / 100000.0 , coord.latitude / 100000.0),
                        icon: new AMap.Icon({ size: new AMap.Size(25, 25), image: "assets/images/mapmarker.png" })
                    });
                    this.markers.push(marker);
                    this.addMessage(marker, item.toJSON());
                }
            }, this);
            this.map.setFitView();
        },
        addMessage: function(marker, resto) {
            marker.clickListener = AMap.event.addListener(marker, 'click', function () {
                this.views.markerInfo.toggle(resto);
            }, this);
        },
        removeMessage: function(marker) {
            if (marker.clickListener) AMap.event.removeListener(marker.clickListener);
        }
    });
    */
   
    var RestaurantList = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            tagName: 'section',
            className: 'restaurant-list-item',
            template: TPL['restaurant-list-item'],
            events: { 'click': 'viewRestaurant' },
            viewRestaurant: function() {
                MeiweiApp.Pages.RestaurantSearch.resetFilters();
                MeiweiApp.goTo('RestaurantDetail', { restaurant: this.model.toJSON() });
            },
            render: function() {
                var attrs = this.model ? this.model.toJSON() : {};
                if (attrs.coordinate) attrs.distance = MeiweiApp.calculateDistance(attrs.coordinate.latitude, attrs.coordinate.longitude);
                this.renderTemplate(attrs);
                MeiweiApp.loadBgImage(this.$('.thumbnail'), attrs.frontpic, { width: 89, height: 89 });
                return this;
            }
        })
    });
    
    var SearchFilterItem = MeiweiApp.ModelView.extend({
        filtername: 'circle',
        tagName: 'li',
        className: 'filter-item',
        template: "{{name}}",
        render: function() {
            MeiweiApp.ModelView.prototype.render.call(this);
            this.$el.attr({ 'data-filter': this.filtername, 'data-id': this.model.id });
            return this;
        }
    });
    
    var CircleFilter = MeiweiApp.CollectionView.extend({
        DistrictModelView: SearchFilterItem.extend({ className: 'filter-item subtitle', filtername: 'district' }),
        CircleModelView: SearchFilterItem.extend({ filtername: 'circle' }),
        removeOne: function(item) {},
        addOne: function(item) {},
        addAll: function() {
            var $list = [];
            for (var i=0; i<this.collection.length; i++) {
                var lastItem = (i == 0 ? null : this.collection.at(i-1));
                var item = this.collection.at(i);
                var modelView = new this.CircleModelView({model: item});
                if (lastItem == null || item.get('district').id != lastItem.get('district').id) {
                    var subTitleView = new this.DistrictModelView({
                        model: new MeiweiApp.Models.District(item.get('district'))
                    });
                    $list.push(subTitleView.render().el);
                }
                $list.push(modelView.render().el);
            }
            this.$el.html($list);
        }
    });
    var RecommendFilter = MeiweiApp.CollectionView.extend({
        ModelView: SearchFilterItem.extend({ filtername: 'recommend' })
    });
    var CuisineFilter = MeiweiApp.CollectionView.extend({
        ModelView: SearchFilterItem.extend({ filtername: 'cuisine' })
    });
    
    MeiweiApp.Pages.RestaurantSearch = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .filter p': 'toggleFilters',
            'click .filter li': 'selectFilter',
            'touchmove .wrapper': 'closeFilters',
            'submit .search-form': 'searchKeywords',
            'focus .search-form > input': 'clearFormInput'
        },
        clearFormInput: function() { this.$('.search-form > input').val(''); },
        onClickRightBtn: function() {
            /*this.$('.wrapper').scrollTop(0);
            var flip = this.$('.flipper').hasClass('flip');
            this.$('.flipper').toggleClass('flip', !flip);
            this.$('.header-btn-right .icon-bars').toggleClass('hidden', flip);
            this.$('.header-btn-right .icon-locate').toggleClass('hidden', !flip);
            this.resetFilters();
            this.views.map[flip ? 'hide' : 'show']();*/
        },
        onClickLeftBtn:function(){
            this.resetFilters();
            MeiweiApp.goTo('Home');
        },
        initPage: function() {
            this.restaurants = new MeiweiApp.Collections.Restaurants();
            this.filters = new MeiweiApp.Models.Filters();
            this.cuisines = new MeiweiApp.Collections.Cuisines();
            this.circles = new MeiweiApp.Collections.Circles();
            this.recommendnames = new MeiweiApp.Collections.RecommendNames();
            this.views = {
                //map: new Map({ collection: this.restaurants, el: this.$('.map_canvas')}),
                restaurantList: new RestaurantList({ collection: this.restaurants, el: this.$('.restaurant-list') }),
                recommendFilter: new RecommendFilter({ collection: this.recommendnames, el: this.$('.filter.recommend ul') }),
                cuisineFilter: new CuisineFilter({ collection: this.cuisines, el: this.$('.filter.cuisine ul') }),
                circleFilter: new CircleFilter({ collection: this.circles, el: this.$('.filter.circle ul') })
            };
            this.listenTo(this.filters, 'change', this.refreshFilters);
            this.initPageNav(this, this.restaurants);
        },
        toggleFilters: function(e) {
            var el = e.currentTarget;
            $(el).closest('.filter').toggleClass('expand').siblings().removeClass('expand');
        },
        selectFilter: function(e) {
            var el = e.currentTarget;
            var filter = {};
            filter[$(el).attr('data-filter')] = $(el).attr('data-id');
            this.resetFilters();
            $(el).closest('.filter').find('> p > span').html($(el).text());
            this.searchRestaurants(filter);
        },
        closeFilters: function() {
            this.$('.filter').removeClass('expand');
        },
        resetFilters: function() {
            this.$('.filter').removeClass('expand');
            this.$('.recommend > p > span').html(MeiweiApp._('Recommends'));
            this.$('.cuisine > p > span').html(MeiweiApp._('Cuisines'));
            this.$('.circle > p > span').html(MeiweiApp._('Circles'));
        },
        refreshFilters: function() {
            window.BOOST && BOOST.set('restaurant-search-filters', this.filters.toJSON());
            var self = this;
            var reset = function(className, filterName) {
                self[filterName].reset(self.filters.get(filterName));
            };
            reset('cuisine', 'cuisines'), reset('circle', 'circles'), reset('recommend', 'recommendnames');
        },
        searchKeywords: function(e) {
            if (e.preventDefault) e.preventDefault();
            var keywords = this.$('.search-form > input').val();
            this.searchRestaurants({ keywords: keywords });
            this.$('.search-form > input').blur();
            this.resetFilters();
        },
        searchRestaurants: function(filter) {
            this.restaurants.fetch({ reset: true, data: filter });
        },
        render: function() {
            MeiweiApp.initGeolocation();
            var keywords = this.options.keywords;
            var recommendId = this.options.recommendId;
            if(recommendId){
                this.searchRestaurants({recommend:recommendId});
            } else if(keywords) {
                this.searchRestaurants({ keywords: keywords });
            } else {
                this.restaurants.fetch();
            }
            if (!this.bootstrapped) {
                this.bootstrapped = true;
                var filters = window.BOOST && BOOST.get('restaurant-search-filters');
                if (filters) this.filters.set(filters);
            } else {
                this.filters.fetch();
            }
        }
    }))({el: $("#view-restaurant-search")});
})();
