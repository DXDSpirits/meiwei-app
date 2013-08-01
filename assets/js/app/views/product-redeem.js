
MeiweiApp.Views.ProductList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "section",
		className: "product-box",
		events: { "click .carousel-item": "triggerSelect" },
		template: MeiweiApp.Templates['product-carousel'],
		render: function() {
			this.model.items.forEach(function(item) {
				var findItem = MeiweiApp.ProductCart.where({id: item.id});
				item.set({selected: !_.isEmpty(findItem)});
			}, this);
			this.$el.html(this.template({
				product: this.model.toJSON(),
				items: this.model.items.toJSON()
			}));
			return this;
		},
		triggerSelect: function(e) {
			var $el = $(e.currentTarget);
			var id = $el.attr('data-item');
			var item = this.model.items.get(id);
			if ($el.hasClass('selected')) {
				$el.removeClass('selected');
				MeiweiApp.ProductCart.remove(item);
			} else {
				$el.addClass('selected');
				MeiweiApp.ProductCart.add(item);
			}
		}
	})
});

MeiweiApp.Pages.ProductRedeem = new (MeiweiApp.PageView.extend({
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
	onClickLeftBtn: function() { MeiweiApp.goBack(); },
	onClickRightBtn: function() { MeiweiApp.goBack(); },
	carousel: function() {
		this.products.forEach(function(product) {
			var selector = '.carousel[data-item="' + product.id + '"]';
			var items = $(selector).find('.carousel-inner > .carousel-item');
			$(selector).find('.carousel-inner').css('width', items.length * $(items[0]).outerWidth());
			new IScroll(selector, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				snapSpeed: 400,
				click: true
			});
		});
	},
	render: function() {
		$.when(
			this.products.fetch({
				data: {category: 2},
				reset: true,
				success: this.carousel
			})
		).then(this.showPage);
	}
}))({el: $("#view-product-redeem")});
