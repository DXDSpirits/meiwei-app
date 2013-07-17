

MeiweiApp.Pages.Attending = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.orders = new MeiweiApp.Collections.Orders();
	},
    render: function() {
        $.when(
        	//this.orders.fetch({reset: true})
        ).then(this.showPage);
    }
}))({el: $("#view-attending")});
