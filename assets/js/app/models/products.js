
MeiweiApp.Models.ProductItem = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/productitem/',
});

MeiweiApp.Collections.ProductItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.ProductItem,
});

MeiweiApp.Models.Product = MeiweiApp.Model.extend({
	initialize: function() {
		if (this.items == null) this.items = new MeiweiApp.Collections.ProductItems();
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/product/',
	parse: function(response) {
		this.initialize();
		this.items.reset(response.productitem_set)
		response.productitem_set = null;
		return response;
	}
});

MeiweiApp.Collections.Products = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/product/',
	model: MeiweiApp.Models.Product,
});
