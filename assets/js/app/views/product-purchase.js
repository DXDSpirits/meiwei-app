
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
				MeiweiApp.ProductCart[id] = null;
			} else {
				this.$el.addClass('selected');
				MeiweiApp.ProductCart[id] = true;
			}
		}
	})
});

MeiweiApp.Pages.ProductPurchase = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.restaurant = new MeiweiApp.Models.Restaurant();
		this.products = new MeiweiApp.Collections.Products();
		this.selected = {};
		this.views = {
			productList: new MeiweiApp.Views.ProductList({
				collection: this.products,
				el: this.$('.scroll-inner')
			})
		};
	},
	onClickLeftBtn: function() { MeiweiApp.Pages.RestaurantOrder.go(); },
	onClickRightBtn: function() { MeiweiApp.Pages.RestaurantOrder.go(); },
	render: function() {
		$.when(
			this.products.fetch({
				data: {category: 1},
				reset: true
			})
		).then(this.showPage);
	}
}))({el: $("#view-product-purchase")});
