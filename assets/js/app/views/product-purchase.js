
MeiweiApp.Views.ProductList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "section",
		className: "product-carousel",
		template: MeiweiApp.Templates['product-carousel'],
		initialize: function() {
			//this.$el.attr("id", "product" + this.model.id);
		},
		render: function() {
			this.$el.html(this.template({
				product: this.model.toJSON(),
				items: this.model.items.toJSON(),
			}));
			return this;
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
		}
	},
	render: function() {
		$.when(
			this.products.fetch({ data: {category: 1}, reset: true })
		).then(this.showPage);
	}
}))({el: $("#view-product-purchase")});
