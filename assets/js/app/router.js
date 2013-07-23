
/********************************** Router **********************************/

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		
		this.route('home', 'home');
		
		this.route(/^restaurant\/(\d+)$/, 'restaurantDetail');
		this.route(/^restaurant\/(\d+)\/order$/, 'restaurantOrder');
		this.route('restaurant/search', 'restaurantSearch');
		this.route(/^restaurant\/(\d+)\/floorplans$/, 'restaurantFloorplans');
		
		this.route('member', 'memberCenter');
		this.route('member/login', 'memberLogin');
		this.route('member/profile', 'memberProfile');
		this.route('member/contacts', 'memberContacts');
		this.route('member/credits', 'memberCredits');
		this.route('member/favorites', 'memberFavorites');
		
		this.route('order', 'orderList');
		this.route(/^order\/(\d+)$/, 'orderDetail');
		
		this.route('product/purchase', 'productPurchase');
		
		this.route('attending', 'attending');
		
	},
	
	//index: function() { MeiweiApp.Router.navigate('home', {trigger: true}); },
	
	index: function() { MeiweiApp.Pages.Home.go(); },
	home: function() { MeiweiApp.Pages.Home.go(); },
	
	restaurantDetail: function(rid) { MeiweiApp.Pages.RestaurantDetail.go({restaurantId: rid}); },
	restaurantSearch: function() { MeiweiApp.Pages.RestaurantSearch.go(); },
	restaurantOrder: function(rid) { MeiweiApp.Pages.RestaurantOrder.go({restaurantId: rid}); },
	restaurantFloorplans: function(rid) { MeiweiApp.Pages.RestaurantFloorplans.go({restaurantId: rid}); },
	
	memberCenter: function() { MeiweiApp.Pages.MemberCenter.go(); },
	memberLogin: function() { MeiweiApp.Pages.MemberLogin.go(); },
	memberProfile: function() { MeiweiApp.Pages.MemberProfile.go(); },
    memberContacts: function() { MeiweiApp.Pages.MemberContacts.go(); },
    memberCredits: function() { MeiweiApp.Pages.MemberCredits.go(); },
    memberFavorites: function() { MeiweiApp.Pages.MemberFavorites.go(); },
    
    orderList: function() { MeiweiApp.Pages.OrderList.go(); },
    orderDetail: function(oid) { MeiweiApp.Pages.OrderDetail.go({orderId: oid}); },
    
    productPurchase: function() { MeiweiApp.Pages.ProductPurchase.go(); },
    
    attending:function() { MeiweiApp.Pages.Attending.go(); }
}));

MeiweiApp.goTo = function(path) {
	MeiweiApp.Router.navigate(path, {trigger: true});
};

$.ajaxSetup({
    statusCode : {
        401: function() {
            MeiweiApp.Pages.MemberLogin.go();
        },
        403: function() {
            MeiweiApp.Pages.MemberLogin.go();
        }
    }
});
