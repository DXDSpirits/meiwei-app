$(function() {
    var OrderDetail = MeiweiApp.ModelView.extend({
    	template: TPL['generic-order-detail'],
    	templates: {
            30: TPL['generic-order-detail-driver'],
            40: TPL['generic-order-detail-vvip']
        },
    	events: { 'fastclick .btn-cancel': 'cancelOrder' },
    	cancelOrder: function() {
    		var model = this.model;
    		MeiweiApp.showConfirmDialog(
    		    MeiweiApp._('Cancel Order'),
    		    MeiweiApp._('Please confirm the cancellation'),
    		    function() {
    		        model.cancel({success: function() {
    		            MeiweiApp.goTo('OrderList');
    		        }});
    		    }
    		);
    	},
        render: function() {
            if (this.model) {
                this.template = this.templates[this.model.get('order_type')] || this.template;
                MeiweiApp.ModelView.prototype.render.call(this);
                var detail = this.model.get('detail')
                if (detail && detail.picture) {
                    MeiweiApp.loadBgImage(this.$('.item-picture'), detail.picture, {
                        height: 250
                    });
                }
                if (!this.model.get('editable')) {
                    this.$('.btn-cancel').remove();
                }
            }
            return this;
        }
    });
    
    MeiweiApp.Pages.GenericOrderDetail = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		this.order = new MeiweiApp.Models.GenericOrder();
    		this.views = {
    			orderDetail: new OrderDetail({
    				model: this.order,
    				el: this.$('.wrapper')
    			})
    		};
    	},
    	render: function() {
    		if (this.options.order) {
    			this.order.set(this.options.order);
    		} else if (this.options.orderId) {
    			this.order.set({id: this.options.orderId});
    			this.order.fetch();
    		}
    	}
    }))({el: $("#view-generic-order-detail")});
});
