(function() {

    MeiweiApp.history = {
    	active: MeiweiApp.Pages.Home,
    	stack: []
    };
    
    MeiweiApp.Router = new (Backbone.Router.extend({
        navigate: function(fragment, options) {
            options = options || {};
            options.trigger = !(options.trigger === false);
            Backbone.Router.prototype.navigate.call(this, fragment, options);
        },
    	initialize: function(){
    		this.route('', 'index');
    		this.route('regAuth/:token/*path', 'registerAuthToken');
            this.route('wxAuth/:token/*path', 'registerWxAuthToken');
    
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
    		
    		this.route('packageorder', 'packageOrder');
            this.route('packageorder/confirm', 'packageOrderConfirm');
            this.route('packageorder/detail', 'packageOrderDetail');
    		
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
    	    MeiweiApp.TokenAuth.set(token);
    	    this.navigate(path, {trigger: true});
    	},
    
        registerWxAuthToken: function(token, path) {
            if(token!='0'){
                MeiweiApp.TokenAuth.set(token);
            }
            var index = path.indexOf('&');
            path = path.substr(0,index);
            this.navigate(path, {trigger: true});
        },
    	
    	home: function(lid) { MeiweiApp.goTo('Home', {listId: lid}); },
    	getStarted: function() { MeiweiApp.goTo('GetStarted'); },
    	
    	restaurantDetail: function(rid) { MeiweiApp.goTo('RestaurantDetail', {restaurantId: rid}); },
    	restaurantSearch: function() { MeiweiApp.goTo('RestaurantSearch'); },
    	restaurantOrder: function(rid) { MeiweiApp.goTo('RestaurantOrder', {restaurantId: rid}); },
    	//restaurantFloorplans: function(rid) { MeiweiApp.goTo('RestaurantFloorplans'); },
    	
    	memberCenter: function() { MeiweiApp.goTo('MemberCenter'); },
    	memberLogin: function() { MeiweiApp.goTo('MemberLogin'); },
    	memberProfile: function() { MeiweiApp.goTo('MemberProfile'); },
        memberContacts: function() { MeiweiApp.goTo('MemberContacts'); },
        memberCredits: function() { MeiweiApp.goTo('MemberCredits'); },
        memberFavorites: function() { MeiweiApp.goTo('MemberFavorites'); },
        memberAnniversaries: function() { MeiweiApp.goTo('MemberAnniversaries'); },
        
        orderList: function() { MeiweiApp.goTo('OrderList'); },
        orderDetail: function(oid) { MeiweiApp.goTo('OrderDetail', {orderId: oid}); },
        genericOrderList: function() { MeiweiApp.goTo('GenericOrderList'); },
        genericOrderDetail: function(oid) { MeiweiApp.goTo('GenericOrderDetail', {orderId: oid}); },
        
        productList: function(pid) { MeiweiApp.goTo('ProductList', {productId: pid}); },
        productOrder: function(pid) { MeiweiApp.goTo('ProductOrder', {productItemId: pid}) },
        //productPurchase: function() { MeiweiApp.goTo('ProductPurchase'); },
        productRedeem: function() { MeiweiApp.goTo('ProductRedeem'); },
        
        packageOrder: function() { MeiweiApp.goTo('PackageOrder'); },
        packageOrderConfirm: function() { MeiweiApp.goTo('PackageOrderConfirm'); },
        packageOrderDetail: function() { MeiweiApp.goTo('PackageOrderDetail'); },
        
        requestDriver: function() { MeiweiApp.goTo('RequestDriver'); },
        vvip: function() { MeiweiApp.goTo('VVIP'); },
        
        attending: function() { MeiweiApp.goTo('Attending'); },
        settings: function() { MeiweiApp.goTo('Settings'); }
    }));
    
    MeiweiApp.goToPath = function(path) {
    	MeiweiApp.Router.navigate(path, {trigger: true});
    };
    
    MeiweiApp.goTo = function(pageName, options) {
    	var next = MeiweiApp.Pages[pageName];
    	(options || (options = {})).caller = options.caller || MeiweiApp.history.active;
    	if (next && next != MeiweiApp.history.active) {
    	    if (MeiweiApp.history.active) {
                MeiweiApp.history.stack.push(MeiweiApp.history.active);
                MeiweiApp.history.active.leave();
            }
    		next.go(options);
            this.history.active = next;
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

})();
