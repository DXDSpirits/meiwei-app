$(function() {
    var OrderListView = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		template: TPL['generic-order-list-item'],
    		className: 'order-list-item',
    		events: { 'fastclick': 'viewOrder' },
    		viewOrder: function() {
    			MeiweiApp.goTo('GenericOrderDetail', {
    				order: this.model.toJSON()
    			});
    		},
    		render: function() {
    			MeiweiApp.ModelView.prototype.render.call(this);
    			if (this.model) {
    			    var detail = this.model.get('detail')
    			    if (detail) {
    			        MeiweiApp.loadBgImage(this.$('.thumbnail'), detail.picture, {
                            width: 89, height: 89
                        });
    			    }
    			}
    			return this;
    		}
    	})
    });
    
    MeiweiApp.Pages.GenericOrderList = new (MeiweiApp.PageView.extend({
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .filter-pending': 'getPendingOrders',
    		'fastclick .filter-fulfilled': 'getFulfilledOrders'
    	},
    	onClickLeftBtn: function() { MeiweiApp.goTo('MemberCenter'); },
    	initPage: function() {
    		this.orders = new MeiweiApp.Collections.GenericOrders();
    		this.views = {
    			orderList: new OrderListView({
    				collection: this.orders,
    				el: this.$('.order-list')
    			})
    		};
    		this.initPageNav(this, this.orders);
    	},
    	getPendingOrders: function() {
    		this.$('.filter-fulfilled').removeClass('selected');
    		this.$('.filter-pending').addClass('selected');
    		this.orders.fetch({
    		    reset: true,
    		    data: { status: 'pending' }
    		});
    	},
    	getFulfilledOrders: function() {
    		this.$('.filter-fulfilled').addClass('selected');
    		this.$('.filter-pending').removeClass('selected');
    		this.orders.fetch({
    		    reset: true,
    		    data: { status: 'fulfilled' }
    		});
    	},
    	render: function() {
    		this.getPendingOrders();
    	}
    }))({el: $("#view-generic-order-list")});
});
