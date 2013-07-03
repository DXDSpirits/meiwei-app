
/********************************** Router **********************************/

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		this.route('home', 'home');
		
		this.route(/^restaurant\/(\d+)$/, 'restaurant');
		this.route(/^restaurant\/(\d+)\/order$/, 'restaurantOrder');
		this.route('restaurant-list', 'restaurantList');
		
		this.route('member/login', 'memberLogin');
		this.route('member/profile', 'memberProfile');
		
		this.route('member/order', 'memberOrders');
		this.route(/^member\/order\/(\d+)$/, 'orderDetail');
	},
	index: function(){
		MeiweiApp.Router.navigate('home', {trigger: true});
	},
	home: function(){
		MeiweiApp.Pages.Home.show();
	},
	
	restaurant: function(rid) {
		MeiweiApp.Pages.Restaurant.show(rid);
	},
	restaurantList: function(){
		MeiweiApp.Pages.RestaurantList.show();
	},
	restaurantOrder: function(rid){
		MeiweiApp.Pages.RestaurantOrder.show(rid);
	},
	
	memberLogin: function(){
		MeiweiApp.Pages.MemberLogin.show();
	},
	memberProfile: function(){
		MeiweiApp.Pages.MemberProfile.show();
	},
	memberOrders: function(){
        MeiweiApp.Pages.MemberOrders.show();
    },
    orderDetail: function(orderId) {
    	MeiweiApp.Pages.Order.show(orderId);
    }
}));

$.ajaxSetup({
    statusCode : {
        401: function() {
            MeiweiApp.Router.navigate('member/login', {trigger: true});
        },
        403: function() {
            MeiweiApp.Router.navigate('member/login', {trigger: true});
        }
    }
});
