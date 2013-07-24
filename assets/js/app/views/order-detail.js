
MeiweiApp.Views.OrderDetail = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['order-detail'],
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
	onClickLeftBtn: function() { this.options.caller.showPage(); },
	onClickRightBtn: function() {
		MeiweiApp.pendingOrder = this.order;
		MeiweiApp.Pages.RestaurantOrder.go({
			restaurantId: this.order.get('restaurant'),
			caller: this
		});
	},
	render: function(options) {
		this.options = { caller: MeiweiApp.Pages.Home };
		_.extend(this.options, options);
		this.order.set({id: options.orderId})
		$.when(
			this.order.fetch()
		).then(this.showPage);
	}
}))({el: $("#view-order-detail")});
