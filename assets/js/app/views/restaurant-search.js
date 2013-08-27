
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
		'submit >header>form': 'searchKeywords'
	},
	initPage: function() {
		_.bindAll(this, 'refreshList', 'filterRestaurant', 'bindCuisineFilters', 'bindCircleFilters', 'fetchPrev', 'fetchNext');
		new MBP.fastButton(this.$('.page-prev')[0], this.fetchPrev);
		new MBP.fastButton(this.$('.page-next')[0], this.fetchNext);
		this.restaurants = new MeiweiApp.Collections.Restaurants();
		this.cuisines = new MeiweiApp.Collections.Cuisines();
		this.circles = new MeiweiApp.Collections.Circles();
		this.views = {
			restaurantList: new MeiweiApp.Views.RestaurantList({
				collection: this.restaurants,
				el: this.$('.restaurant-list')
			}),
			cuisineFilter: new MeiweiApp.Views.Filter({
				collection: this.cuisines,
				el: this.$('.filter.cuisine .collapsible-inner ul')
			}),
			circleFilter: new MeiweiApp.Views.Filter({
				collection: this.circles,
				el: this.$('.filter.circle .collapsible-inner ul')
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
		this.initializeMap();
	},
	fetchNext: function() {
		this.scroller.scrollTo(0, 0, 1000);
		var self = this;
		setTimeout(function() {
			self.restaurants.fetchNext({ success: self.refreshList });
		}, 1000);
	},
	fetchPrev: function() {
		this.scroller.scrollTo(0, 0, 1000);
		var self = this;
		setTimeout(function() {
			self.restaurants.fetchPrev({ success: self.refreshList });
		}, 1000);
	},
	refreshList: function(collection, xhr, options) {
		var cuisine = options.data && options.data.cuisine && this.cuisines.where({id: options.data.cuisine})[0];
		this.$('.cuisine > p > span').html(cuisine ? cuisine.get('name') : '全部菜系');
		var circle = options.data && options.data.circle && this.circles.where({id: options.data.circle})[0];
		this.$('.circle > p > span').html(circle ? circle.get('name') : '全部商圈');
		if (this.restaurants.length == 0) {
			this.$('.restaurant-list').prepend('<p style="padding: 15px;">没有找到合适的餐厅，请尝试搜索其他关键字，或者选择菜系和商圈</p>');
		}
		this.$('.page-next').toggleClass('hide', (this.restaurants.next == null));
		this.$('.page-prev').toggleClass('hide', (this.restaurants.previous == null));
		this.initScroller();
		if (this.$('.flipper').hasClass('flip')) this.dropMarkers();
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
	    this.cuisineFilterScroller = new IScroll(this.$('.cuisine .collapsible-inner').selector, {
	    	preventDefault: false
		});
		this.cuisineFilterScroller.maxScrollY += 200;
		var bindFilter = function(cuisine) {
			this.listenTo(cuisine, "select", function() {
			    this.filterRestaurant({cuisine: cuisine.id});
			});
		};
		cuisines.forEach(bindFilter, this);
	},
	bindCircleFilters: function(circles, response, options) {
		this.circleFilterScroller = new IScroll(this.$('.circle .collapsible-inner').selector, {
	    	preventDefault: false
		});
		this.circleFilterScroller.maxScrollY += 200;
		var bindFilter = function(circle) {
			this.listenTo(circle, "select", function() {
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
			
			var meiweiIcon = new BMap.Icon("assets/img/mapmarker.png", new BMap.Size(25, 25), {imageSize: new BMap.Size(25, 25)});
			
			var marker = new BMap.Marker(neighborhoods[i].latlng , {enableMassClear:true, icon:meiweiIcon});
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
			MeiweiApp.handleError(e);
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
