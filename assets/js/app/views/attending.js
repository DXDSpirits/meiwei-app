
MeiweiApp.Views.OrderList1 = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		template: MeiweiApp.Templates['order-list-item']
	})
});

MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.orders = new MeiweiApp.Collections.Orders();
        this.views = {
        	orderList: new MeiweiApp.Views.OrderList1({
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
}))({el: $("#view-attending")});
