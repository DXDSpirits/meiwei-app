$(function() {
    MeiweiApp.Views.OrderList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		template: TPL['order-list-item'],
    		className: 'order-list-item',
    		events: { 'tap': 'viewOrder' },
    		viewOrder: function() {
    			MeiweiApp.goTo('OrderDetail', {
    				order: this.model.toJSON()
    			});
    		},
    		render: function() {
    			MeiweiApp.ModelView.prototype.render.call(this);
    			if (this.model) {
    				MeiweiApp.loadBgImage(this.$('.thumbnail'), this.model.get('restaurantinfor').frontpic, {
    					width: 89, height: 89
    				});
    			}
    			return this;
    		}
    	})
    });
    
    MeiweiApp.Pages.OrderList = new (MeiweiApp.PageView.extend({
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick .filter-pending': 'getPendingOrders',
    		'fastclick .filter-fulfilled': 'getFulfilledOrders'
    	},
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	initPage: function() {
    		this.orders = new MeiweiApp.Collections.Orders();
    		this.views = {
    			orderList: new MeiweiApp.Views.OrderList({
    				collection: this.orders,
    				el: this.$('.order-list')
    			})
    		};
    		this.initPageNav(this, this.orders);
    	},
    	getPendingOrders: function() {
    		this.$('.filter-fulfilled').removeClass('selected');
    		this.$('.filter-pending').addClass('selected');
    		this.orders.fetch({ reset: true, data: { status: 'pending' } });
    	},
    	getFulfilledOrders: function() {
    		this.$('.filter-fulfilled').addClass('selected');
    		this.$('.filter-pending').removeClass('selected');
    		this.orders.fetch({ reset: true, data: { status: 'fulfilled' } });
    	},
    	render: function() {
    		this.getPendingOrders();
    	}
    }))({el: $("#view-order-list")});
});
