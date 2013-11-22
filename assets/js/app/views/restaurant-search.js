$(function() {
    var MarkerItemInfo = MeiweiApp.ModelView.extend({
    	template: TPL['restaurant-list-item'],
    	events: { 'fastclick': 'viewRestaurant' },
    	viewRestaurant: function() {
    		MeiweiApp.goTo('RestaurantDetail', {
    			restaurant: this.model.toJSON()
    		});
    	},
    	toggle: function(resto) {
    		if (this.$el.hasClass('expand')) {
    			this.$el.removeClass('expand');
    			var self = this;
    			setTimeout(function() {
    				self.model.set(resto);
    				self.$el.addClass('expand');
    			}, 200);
    		} else {
    			this.model.set(resto);
    			this.$el.addClass('expand');
    		}
    	}
    });
    
    var RestaurantListItem = MeiweiApp.ModelView.extend({
    	tagName: 'section',
    	className: 'restaurant-list-item',
    	template: TPL['restaurant-list-item'],
    	events: { 'tap': 'viewRestaurant' },
    	viewRestaurant: function() {
    		MeiweiApp.goTo('RestaurantDetail', {
    			restaurant: this.model.toJSON()
    		});
    	},
    	calculateDistance: function(lat, lon) {
    	    var lat1=lat*Math.PI/18000000, lon1 = lon*Math.PI/18000000;
    	    var lat2=MeiweiApp.coords.latitude*Math.PI/180, lon2=MeiweiApp.coords.longitude*Math.PI/180;
    	    var R = 6371;
    	    var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
            var y = (lat2-lat1);
            var d = Math.sqrt(x*x + y*y) * R;
            if (d > 1) {
                return (parseInt(d * 10) / 10) + 'km';
            } else {
                return parseInt(d * 1000) + 'm';
            }
    	},
    	render: function() {
    	    var attrs = this.model ? this.model.toJSON() : {};
    	    if (attrs.coordinate) attrs.distance = this.calculateDistance(attrs.coordinate.latitude, attrs.coordinate.longitude);
            this.$el.html(this.template(attrs));
            MeiweiApp.loadBgImage(this.$('.thumbnail'), attrs.frontpic, { width: 89, height: 89 });
            return this;
    	}
    });
    
    var RestaurantList = MeiweiApp.CollectionView.extend({
    	ModelView: RestaurantListItem
    });
    
    var SearchFilterItem = MeiweiApp.ModelView.extend({
    	filtername: 'circle',
		tagName: 'li',
		render: function() {
			var attrs = this.model ? this.model.toJSON() : {};
	        this.$el.html(attrs.name);
	        this.$el.attr({ 'data-filter': this.filtername, 'data-id': attrs.id });
	        return this;
		}
	});
    
    var CircleFilter = MeiweiApp.CollectionView.extend({
    	ModelView: SearchFilterItem.extend({ filtername: 'recommend' }),
        addAll: function() {
            var DistrictModelView = SearchFilterItem.extend({ className: 'subtitle', filtername: 'district' });
            var CircleModelView = SearchFilterItem.extend({ filtername: 'circle' });
            var $list = [];
            for (var i=0; i<this.collection.length; i++) {
                var lastItem = (i == 0 ? null : this.collection.at(i-1));
                var item = this.collection.at(i);
                var modelView = new CircleModelView({model: item});
                if (lastItem == null || item.get('district').id != lastItem.get('district').id) {
                    var subTitleView = new DistrictModelView({
                    	model: new MeiweiApp.Models.District(item.get('district'))
                   	});
                    $list.push(subTitleView.render().el);
                }
                $list.push(modelView.render().el);
            }
            this.$el.html($list);
        },
    });
    var RecommendFilter = MeiweiApp.CollectionView.extend({
    	ModelView: SearchFilterItem.extend({ filtername: 'recommend' })
    });
    var CuisineFilter = MeiweiApp.CollectionView.extend({
    	ModelView: SearchFilterItem.extend({ filtername: 'cuisine' })
    });
    
    MeiweiApp.Pages.RestaurantSearch = new (MeiweiApp.PageView.extend({
    	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
    	onClickRightBtn: function() {
    		if (this.$('.flipper').hasClass('flip')) {
    			this.$('.flipper').removeClass('flip');
    			MeiweiApp.sendGaEvent('map', 'hide');
    		} else {
    			this.$('.flipper').addClass('flip');
    			MeiweiApp.sendGaEvent('map', 'show');
    			this.resetFilters();
    			MeiweiApp.initGeolocation(function() {
    			    MeiweiApp.Pages.RestaurantSearch.filterRestaurant({
    			        lng: MeiweiApp.coords.longitude,
    			        lat: MeiweiApp.coords.latitude
    			    });
    			});
    		}
    	},
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick .filter p': 'toggleFilters',
    		'tap .filter li': 'selectFilter',
    		'touchstart .scroll-inner': 'closeFilters',
    		'submit >header>form': 'searchKeywords',
    		'focus >header input': 'clearFormInput'
    	},
    	clearFormInput: function() { this.$('>header input').val(''); },
    	initPage: function() {
    		_.bindAll(this, 'refreshList', 'filterRestaurant', 'refreshFilters');
    		this.restaurants = new MeiweiApp.Collections.Restaurants();
    		this.cuisines = new MeiweiApp.Collections.Cuisines();
    		this.circles = new MeiweiApp.Collections.Circles();
    		this.recommendnames = new MeiweiApp.Collections.RecommendNames();
    		this.views = {
    			restaurantList: new RestaurantList({ collection: this.restaurants, el: this.$('.restaurant-list') }),
    			recommendFilter: new RecommendFilter({ collection: this.recommendnames, el: this.$('.filter.recommend ul') }),
    			cuisineFilter: new CuisineFilter({ collection: this.cuisines, el: this.$('.filter.cuisine ul') }),
    			circleFilter: new CircleFilter({ collection: this.circles, el: this.$('.filter.circle ul') }),
    			markerInfo: new MarkerItemInfo({ model: new MeiweiApp.Models.Restaurant(), el: this.$('.map-marker-info') })
    		};
    		this.initPageNav(this, this.restaurants);
    	},
    	refreshList: function(collection, xhr, options) {
    		if (this.restaurants.length == 0) {
    			this.$('.restaurant-list').prepend(
    			    '<p style="padding: 15px;">没有找到合适的餐厅，请尝试搜索其他关键字，或者选择菜系和商圈</p>'
    			);
    		}
    		if (this.$('.flipper').hasClass('flip')) this.dropMarkers();
    	},
    	searchKeywords: function(e) {
    		if (e.preventDefault) e.preventDefault();
    		var keywords = this.$('>header input').val();
    		this.restaurants.fetch({ reset: true, success: this.refreshList, data: { keywords: keywords } });
    		this.$('>header input').blur();
    	},
    	toggleFilters: function(e) {
    		var el = e.currentTarget;
    		$(el).closest('.filter').toggleClass('expand').siblings().removeClass('expand');
    	},
    	selectFilter: function(e) {
    		var el = e.currentTarget;
    		var filter = {};
    		filter[$(el).attr('data-filter')] = $(el).attr('data-id');
    		this.closeFilters();
    		this.resetFilters();
    		$(el).closest('.filter').find('> p > span').html($(el).text());
    		this.filterRestaurant(filter);
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
        	this.recommendFilterScroller ? this.recommendFilterScroller.refresh() :
				this.recommendFilterScroller = new IScroll(this.$('.recommend .collapsible-inner').selector, { tap: true });
           	this.cuisineFilterScroller ? this.cuisineFilterScroller.refresh() :
            	this.cuisineFilterScroller = new IScroll(this.$('.cuisine .collapsible-inner').selector, { tap: true });
            this.circleFilterScroller ? this.circleFilterScroller.refresh() :
            	this.circleFilterScroller = new IScroll(this.$('.circle .collapsible-inner').selector, { tap: true });
        },
        filterRestaurant: function(filter) {
            this.restaurants.fetch({ reset: true, success: this.refreshList, data: filter });
        },
    	
    	/*********************************************/
    	dropMarkers: function () {
    		if (!this.map) {
    		    this.initializeMap();
    		} else {
        		var neighborhoods = [], view =[];
        		this.restaurants.forEach(function(item) {
        			var coord = item.get('coordinate');
        			if (coord) {
                        var latlng = new BMap.Point(coord.longitude / 100000.0 , coord.latitude / 100000.0);
                        neighborhoods.push({latlng: latlng, resto: item.toJSON()});
                        view.push(latlng);
                    }
        		}, this);
        		this.map.setViewport(view);
        		this.markers.length = 0;
        		this.map.clearOverlays();
        		for (var i = 0; i < neighborhoods.length; i++) {
        			var meiweiIcon = new BMap.Icon("assets/img/mapmarker.png", new BMap.Size(25, 25), {imageSize: new BMap.Size(25, 25)});
        			var marker = new BMap.Marker(neighborhoods[i].latlng , {enableMassClear:true, icon:meiweiIcon});
        			this.markers.push(marker);
        			this.map.addOverlay(marker);
        			this.addMessage(marker, neighborhoods[i].resto);
        		}
        	}
    	},
    	addMessage: function(marker, resto) {
    		var markerInfo = this.views.markerInfo;
    		marker.addEventListener('click', function () {
    			markerInfo.toggle(resto);
    		});
    	},
    	initializeMap: function () {
    		var self = this;
    		var script = 'http://api.map.baidu.com/getscript?v=2.0&ak=D8b53e29c40828bb6b29865e8131db68';
    		$.getScript(script, function() {
    		    if (!window.BMap) return;
    			self.markers = [];
    			self.map = new BMap.Map('map_canvas', {enableMapClick: false, maxZoom: 18});
    			self.map.enableContinuousZoom();
    			self.map.enablePinchToZoom();
    			self.map.centerAndZoom(new BMap.Point(MeiweiApp.coords.longitude, MeiweiApp.coords.latitude), 15);
    			//self.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));
    			self.dropMarkers();
    		});
    	},
    	/*********************************************/
    	
    	render: function() {
    		//this.$('>header input').focus();
    		var keywords = this.options.keywords;
    		if (keywords || this.checkLazy(24 * 60)) {
    		    if (keywords) {
    		        this.restaurants.fetch({ reset: true, success: this.refreshList, data: { keywords: keywords } });
    		    } else {
    		        this.restaurants.fetch({ reset: true, success: this.refreshList });
    		    }
        		var filters = MeiweiApp.Bootstrap.get('restaurant-search-filters');
        		if (filters) {
        			this.recommendnames.reset(filters.recommendnames);
	        		this.cuisines.reset(filters.cuisines);
	        		this.circles.reset(filters.circles);
	        		this.refreshFilters();
        		}
        		this.recommendnames.fetch({ reset: true, success: this.refreshFilters });
        		this.cuisines.fetch({ reset: true, success: this.refreshFilters });
        		this.circles.fetch({ reset: true, success: this.refreshFilters });
            }
    	}
    }))({el: $("#view-restaurant-search")});
});
