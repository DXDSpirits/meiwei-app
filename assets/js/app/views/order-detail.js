
MeiweiApp.Views.OrderDetail = MeiweiApp.ModelView.extend({
	events: {
		'click .button-modify-order': 'modifyOrder'
	},
	template: MeiweiApp.Templates['order-detail'],
	modifyOrder: function(e) {
		e.preventDefault();
		MeiweiApp.pendingOrder = this.model;
		MeiweiApp.Router.navigate('restaurant/' + this.model.get('restaurant') + '/order', {trigger: true});
	}
});

MeiweiApp.Pages.Order = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.order = new MeiweiApp.Models.Order();
		this.views = {
			orderDetail: new MeiweiApp.Views.OrderDetail({
				model: this.order,
				el: this.$('.scroll .wrapper')
			})
		}
	},
	render: function() {
		this.order.set({id: arguments[0]})
		$.when(
			this.order.fetch()
		).then(this.showPage);
	}
}))({el: $("#view-order")});
