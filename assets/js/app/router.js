
/********************************** Router **********************************/

MeiweiApp.history = {
	active: MeiweiApp.Pages.Home,
	stack: []
};

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		
		this.route('home', 'home');
		
		this.route(/^restaurant\/(\d+)$/, 'restaurantDetail');
		this.route(/^restaurant\/(\d+)\/order$/, 'restaurantOrder');
		this.route('restaurant/search', 'restaurantSearch');
		//this.route(/^restaurant\/(\d+)\/floorplans$/, 'restaurantFloorplans');
		
		this.route('member', 'memberCenter');
		this.route('member/login', 'memberLogin');
		this.route('member/profile', 'memberProfile');
		this.route('member/contacts', 'memberContacts');
		this.route('member/credits', 'memberCredits');
		this.route('member/favorites', 'memberFavorites');
		
		this.route('order', 'orderList');
		this.route(/^order\/(\d+)$/, 'orderDetail');
		
		this.route('product/purchase', 'productPurchase');
		this.route('product/redeem', 'productRedeem');
		
		this.route('attending', 'attending');
		
	},
	
	//index: function() { MeiweiApp.Router.navigate('home', {trigger: true}); },
	
	index: function() { MeiweiApp.Pages.Home.go(); MeiweiApp.history.active = MeiweiApp.Pages.Home; },
	home: function() { MeiweiApp.Pages.Home.go(); MeiweiApp.history.active = MeiweiApp.Pages.Home; },
	
	restaurantDetail: function(rid) { MeiweiApp.Pages.RestaurantDetail.go({restaurantId: rid}); MeiweiApp.history.active = MeiweiApp.Pages.RestaurantDetail; },
	restaurantSearch: function() { MeiweiApp.Pages.RestaurantSearch.go(); MeiweiApp.history.active = MeiweiApp.Pages.RestaurantSearch; },
	restaurantOrder: function(rid) { MeiweiApp.Pages.RestaurantOrder.go({restaurantId: rid}); MeiweiApp.history.active = MeiweiApp.Pages.RestaurantOrder; },
	//restaurantFloorplans: function(rid) { MeiweiApp.Pages.RestaurantFloorplans.go(); MeiweiApp.history.active = MeiweiApp.Pages.RestaurantFloorplans; },
	
	memberCenter: function() { MeiweiApp.Pages.MemberCenter.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberCenter; },
	memberLogin: function() { MeiweiApp.Pages.MemberLogin.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberLogin; },
	memberProfile: function() { MeiweiApp.Pages.MemberProfile.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberProfile; },
    memberContacts: function() { MeiweiApp.Pages.MemberContacts.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberContacts; },
    memberCredits: function() { MeiweiApp.Pages.MemberCredits.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberCredits; },
    memberFavorites: function() { MeiweiApp.Pages.MemberFavorites.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberFavorites; },
    
    orderList: function() { MeiweiApp.Pages.OrderList.go(); MeiweiApp.history.active = MeiweiApp.Pages.OrderList; },
    orderDetail: function(oid) { MeiweiApp.Pages.OrderDetail.go({orderId: oid}); MeiweiApp.history.active = MeiweiApp.Pages.OrderDetail; },
    
    productPurchase: function() { MeiweiApp.Pages.ProductPurchase.go(); MeiweiApp.history.active = MeiweiApp.Pages.ProductPurchase; },
    productRedeem: function() { MeiweiApp.Pages.ProductRedeem.go(); MeiweiApp.history.active = MeiweiApp.Pages.ProductRedeem; },
    
    attending:function() { MeiweiApp.Pages.Attending.go(); MeiweiApp.history.active = MeiweiApp.Pages.Attending; }
}));

MeiweiApp.goToPath = function(path) {
	MeiweiApp.Router.navigate(path, {trigger: true});
};

MeiweiApp.goTo = function(pageName, options) {
	var next = MeiweiApp.Pages[pageName];
	(options || (options = {})).caller = options.caller || MeiweiApp.history.active;
	if (next != MeiweiApp.history.active) {
		MeiweiApp.history.stack.push(MeiweiApp.history.active);
		MeiweiApp.history.active = next;
		MeiweiApp.history.active.go(options);
	}
	if (pageName == 'Home') MeiweiApp.history.stack.length = 0;
};

MeiweiApp.refreshActivePage = function() {
	MeiweiApp.history.active.refresh();
};

MeiweiApp.goBack = function() {
	if (MeiweiApp.history.stack.length > 0) {
		var prev = MeiweiApp.history.stack.pop();
		MeiweiApp.history.active = prev;
		MeiweiApp.history.active.showPage();
	} else if (MeiweiApp.history.active != MeiweiApp.Pages.Home) {
		MeiweiApp.history.active = MeiweiApp.Pages.Home;
		MeiweiApp.Pages.Home.go();
	}
};

/*
$.ajaxSetup({
    statusCode : {
        499: function() {
            MeiweiApp.Pages.MemberLogin.go({ ref: MeiweiApp.history.active });
        },
        401: function() {
            MeiweiApp.Pages.MemberLogin.go({ ref: MeiweiApp.history.active });
        },
        403: function() {
            MeiweiApp.Pages.MemberLogin.go({ ref: MeiweiApp.history.active });
        }
    }
});
*/
