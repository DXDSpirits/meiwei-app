
/********************************** Router **********************************/

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		this.route('home', 'home');
		
		this.route(/^restaurant\/(\d+)$/, 'restaurant');
		this.route(/^restaurant\/(\d+)\/order$/, 'restaurantOrder');
		this.route('restaurant/search', 'RestaurantSearch');
		
		this.route('member', 'memberCenter');
		this.route('member/login', 'memberLogin');
		this.route('member/profile', 'memberProfile');
		
		this.route('member/order', 'memberOrders');
		this.route(/^member\/order\/(\d+)$/, 'orderDetail');
		this.route('member/contacts', 'memberContacts');
		
		this.route('member/attending', 'memberAttending');
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
	RestaurantSearch: function(){
		MeiweiApp.Pages.RestaurantSearch.go();
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
    memberContacts: function(){
        MeiweiApp.Pages.MemberContacts.go();
    },
    orderDetail: function(orderId) {
    	MeiweiApp.Pages.Order.go(orderId);
    },
    memberAttending:function() {
    	MeiweiApp.Pages.Attending.go();
    }
}));

MeiweiApp.goTo = function(path) {
	MeiweiApp.Router.navigate(path, {trigger: true});
};

$.ajaxSetup({
    statusCode : {
        401: function() {
            MeiweiApp.goTo('member/login');
        },
        403: function() {
            MeiweiApp.goTo('member/login');
        }
    }
});
