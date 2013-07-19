/*
var neighborhoods = [];

var markers = [];
var iterator = 0;

var map;

function addMarker() {
	markers.push(new google.maps.Marker({
		position : neighborhoods[iterator],
		map : map,
		draggable : false,
		animation : google.maps.Animation.DROP
	}));
	iterator++;
}

function drop() {
	for (var i = 0; i < neighborhoods.length; i++) {
		setTimeout(function() {
			addMarker();
		}, i * 200 + 1000);
	}
}


function initialize(position) {
	var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	neighborhoods = [initialLocation]
	var mapOptions = {
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : initialLocation
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	drop();
}

//google.maps.event.addDomListener(window, 'load', initialize); 

function test() {
	if (geo_position_js.init()) {
		browserSupportFlag = true;
		geo_position_js.getCurrentPosition(initialize);
	}
}

MeiweiApp.Pages.RestaurantSearchMap = new (MeiweiApp.PageView.extend({
	initPage: function() {
	},
	render: function() {
		setTimeout(test, 1000);
		this.showPage();
	}
}))({el: $("#view-restaurant-search-map")});
*/
