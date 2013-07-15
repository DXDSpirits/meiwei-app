
/********************************** Router **********************************/

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		this.route('home', 'home');
		
		this.route(/^restaurant\/(\d+)$/, 'restaurant');
		this.route(/^restaurant\/(\d+)\/order$/, 'restaurantOrder');
		this.route('restaurant-list', 'restaurantList');
		
		this.route('member', 'memberCenter');
		this.route('member/login', 'memberLogin');
		this.route('member/profile', 'memberProfile');
		
		this.route('member/order', 'memberOrders');
		this.route(/^member\/order\/(\d+)$/, 'orderDetail');
	},
	index: function(){
		MeiweiApp.Router.navigate('home', {trigger: true});
	},
	home: function(){
		MeiweiApp.Pages.Home.go();
	},
	
	restaurant: function(rid) {
		MeiweiApp.Pages.Restaurant.go(rid);
	},
	restaurantList: function(){
		MeiweiApp.Pages.RestaurantList.go();
	},
	restaurantOrder: function(rid){
		MeiweiApp.Pages.RestaurantOrder.go(rid);
	},
	
	memberCenter: function(){
		MeiweiApp.Pages.MemberCenter.go();
	},
	memberLogin: function(){
		MeiweiApp.Pages.MemberLogin.go();
	},
	memberProfile: function(){
		MeiweiApp.Pages.MemberProfile.go();
	},
	memberOrders: function(){
        MeiweiApp.Pages.MemberOrders.go();
    },
    orderDetail: function(orderId) {
    	MeiweiApp.Pages.Order.go(orderId);
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
