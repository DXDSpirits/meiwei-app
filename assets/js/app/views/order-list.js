
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
		//var fulfills = this.$('.filter-fulfilled');	    
		//var pendings = this.$('.filter-pending');	    
		this.views = {
			orderList: new MeiweiApp.Views.OrderList({
				collection: this.orders,
				el: this.$('.scroll .scroll-inner')
			})
		}
	},
	
	getPendingOrders: function() {
		var fulfills = this.$('.filter-fulfilled');	    
		var pendings = this.$('.filter-pending');	
		if(!pendings.hasClass('selected')){ 
	    fulfills.removeClass('selected');
	    pendings.addClass('selected');
	    this.orders.fetch({
			reset: true,
			data: { status: 'pending' }
		});
	    }
		
	},
	getFulfilledOrders: function() {
	    var fulfills = this.$('.filter-fulfilled');	    
		var pendings = this.$('.filter-pending');	
		if(!fulfills.hasClass('selected')){ 
	    fulfills.addClass('selected');
	    pendings.removeClass('selected');
	    	this.orders.fetch({
			reset: true,
			data: { status: 'fulfilled' }
		});
	    }
	
	},
	
	render: function() {
		this.orders.fetch({ reset: true, data: { status: 'pending' }, success: this.showPage });
	}
}))({el: $("#view-order-list")});
