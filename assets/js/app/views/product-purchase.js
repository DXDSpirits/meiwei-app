
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
		this.carouselScrolls = []
	},
	onClickLeftBtn: function() { MeiweiApp.goBack(); },
	onClickRightBtn: function() { MeiweiApp.goBack(); },
	carousel: function() {
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
		$.when(
			this.products.fetch({ data: {category: 1}, reset: true, success: this.carousel })
		).then(this.showPage);
	}
}))({el: $("#view-product-purchase")});

/******************************************************************************************/

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
			console.log(item);
		}
	})
});

MeiweiApp.Pages.ProductRedeem = new (MeiweiApp.Pages.ProductPurchase.constructor.extend({
	render: function() {
		$.when(
			this.products.fetch({ data: {category: 2}, reset: true, success: this.carousel })
		).then(this.showPage);
	}
}))({el: $("#view-product-redeem")});
