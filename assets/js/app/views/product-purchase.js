
MeiweiApp.Views.ProductList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "section",
		className: "product-box",
		events: { "click .carousel-item": "triggerSelect" },
		template: MeiweiApp.Templates['product-carousel'],
		render: function() {
			this.$el.html(this.template({
				product: this.model.toJSON(),
				items: this.model.items.toJSON(),
			}));
			return this;
		},
		triggerSelect: function(e) {
			var id = $(e.currentTarget).attr('data-item');
			var item = this.model.items.get(id);
			if (this.$el.hasClass('selected')) {
				this.$el.removeClass('selected');
				MeiweiApp.ProductCart.remove(item);
			} else {
				this.$el.addClass('selected');
				MeiweiApp.ProductCart.add(item);
			}
		}
	})
});

MeiweiApp.Pages.ProductPurchase = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.products = new MeiweiApp.Collections.Products();
		this.views = {
			productList: new MeiweiApp.Views.ProductList({
				collection: this.products,
				el: this.$('.scroll-inner')
			})
		};
		_.bindAll(this, 'carousel');
	},
	onClickLeftBtn: function() {
		MeiweiApp.Pages.RestaurantOrder.updateProductCart();
		MeiweiApp.Pages.RestaurantOrder.showPage();
	},
	onClickRightBtn: function() {
		MeiweiApp.Pages.RestaurantOrder.updateProductCart();
		MeiweiApp.Pages.RestaurantOrder.showPage();
	},
	carousel: function() {
		this.products.forEach(function(product) {
			var selector = '.carousel[data-item="' + product.id + '"]';
			var n = $(selector).find('.carousel-inner > .carousel-item').length;
			console.log(n);
			$(selector).find('.carousel-inner').css('width', n * 150);
			new IScroll(selector, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				snapSpeed: 400
			});
		});
	},
	render: function() {
		$.when(
			this.products.fetch({
				data: {category: 1},
				reset: true,
				success: this.carousel
			})
		).then(this.showPage);
	}
}))({el: $("#view-product-purchase")});
