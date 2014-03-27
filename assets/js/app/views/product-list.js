$(function() {
    var ProductFilter = MeiweiApp.CollectionView.extend({
        ModelView: MeiweiApp.ModelView.extend({
            className: 'filter-item',
            template: Mustache.compile('{{name}}'),
            events: { 'click': 'onclick' },
            onclick: function() {
                MeiweiApp.sendGaEvent('product list', 'select', 'product', this.model.id);
                var page = MeiweiApp.Pages.ProductList;
                var collection = page.views.productList.collection;
                collection.reset(this.model.items.toJSON());
                page.$('.product-filter').addClass('closed');
                page.$('.header-title > span').html(this.model.get('name'));
            }
        })
    });
    
    var ProductItemView = MeiweiApp.ModelView.extend({
    	tagName: "section",
    	className: "product-list-item",
    	template: TPL['product-list-item'],
    	events: { 'click': 'onSelectItem' },
    	render: function() {
    		var attrs = this.model ? this.model.toJSON() : {};
            this.renderTemplate(attrs);
            MeiweiApp.loadBgImage(this.$('.thumbnail'), attrs.picture, { width: 89, height: 89 });
            return this;
    	},
    	onSelectItem: function(e) {
    		MeiweiApp.goTo('ProductOrder', {productItem: this.model.toJSON()});
    	}
    });
    
    var ProductListView = MeiweiApp.CollectionView.extend({
    	ModelView: ProductItemView
    });
    
    MeiweiApp.Pages.ProductList = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-title': 'toggleFilter'
        },
    	initPage: function() {
    	    _.bindAll(this, 'renderAll');
    		this.products = new MeiweiApp.Collections.Products();
    		this.views = {
    			productList: new ProductListView({
    				collection: new MeiweiApp.Collections.ProductItems(),
    				el: this.$('.product-list')
    			}),
    			productFilter: new ProductFilter({
    			    collection: this.products,
    			    el: this.$('.product-filter-wrapper')
    			})
    		};
    	},
        toggleFilter: function() {
            this.$('.product-filter').toggleClass('closed');
            MeiweiApp.sendGaEvent('product list', 'select');
        },
    	renderAll: function() {
    	    var productId = this.options.productId;
    	    var product = this.products.get(productId);
    	    var collectionOfView = this.views.productList.collection;
    	    if (product) {
    	        collectionOfView.reset(product.items.toJSON());
    	        this.$('.header-title > span').html(product.get('name'));
    	    } else {
    	        var items = this.products.map(function(product) {
    	            var item = product.items.at(0);
    	            return item ? item.toJSON() : null;
    	        });
    	        collectionOfView.reset(items);
    	    }
    	},
    	render: function() {
    		this.products.fetch({ data: {category: 1}, success: this.renderAll });
    	}
    }))({el: $("#view-product-list")});
});
