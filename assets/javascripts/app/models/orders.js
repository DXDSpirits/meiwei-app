(function() {
    
    MeiweiApp.Models.Order = MeiweiApp.Model.extend({
    	urlRoot: MeiweiApp.configs.APIHost + '/orders/order/',
    	parse: function(response) {
    		response.ordertime = response.ordertime.slice(0, 5);
    		response.editable = (response.status < 20);
    		return response;
    	},
    	cancel: function(options) {
    		options = options || {};
    		var url = this.url() + 'cancel/';
    		options.url = url;
            Backbone.sync('update', this, options);
    	}
    });
    
    MeiweiApp.Collections.Orders = MeiweiApp.Collection.extend({
    	url: MeiweiApp.configs.APIHost + '/orders/order/',
    	model: MeiweiApp.Models.Order
    });
    
    MeiweiApp.Models.GenericOrder = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/genericorder/',
        parse: function(response) {
            if (response.attributes && response.attributes.datetime)
                response.attributes.formatted_datetime = moment(response.attributes.datetime).format('LL')
            response.editable = (response.status < 20);
            return response;
        },
        cancel: function(options) {
            options = options || {};
            var url = this.url() + 'cancel/';
            options.url = url;
            Backbone.sync('update', this, options);
        }
    });
    
    MeiweiApp.Collections.GenericOrders = MeiweiApp.Collection.extend({
        url: MeiweiApp.configs.APIHost + '/orders/genericorder/',
        model: MeiweiApp.Models.GenericOrder
    });
    
    MeiweiApp.Models.PackageOrder = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/packagegenericorder/',
        parse: function(response) {
            return _.isArray(response.results) ? response.results[0] : response;
        },
        cancel: function(options) {
            options = options || {};
            var url = this.url() + 'cancel/';
            options.url = url;
            Backbone.sync('update', this, options);
        }
    });
    
    MeiweiApp.Collections.PackageOrders = MeiweiApp.Collection.extend({
        url: MeiweiApp.configs.APIHost + '/orders/genericorder/',
        model: MeiweiApp.Models.GenericOrder
    });
    
    MeiweiApp.Models.OrderDriver = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/orderdriver/'
    });
    
    MeiweiApp.Models.OrderVIPCard = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/ordervipcard/'
    });
    
    MeiweiApp.Models.Coupon = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/orders/coupon/'
    });
    
    MeiweiApp.Collections.Coupons = MeiweiApp.Collection.extend({
        url: MeiweiApp.configs.APIHost + '/orders/coupon/',
        model: MeiweiApp.Models.Coupon,
        premiumCount: function() {
            return this.filter(function(coupon) {
                return 30 == coupon.get('detail').coupon_type
            }).length;
        }
    });
    
})();
