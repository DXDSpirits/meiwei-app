
MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item'],
		events: { 'click': 'viewOrder' },
		className: 'order-list-item',
		viewOrder: function() {
			MeiweiApp.goTo('OrderDetail', {
				order: this.model.toJSON()
			});
		}
	})
});

MeiweiApp.Pages.OrderList = new (MeiweiApp.PageView.extend({
	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
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
		this.$('.filter-fulfilled').removeClass('selected');
		this.$('.filter-pending').addClass('selected');
		this.orders.fetch({
			reset : true,
			data : { status : 'pending' },
			success: this.initScroller
		});
	},
	getFulfilledOrders: function() {
		this.$('.filter-fulfilled').addClass('selected');
		this.$('.filter-pending').removeClass('selected');
		this.orders.fetch({
			reset: true,
			data: { status: 'fulfilled' },
			success: this.initScroller
		});
	},
	render: function() {
		this.getPendingOrders();
		this.showPage();
	}
}))({el: $("#view-order-list")});
