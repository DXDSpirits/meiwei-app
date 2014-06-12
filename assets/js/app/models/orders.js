
MeiweiApp.Models.Order = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/orders/order/',
	parse: function(response) {
		response.ordertime = response.ordertime.slice(0, 5);
		response.editable = (response.status < 20);
        response.is_payable = false;
        if(response.payment_order) {
            if(response.payment_order.status==0) {
                response.is_payable = true;
            }
        }
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

MeiweiApp.Models.OrderDriver = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/orders/orderdriver/'
});
