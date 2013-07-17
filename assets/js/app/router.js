
/********************************** Router **********************************/

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		this.route('home', 'home');
		
		this.route(/^restaurant\/(\d+)$/, 'restaurantDetail');
		this.route(/^restaurant\/(\d+)\/order$/, 'restaurantOrder');
		this.route('restaurant/search', 'restaurantSearch');
		
		this.route('member', 'memberCenter');
		this.route('member/login', 'memberLogin');
		this.route('member/profile', 'memberProfile');
		this.route('member/contacts', 'memberContacts');
		
		this.route('order', 'orderList');
		this.route(/^order\/(\d+)$/, 'orderDetail');
		
		this.route('attending', 'attending');
	},
	
	index: function() { MeiweiApp.Router.navigate('home', {trigger: true}); },
	home: function() { MeiweiApp.Pages.Home.go(); },
	
	restaurantDetail: function(rid) { MeiweiApp.Pages.RestaurantDetail.go(rid); },
	restaurantSearch: function() { MeiweiApp.Pages.RestaurantSearch.go(); },
	restaurantOrder: function(rid) { MeiweiApp.Pages.RestaurantOrder.go(rid); },
	
	memberCenter: function() { MeiweiApp.Pages.MemberCenter.go(); },
	memberLogin: function() { MeiweiApp.Pages.MemberLogin.go(); },
	memberProfile: function() { MeiweiApp.Pages.MemberProfile.go(); },
    memberContacts: function() { MeiweiApp.Pages.MemberContacts.go(); },
    
    orderList: function() { MeiweiApp.Pages.OrderList.go(); },
    orderDetail: function(orderId) { MeiweiApp.Pages.Order.go(orderId); },
    
    attending:function() { MeiweiApp.Pages.Attending.go(); }
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
