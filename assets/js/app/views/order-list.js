
MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item'],
		events: { 'click': 'viewOrder' },
		className: 'order-list-item',
		viewOrder: function() {
			MeiweiApp.goTo('OrderDetail', {
				orderId: this.model.id
			});
		}
	})
});

MeiweiApp.Pages.OrderList = new (MeiweiApp.PageView.extend({
	events: {
		'click .filter-pending': 'getPendingOrders',
		'click .filter-fulfilled': 'getFulfilledOrders'
	},
	initPage: function() {
		this.orders = new MeiweiApp.Collections.Orders();
		this.views = {
			orderList: new MeiweiApp.Views.OrderList({
				collection: this.orders,
				el: this.$('.scroll .scroll-inner')
			})
		}
	},
	getPendingOrders: function() {
		this.orders.fetch({
			reset: true,
			data: { status: 'pending' }
		});
	},
	getFulfilledOrders: function() {
		this.orders.fetch({
			reset: true,
			data: { status: 'fulfilled' }
		});
	},
	render: function() {
		$.when(
			this.orders.fetch({
				reset: true,
				data: { status: 'pending' }
			})
		).then(this.showPage);
	}
}))({el: $("#view-order-list")});
