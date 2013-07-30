
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
		MeiweiApp.goTo('RestaurantOrder', {
			restaurant: null,
			restaurantId: this.order.get('restaurant')
		});
	},
	render: function() {
		if (this.options.order) {
			this.order.set(this.options.order);
			this.showPage();
		} else if (this.options.orderId) {
			this.order.set({id: this.options.orderId})
			this.order.fetch({ success: this.showPage })
		}
	}
}))({el: $("#view-order-detail")});
