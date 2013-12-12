
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

MeiweiApp.Models.OrderDriver = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/orders/orderdriver/'
});
