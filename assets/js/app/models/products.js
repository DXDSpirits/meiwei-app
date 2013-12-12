
MeiweiApp.Models.ProductItem = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/productitem/',
	purchase: function(options) {
		options = options || {};
		var url = this.url() + 'purchase/';
		options.url = url;
        Backbone.sync('read', this, options);
	}
});

MeiweiApp.Collections.ProductItems = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/productitem/',
	model: MeiweiApp.Models.ProductItem
});

MeiweiApp.Models.Product = MeiweiApp.Model.extend({
	initialize: function() {
		this.items = new MeiweiApp.Collections.ProductItems(this.get('productitem_set'));
		this.on('change:productitem_set', function() {
            this.items.reset(this.get('productitem_set'));
        }, this);
	},
	urlRoot: MeiweiApp.configs.APIHost + '/restaurants/product/'
});

MeiweiApp.Collections.Products = MeiweiApp.Collection.extend({
	url: MeiweiApp.configs.APIHost + '/restaurants/product/',
	model: MeiweiApp.Models.Product
});

MeiweiApp.ProductCart = new MeiweiApp.Collections.ProductItems();
