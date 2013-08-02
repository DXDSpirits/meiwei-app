
MeiweiApp.Models.ProductItem = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/productitem/',
	purchase: function(options) {
		options = options || {};
		var url = this.url() + 'purchase/';
		options.url = url;
		Backbone.sync('update', this, options)
	}
});

MeiweiApp.Collections.ProductItems = MeiweiApp.Collection.extend({
	model: MeiweiApp.Models.ProductItem
});

MeiweiApp.Models.Product = MeiweiApp.Model.extend({
	initialize: function() {
		this.items = this.items || new MeiweiApp.Collections.ProductItems();
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/product/',
	parse: function(response) {
		this.items = this.items || new MeiweiApp.Collections.ProductItems();
		this.items.reset(response.productitem_set)
		response.productitem_set = null;
		return response;
	}
});

MeiweiApp.Collections.Products = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/product/',
	model: MeiweiApp.Models.Product
});

MeiweiApp.ProductCart = new MeiweiApp.Collections.ProductItems();
