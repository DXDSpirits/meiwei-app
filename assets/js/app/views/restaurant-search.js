
MeiweiApp.Views.MarkerItemInfo = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	template: MeiweiApp.Templates['restaurant-list-item'],
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
			}, 600);
		} else {
			this.model.set(resto);
			this.$el.addClass('expand');
		}
	}
});

MeiweiApp.Views.RestaurantListItem = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	tagName: 'section',
	className: 'restaurant-list-item',
	template: MeiweiApp.Templates['restaurant-list-item'],
	viewRestaurant: function() {
		MeiweiApp.goTo('RestaurantDetail', {
			restaurant: this.model.toJSON()
		});
	}
});

MeiweiApp.Views.RestaurantList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.Views.RestaurantListItem
});

MeiweiApp.Views.Filter = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: 'li',
		template: Mustache.compile('{{name}}'),
		events: { 'click': 'selectFilter' },
		selectFilter: function() {
			this.model.trigger('select');
		}
	})
});

MeiweiApp.Pages.RestaurantSearch = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	onClickRightBtn: function() {
		this.$('.flipper').toggleClass('flip');
		this.dropMarkers();
	},
	events: {
		'submit >header>form': 'searchKeywords',
		'touchmove .iscroll': 'refreshOnScroll'
	},
	initPage: function() {
		this.restaurants = new MeiweiApp.Collections.Restaurants();
		this.cuisines = new MeiweiApp.Collections.Cuisines();
		this.circles = new MeiweiApp.Collections.Circles();
		this.views = {
			restaurantList: new MeiweiApp.Views.RestaurantList({
				collection: this.restaurants,
				el: this.$('.scroll-inner')
			}),
			cuisineFilter: new MeiweiApp.Views.Filter({
				collection: this.cuisines,
				el: this.$('.filter.cuisine .collapsible-inner')
			}),
			circleFilter: new MeiweiApp.Views.Filter({
				collection: this.circles,
				el: this.$('.filter.circle .collapsible-inner')
			}),
			markerInfo: new MeiweiApp.Views.MarkerItemInfo({
				model: new MeiweiApp.Models.Restaurant(),
				el: this.$('.map-marker-info')
			})
		};
		this.$('.collapsible').on('click', function() {
			if (!$(this).hasClass('expand')) {
				$(this).siblings().removeClass('expand');
				$(this).addClass('expand');
			} else {
				$(this).removeClass('expand');
			}
		});
		_.bindAll(this, 'refreshList', 'refreshOnScroll', 'filterRestaurant', 'bindCuisineFilters', 'bindCircleFilters');
		this.initializeMap();
	},
	
	refreshOnScroll: function() {
		if (this.restaurants.next != null && this.restaurants.length < 30 && 
				!this.preventRefresh && this.scroller.y < this.scroller.maxScrollY) {
			this.preventRefresh = true;
			this.$('.scroll-infinite .scroll-inner').attr('data-hint', '正在加载...');
			var self = this;
			setTimeout(function() {
				self.restaurants.fetchNext({ remove: false, success: self.refreshList });
			}, 500);
		}
	},
	
	refreshList: function() {
		var hintText = (this.restaurants.next == null || this.restaurants.length >= 30) ? '': '上拉可刷新';
		this.$('.scroll-infinite .scroll-inner').attr('data-hint', hintText);
		this.initScroller();
		if (this.$('.flipper').hasClass('flip')) this.dropMarkers();
		this.preventRefresh = false;
	},
	
	searchKeywords: function(e) {
		e.preventDefault();
		var keywords = this.$('>header input').val();
		this.restaurants.fetch({ reset: true, success: this.refreshList, data: { keywords: keywords } });
		this.$('>header input').blur();
	},
	filterRestaurant: function(filter) {
		this.restaurants.fetch({ reset: true, success: this.refreshList, data: filter });
	},
	bindCuisineFilters: function(cuisines, response, options) {
		var bindFilter = function(cuisine) {
			this.listenTo(cuisine, "select", function() {
			    this.$('.cuisine > p > span').html(cuisine.get('name'));
			    this.$('.circle > p > span').html('全部商圈');
			    this.filterRestaurant({cuisine: cuisine.id});
			});
		};
		cuisines.forEach(bindFilter, this);
	},
	bindCircleFilters: function(circles, response, options) {
		var bindFilter = function(circle) {
			this.listenTo(circle, "select", function() {
			    this.$('.circle > p > span').html(circle.get('name'));	
			    this.$('.cuisine > p > span').html('全部菜系');
				this.filterRestaurant({circle: circle.id});
			});
		};
		circles.forEach(bindFilter, this);
	},
	
	/*********************************************/
	dropMarkers: function () {
		var neighborhoods = [], view =[];
		this.restaurants.forEach(function(item) {
			var coord = item.get('coordinate');
            var latlng = new BMap.Point(coord.longitude / 100000.0 , coord.latitude / 100000.0);
			neighborhoods.push({latlng: latlng, resto: item.toJSON()});
			view.push(latlng);
		}, this);
		this.map.setViewport(view);
		this.markers.length = 0;
		this.map.clearOverlays();
		for (var i = 0; i < neighborhoods.length; i++) {
			var marker = new BMap.Marker(neighborhoods[i].latlng , {enableMassClear:true});
			this.markers.push(marker);
			this.map.addOverlay(marker);
			this.addMessage(marker, neighborhoods[i].resto);
		}
	},
	addMessage: function(marker, resto) {
		var markerInfo = this.views.markerInfo;
		marker.addEventListener('click', function () {
			markerInfo.toggle(resto);
		});
	},
	initializeMap: function () {
		try {
			this.markers = [];
			this.map = new BMap.Map("map_canvas", {enableMapClick: false, maxZoom: 18});
			this.map.enableContinuousZoom();
			this.map.disablePinchToZoom();
			this.map.centerAndZoom(new BMap.Point(121.491, 31.233), 12);
			this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM})); 
		} catch (e) {
			
		}
	},
	/*********************************************/
	
	render: function() {
		this.showPage();
		this.$('>header input').val('');
		this.$('>header input').focus();
		this.restaurants.fetch({ reset: true, success: this.refreshList });
		this.cuisines.fetch({ reset: true, success: this.bindCuisineFilters });
		this.circles.fetch({ reset: true, success: this.bindCircleFilters });
	}
}))({el: $("#view-restaurant-search")});
