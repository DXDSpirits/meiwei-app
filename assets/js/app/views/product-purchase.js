
MeiweiApp.Views.ProductModelView = MeiweiApp.ModelView.extend({
	tagName: "section",
	className: "product-box",
	events: { "click .carousel-item": "onSelectItem" },
	template: MeiweiApp.Templates['product-carousel'],
	render: function() {
		this.model.items.forEach(function(item) {
			item.set({selected: (MeiweiApp.ProductCart.get(item.id) != null)});
		}, this);
		this.$el.html(this.template({
			product: this.model.toJSON(),
			items: this.model.items.toJSON()
		}));
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
		_.bindAll(this, 'carousel');
		this.products = new MeiweiApp.Collections.Products();
		this.views = {
			productList: new MeiweiApp.Views.ProductPurchaseList({
				collection: this.products,
				el: this.$('.scroll-inner')
			})
		};
	},
	onClickLeftBtn: function() { MeiweiApp.goBack(); },
	onClickRightBtn: function() {
		console.log(this.options.caller);
		if (this.options.caller == MeiweiApp.Pages.MemberCenter) {
			MeiweiApp.goTo('RestaurantOrder', { restaurantId: 1 });
		} else if (this.options.caller == MeiweiApp.Pages.RestaurantOrder) {
			MeiweiApp.goBack();
		}
	},
	carousel: function() {
		this.carouselScrolls = this.carouselScrolls || [];
		for (var i=0; i<this.carouselScrolls.length; i++) this.carouselScrolls[i].destroy();
		this.carouselScrolls.length = 0;
		this.products.forEach(function(product) {
			var selector = '.carousel[data-item="' + product.id + '"]';
			var items = $(selector).find('.carousel-inner > .carousel-item');
			$(selector).find('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
			this.carouselScrolls.push(new IScroll(selector, {
				scrollX: true, scrollY: false, momentum: false, snap: true, click: true 
			}));
		}, this);
	},
	render: function() {
		var self = this;
		this.products.fetch({ data: {category: 1}, reset: true, success: function() {
			self.carousel();
			self.showPage();
		}});
	}
}))({el: $("#view-product-purchase")});


/*****************************************************************************************************/
/****************************************** ProductPurchase ******************************************/
/*****************************************************************************************************/



/*****************************************************************************************************/
/******************************************* ProductRedeem *******************************************/
/*****************************************************************************************************/

MeiweiApp.Views.ProductItemDetail = MeiweiApp.View.extend({
	className: 'dialog',
	initialize: function() {
		_.bindAll(this, 'closeDialog', 'confirmPurchase')
	},
	events: {
		'click .btn-cancel': 'closeDialog',
		'click .btn-confirm': 'confirmPurchase'
	},
	closeDialog: function() {
		this.remove();
		$('#dialog-overlay').hide();
	},
	confirmPurchase: function() {
		var self = this;
		this.model.purchase({
			success: function(model, response, options) {
				self.$('.btn-confirm').remove();
				self.$('.content .info-text span').html(model.balance);
				self.$('.content .info-text').show();
			},
			error: function(model, response, options) {
				var error = JSON.parse(model.responseText);
				self.$('.btn-confirm').remove();
				self.$('.content .info-text').html(error.detail);
				self.$('.content .info-text').show();
			}
		});
	},
	template: MeiweiApp.Templates['product-item-detail'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		$('body').append(this.el);
		$('#dialog-overlay').show();
		this.delegateEvents();
		return this;
	}
});

MeiweiApp.Views.ProductRedeemList = MeiweiApp.Views.ProductPurchaseList.extend({
	ModelView: MeiweiApp.Views.ProductModelView.extend({
		render: function() {
			this.$el.html(this.template({
				product: this.model.toJSON(),
				items: this.model.items.toJSON()
			}));
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
	initPage: function() {
		_.bindAll(this, 'carousel');
		this.products = new MeiweiApp.Collections.Products();
		this.views = {
			productList: new MeiweiApp.Views.ProductRedeemList({
				collection: this.products,
				el: this.$('.scroll-inner')
			}),
			detailDialog: new MeiweiApp.Views.ProductItemDetail()
		};
	},
	render: function() {
		var self = this;
		this.products.fetch({ data: {category: 2}, reset: true, success: function() {
			self.carousel();
			self.showPage();
		}});
	}
}))({el: $("#view-product-redeem")});
