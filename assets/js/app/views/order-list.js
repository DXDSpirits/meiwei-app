
MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item'],
		events: { 'click': 'viewOrder' },
		viewOrder: function() {
			MeiweiApp.Router.navigate('member/order/' + this.model.id, {trigger: true});
		}
	})
});

MeiweiApp.Pages.MemberOrders = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.orders = new MeiweiApp.Collections.Orders();
        this.views = {
        	orderList: new MeiweiApp.Views.OrderList({
	            collection: this.orders,
	            el: this.$('.scroll .wrapper')
	        })
	    }
	},
    render: function() {
        $.when(
        	this.orders.fetch({reset: true})
        ).then(this.showPage);
    }
}))({el: $("#view-member-orders")});
