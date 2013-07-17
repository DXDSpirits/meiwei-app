
MeiweiApp.Views.OrderDetail = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['order-detail'],
});

MeiweiApp.Pages.Order = new (MeiweiApp.PageView.extend({
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
		MeiweiApp.goTo('restaurant/' + this.order.get('restaurant') + '/order');
	},
	render: function() {
		this.order.set({id: arguments[0]})
		$.when(
			this.order.fetch()
		).then(this.showPage);
	}
}))({el: $("#view-order-detail")});
