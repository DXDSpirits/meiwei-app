
MeiweiApp.Views.OrderDetail = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['order-detail']
});

MeiweiApp.Pages.OrderDetail = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.order = new MeiweiApp.Models.Order();
		this.views = {
			orderDetail: new MeiweiApp.Views.OrderDetail({
				model: this.order,
				el: this.$('.scroll .scroll-inner')
			})
		}
	},
	onClickRightBtn: function() {
		MeiweiApp.pendingOrder = this.order;
		MeiweiApp.ProductCart.reset(this.order.get('product_items'))
		console.log(this.order.get('product_items'));
		MeiweiApp.goTo('RestaurantOrder', {
			restaurantId: this.order.get('restaurant')
		});
	},
	render: function(options) {
		this.options = this.options || {};
		_.extend(this.options, options);
		this.order.set({id: options.orderId})
		$.when(
			this.order.fetch()
		).then(this.showPage);
	}
}))({el: $("#view-order-detail")});
