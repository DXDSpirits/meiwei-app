$(function() {
    ProductModelView = MeiweiApp.ModelView.extend({
    	tagName: "section",
    	className: "product-box",
    	template: TPL['product-stack'],
    	events: { 'fastclick .stack-item': 'onSelectItem' },
    	render: function() {
    		this.model.items.forEach(function(item) {
    			item.set({selected: (MeiweiApp.ProductCart.get(item.id) != null)});
    		}, this);
    		this.renderTemplate({
                product: this.model.toJSON(),
                items: this.model.items.toJSON()
            });
    		var items = this.model.items;
    		this.$('.stack-item').each(function() {
    		    var id = +$(this).attr('data-item');
    		    MeiweiApp.loadBgImage($(this).find('.img'), items.get(id).get('picture'), {
                	height: 150, width: 150
                });
    		});
    		MeiweiApp.initLang(this.$el);
    		return this;
    	},
    	onSelectItem: function(e) {
    		var $el = $(e.currentTarget);
    		var item = this.model.items.get($el.attr('data-item'));
    		if ($el.hasClass('selected')) {
    			$el.removeClass('selected');
    			MeiweiApp.ProductCart.remove(item);
    		} else {
    			$el.addClass('selected');
    			MeiweiApp.ProductCart.add(item);
    		}
    	}
    });
    
    ProductPurchaseList = MeiweiApp.CollectionView.extend({
    	ModelView: ProductModelView
    });
    
    MeiweiApp.Pages.ProductList = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    	    _.bindAll(this, 'renderAll');
    		this.products = new MeiweiApp.Collections.Products();
    		this.views = {
    			productList: new ProductPurchaseList({
    				collection: this.products,
    				el: this.$('.wrapper')
    			})
    		};
    	},
    	onClickRightBtn: function() {
    		if (this.options.caller == MeiweiApp.Pages.RestaurantOrder) {
    			MeiweiApp.goBack();
    		} else {
    			MeiweiApp.goTo('RestaurantOrder', { restaurantId: 1 });
    		}
    	},
    	renderAll: function() {
    	    if (this.options.itemId) {
    	        var item = this.$('.stack-item[data-item=' + this.options.itemId + ']');
                var offsetItem = item.closest('.product-box').position().top;
                var offsetWrapper = this.$('.wrapper').scrollTop();
                this.$('.wrapper').animate({scrollTop: offsetItem + offsetWrapper}, 700);
    	    } else {
    	        this.$('.wrapper').animate({scrollTop: 0}, 700);
    	    }
    	},
    	render: function() {
    		this.products.fetch({ data: {category: 1}, success: this.renderAll });
    	}
    }))({el: $("#view-product-list")});
});
