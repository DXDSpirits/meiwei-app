
MeiweiApp.Models.Order = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/orders/order/'
});

MeiweiApp.Collections.Orders = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/orders/order/',
	model: MeiweiApp.Models.Order
});
