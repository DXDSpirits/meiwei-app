
MeiweiApp.Models.Order = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/orders/order/',
	parse: function(response) {
		response.ordertime = response.ordertime.slice(0, 5);
		return response;
	},
	cancel: function() {
		var url = this.url() + 'cancel/';
		Backbone.sync('update', this, {url: url});
	}
});

MeiweiApp.Collections.Orders = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/orders/order/',
	model: MeiweiApp.Models.Order
});
