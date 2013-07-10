
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
		this.model = new MeiweiApp.Models.Order();
		this.views = {
			orderDetail: new MeiweiApp.Views.OrderDetail({
				model: this.model,
				el: this.$('.scroll .wrapper')
			})
		}
	},
	render: function() {
		this.model.set({id: arguments[0]})
		this.model.fetch();
	}
}))({el: $("#view-order")});
