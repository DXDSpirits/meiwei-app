
MeiweiApp.Views.MarkerItemInfo = MeiweiApp.ModelView.extend({
	events: { 'click': 'viewRestaurant' },
	template: MeiweiApp.Templates['restaurant-list-item'],
	viewRestaurant: function() {
		MeiweiApp.Pages.RestaurantDetail.go({restaurant: this.model.toJSON()});
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
		MeiweiApp.Pages.RestaurantDetail.go({restaurant: this.model.toJSON()});
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
				el: this.$('.collapsible-inner.cuisine')
			}),
			circleFilter: new MeiweiApp.Views.Filter({
				collection: this.circles,
				el: this.$('.collapsible-inner.circle')
			}),
			markerInfo: new MeiweiApp.Views.MarkerItemInfo({
				model: new MeiweiApp.Models.Restaurant(),
				el: this.$('.map-marker-info')
			})
		}
		this.$('.collapsible').on('click', function() {
			if (!$(this).hasClass('expand')) {
				$(this).siblings().removeClass('expand');
				$(this).addClass('expand');
			} else {
				$(this).removeClass('expand');
			}
		});
		_.bindAll(this, 'renderRestaurantList', 'filterRestaurant', 'bindCuisineFilters', 'bindCircleFilters');
		//this.initializeMap();
	},
	onClickRightBtn: function() {
		this.$('.flipper').toggleClass('flip');
		this.dropMarkers();
	},
	renderRestaurantList: function() {
		this.views.restaurantList.render();
		this.dropMarkers();
	},
	filterRestaurant: function(filter) {
		this.restaurants.fetch({ reset: true, success: this.renderRestaurantList, data: filter });
	},
	bindCuisineFilters: function(cuisines, response, options) {
		var bindFilter = function(cuisine) {
			cuisine.on("select", function() { this.filterRestaurant({cuisine: cuisine.id}); }, this);
		};
		cuisines.forEach(bindFilter, this);
	},
	bindCircleFilters: function(circles, response, options) {
		var bindFilter = function(circle) {
			circle.on("select", function() { this.filterRestaurant({circle: circle.id}); }, this);
		};
		circles.forEach(bindFilter, this);
	},
	
	/*********************************************/
	dropMarkers: function () {
		var neighborhoods = [];
		this.restaurants.forEach(function(item) {
			var coord = item.get('coordinate');
            var latlng = new AMap.LngLat(coord.longitude / 100000.0 , coord.latitude / 100000.0 );
			neighborhoods.push({latlng: latlng, resto: item.toJSON()});
		}, this);
		
		if(neighborhoods.length==1){ this.map.setZoom(18);
		}else if(neighborhoods.length<5){ this.map.setZoom(15);
		}else{ this.map.setZoom(12); }
		
		this.map.setCenter(neighborhoods.length>0 ? neighborhoods[0].latlng : new AMap.LngLat(48 , 48) );
		
		for (var i = 0; i < this.markers.length; i++) this.markers[i].setMap(null);
		this.markers = [];
		
		for (var i = 0; i < neighborhoods.length; i++) {
			var marker = new AMap.Marker({
				position : neighborhoods[i].latlng,
				map : this.map,
				draggable : false
			});
			this.markers.push(marker);
			this.addMessage(marker, neighborhoods[i].resto);
		}
	},
	addMessage: function(marker, resto) {
		var markerInfo = this.views.markerInfo;
		AMap.event.addListener(marker, 'click', function () {
			//markerInfo.model.set(resto);
			markerInfo.toggle(resto);
		});
	},
	initializeMap: function () {
		var mapOptions = { zoom : 12 ,touchZoom:true };
		this.markers = [];
		this.map = new AMap.Map(map_canvas, mapOptions);
	},
	/*********************************************/
	
	render: function() {
		$.when(
			this.restaurants.fetch({ reset: true, success: this.renderRestaurantList }),
			this.cuisines.fetch({ reset: true, success: this.bindCuisineFilters }),
			this.circles.fetch({ reset: true, success: this.bindCircleFilters })
		).then(this.showPage);
	}
}))({el: $("#view-restaurant-search")});
