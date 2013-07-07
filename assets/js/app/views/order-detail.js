
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
	initialize: function() {
		this.model = new MeiweiApp.Models.Order();
		this.views.OrderDetail = new MeiweiApp.Views.OrderDetail({
			model: this.model,
			el: this.$('.scroll .wrapper')
		});
	},
	show: function(orderId) {
		this.model.set({id: orderId})
		this.model.fetch();
		this.slideIn();
	}
}))({el: $("#view-order")});
