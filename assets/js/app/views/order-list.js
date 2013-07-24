
MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item'],
		events: { 'click': 'viewOrder' },
		className: 'order-list-item',
		viewOrder: function() {
			MeiweiApp.Pages.OrderDetail.go({
				orderId: this.model.id,
				caller: MeiweiApp.Pages.OrderList
			});
		}
	})
});

MeiweiApp.Pages.OrderList = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.orders = new MeiweiApp.Collections.Orders();
		this.views = {
			orderList: new MeiweiApp.Views.OrderList({
				collection: this.orders,
				el: this.$('.scroll .scroll-inner')
			})
		}
	},
	onClickLeftBtn: function() { MeiweiApp.Pages.MemberCenter.showPage(); },
	render: function() {
		$.when(
			this.orders.fetch({reset: true})
		).then(this.showPage);
	}
}))({el: $("#view-order-list")});
