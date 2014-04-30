
/********************************** Router **********************************/

MeiweiApp.history = {
	active: MeiweiApp.Pages.Home,
	stack: []
};

MeiweiApp.Router = new (Backbone.Router.extend({
	initialize: function(){
		this.route('', 'index');
		this.route('regAuth/:token/*path', 'registerAuthToken');
        this.route('wxAuth/:wxtoken/:token/*path', 'registerWxAuthToken');

		this.route(/^home(?:\/l(\d+))?$/, 'home');
		this.route('getstarted', 'getStarted');
		
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
		this.route('member/anniversaries', 'memberAnniversaries');
		
		this.route('order', 'orderList');
		this.route(/^order\/(\d+)$/, 'orderDetail');
		this.route('genericorder', 'genericOrderList');
        this.route(/^genericorder\/(\d+)$/, 'genericOrderDetail');
		
		this.route(/^product(?:\/p(\d+))?$/, 'productList');
		this.route(/^product\/(\d+)\/order$/, 'productOrder');
		this.route('product/purchase', 'productPurchase');
		this.route('product/redeem', 'productRedeem');
		
		this.route('requestdriver', 'requestDriver');
		this.route('vvip', 'vvip');
		
		this.route('attending', 'attending');
		this.route('settings', 'settings');
	},
	
	index: function() {
	    if (localStorage.getItem('first-time')) {
	        MeiweiApp.Pages.Home.go(); MeiweiApp.history.active = MeiweiApp.Pages.Home;
	    } else {
	        MeiweiApp.Pages.GetStarted.go(); MeiweiApp.history.active = MeiweiApp.Pages.GetStarted;
	    }
	},
	
	registerAuthToken: function(token, path) {
        var index = path.indexOf("?");
        if(index>0) {
            path = path.substr(0,index);
        }
	    MeiweiApp.TokenAuth.set(token);
	    this.navigate(path, {trigger: true});
	},

    registerWxAuthToken: function(wxtoken,token, path) {
        if(token!='0'){
            MeiweiApp.TokenAuth.set(token);
        }
        window.localStorage.setItem('wxtoken',wxtoken);
        this.navigate(path, {trigger: true});
    },
	
	home: function(lid) { MeiweiApp.Pages.Home.go({listId: lid}); MeiweiApp.history.active = MeiweiApp.Pages.Home; },
	getStarted: function() { MeiweiApp.Pages.GetStarted.go(); MeiweiApp.history.active = MeiweiApp.Pages.GetStarted; },
	
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
    memberAnniversaries: function() { MeiweiApp.Pages.MemberAnniversaries.go(); MeiweiApp.history.active = MeiweiApp.Pages.MemberAnniversaries; },
    
    orderList: function() { MeiweiApp.Pages.OrderList.go(); MeiweiApp.history.active = MeiweiApp.Pages.OrderList; },
    orderDetail: function(oid) { MeiweiApp.Pages.OrderDetail.go({orderId: oid}); MeiweiApp.history.active = MeiweiApp.Pages.OrderDetail; },
    genericOrderList: function() { MeiweiApp.Pages.GenericOrderList.go(); MeiweiApp.history.active = MeiweiApp.Pages.GenericOrderList; },
    genericOrderDetail: function(oid) { MeiweiApp.Pages.GenericOrderDetail.go({orderId: oid}); MeiweiApp.history.active = MeiweiApp.Pages.GenericOrderDetail; },
    
    productList: function(pid) { MeiweiApp.Pages.ProductList.go({productId: pid}); MeiweiApp.history.active = MeiweiApp.Pages.ProductList; },
    productOrder: function(pid) { MeiweiApp.Pages.ProductOrder.go({productItemId: pid}); MeiweiApp.history.active = MeiweiApp.Pages.ProductOrder; },
    productPurchase: function() { MeiweiApp.Pages.ProductPurchase.go(); MeiweiApp.history.active = MeiweiApp.Pages.ProductPurchase; },
    productRedeem: function() { MeiweiApp.Pages.ProductRedeem.go(); MeiweiApp.history.active = MeiweiApp.Pages.ProductRedeem; },
    
    requestDriver: function() { MeiweiApp.Pages.RequestDriver.go(); MeiweiApp.history.active = MeiweiApp.Pages.RequestDriver; },
    vvip: function() { MeiweiApp.Pages.VVIP.go(); MeiweiApp.history.active = MeiweiApp.Pages.VVIP; },
    
    attending: function() { MeiweiApp.Pages.Attending.go(); MeiweiApp.history.active = MeiweiApp.Pages.Attending; },
    settings: function() { MeiweiApp.Pages.Settings.go(); MeiweiApp.history.active = MeiweiApp.Pages.Settings; }
}));

MeiweiApp.goToPath = function(path) {
	MeiweiApp.Router.navigate(path, {trigger: true});
};

MeiweiApp.goTo = function(pageName, options) {
	var next = MeiweiApp.Pages[pageName];
	(options || (options = {})).caller = options.caller || MeiweiApp.history.active;
	if (next != MeiweiApp.history.active) {
	    MeiweiApp.abortAllAjax();
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
    MeiweiApp.abortAllAjax();
	if (MeiweiApp.history.stack.length > 0) {
		var prev = MeiweiApp.history.stack.pop();
		MeiweiApp.history.active = prev;
		MeiweiApp.history.active.showPage();
	} else if (MeiweiApp.history.active != MeiweiApp.Pages.Home) {
		MeiweiApp.history.active = MeiweiApp.Pages.Home;
		MeiweiApp.Pages.Home.go();
	}
};
