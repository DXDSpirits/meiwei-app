$(function() {
    MeiweiApp.Views.ProductModelView = MeiweiApp.ModelView.extend({
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
    
    MeiweiApp.Views.ProductPurchaseList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.Views.ProductModelView
    });
    
    MeiweiApp.Pages.ProductPurchase = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    	    _.bindAll(this, 'renderAll');
    		this.products = new MeiweiApp.Collections.Products();
    		this.views = {
    			productList: new MeiweiApp.Views.ProductPurchaseList({
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
    	        this.scroller.scrollToElement(item.closest('.product-box')[0], 1000);
    	    } else {
    	        this.scroller.scrollTo(0, 0);
    	    }
    	},
    	render: function() {
    		this.products.fetch({ data: {category: 1}, reset: true, success: this.renderAll });
    	}
    }))({el: $("#view-product-purchase")});
    
    
    /*****************************************************************************************************/
    /****************************************** ProductPurchase ******************************************/
    /*****************************************************************************************************/
    
    
    
    /*****************************************************************************************************/
    /******************************************* ProductRedeem *******************************************/
    /*****************************************************************************************************/
    
    MeiweiApp.Views.ProductItemDetail = MeiweiApp.View.extend({
    	className: 'dialog product-detail',
    	template: TPL['product-item-detail'],
    	events: {
    		'fastclick .btn-cancel': 'closeDialog',
    		'fastclick .btn-confirm': 'confirmPurchase'
    	},
    	closeDialog: function() {
    		this.remove();
    		$('#dialog-overlay').addClass('hidden');
    		this.undelegateEvents();
    	},
    	openDialog: function() {
    		$('body').append(this.el);
    		$('#dialog-overlay').removeClass('hidden');
    		this.delegateEvents();
    	},
    	confirmPurchase: function() {
    		var self = this;
    		this.model.purchase({
    		    /* IMPORTANT !!!
    		     * Backbone.sync ($.ajax)
    		     * passes response data (json), status text and jqXHR object to success 
    		     * and jqXHR object, status text and http error
    		     */
    			success: function(data, textStatus, jqXHR) {
    				self.$('.btn-confirm').remove();
    				self.$('.content .info-text .balance').html(data.balance);
    				self.$('.content .info-text').removeClass('hidden');
    			},
    			error: function(jqXHR, textStatus, errorThrown) {
    				self.$('.btn-confirm').remove();
    				self.$('.content .info-text').removeClass('hidden');
    				self.displayError(self.$('.content .info-text'), jqXHR.responseText);
    			}
    		});
    	},
    	render: function() {
    		this.renderTemplate(this.model.toJSON());
    		this.openDialog();
    		return this;
    	}
    });
    
    MeiweiApp.Views.ProductRedeemList = MeiweiApp.Views.ProductPurchaseList.extend({
    	ModelView: MeiweiApp.Views.ProductModelView.extend({
    		render: function() {
    			this.renderTemplate({
                    product: this.model.toJSON(),
                    items: this.model.items.toJSON()
                });
    			return this;
    		},
    		onSelectItem: function(e) {
    			var $el = $(e.currentTarget);
    			var item = this.model.items.get($el.attr('data-item'));
    			var dialog = MeiweiApp.Pages.ProductRedeem.views.detailDialog;
    			dialog.remove();
    			dialog.model = item;
    			dialog.render();
    		}
    	})
    });
    
    MeiweiApp.Pages.ProductRedeem = new (MeiweiApp.Pages.ProductPurchase.constructor.extend({
    	onClickRightBtn: function() { MeiweiApp.goBack(); },
    	initPage: function() {
    		this.products = new MeiweiApp.Collections.Products();
    		this.views = {
    			productList: new MeiweiApp.Views.ProductRedeemList({
    				collection: this.products,
    				el: this.$('.wrapper')
    			}),
    			detailDialog: new MeiweiApp.Views.ProductItemDetail()
    		};
    	},
    	render: function() {
        	this.products.fetch({ data: {category: 2}, reset: true });
    	}
    }))({el: $("#view-product-redeem")});
});
