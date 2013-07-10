
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
		this.collection = new MeiweiApp.Collections.Orders();
        this.orderListView = new MeiweiApp.Views.OrderList({
            collection: this.collection,
            el: this.$('.scroll .wrapper')
        });
	},
    render: function() {
        this.collection.fetch({reset: true});
    }
}))({el: $("#view-member-orders")});
