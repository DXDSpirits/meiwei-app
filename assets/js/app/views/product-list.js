$(function() {
    var ProductFilter = MeiweiApp.CollectionView.extend({
        initCollectionView: function() {
            this.listenTo(this.collection, 'reset add remove', this.initScroller);
        },
        initScroller: function() {
            if (this.scroller == null) {
                var $filter = MeiweiApp.Pages.ProductList.$('.product-filter');
                if ($filter.length > 0)
                    this.scroller = new IScroll($filter.selector, { tap: true, bounce: false });
            } else {
                this.scroller.refresh();
            }
        },
        ModelView: MeiweiApp.ModelView.extend({
            className: 'filter-item',
            template: Mustache.compile('{{name}}'),
            events: { 'tap': 'onclick' },
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
    	events: { 'fastclick': 'onSelectItem' },
    	render: function() {
    		var attrs = this.model ? this.model.toJSON() : {};
            this.renderTemplate(attrs);
            MeiweiApp.loadBgImage(this.$('.thumbnail'), attrs.picture, { width: 89, height: 89 });
            return this;
    	},
    	onSelectItem: function(e) {
    		
    	}
    });
    
    var ProductListView = MeiweiApp.CollectionView.extend({
    	ModelView: ProductItemView
    });
    
    MeiweiApp.Pages.ProductList = new (MeiweiApp.PageView.extend({
        events: {
            'fastclick .header-title': 'toggleFilter'
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
    	    this.views.productList.collection.reset(this.products.at(0).items.toJSON());
    	},
    	render: function() {
    		this.products.fetch({ data: {category: 1}, success: this.renderAll });
    	}
    }))({el: $("#view-product-list")});
});
