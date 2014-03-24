$(function() {
    var OrderDetail = MeiweiApp.ModelView.extend({
    	template: TPL['order-detail'],
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
    	}
    });
    
    MeiweiApp.Pages.GenericOrderDetail = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		_.bindAll(this, 'renderAll');
    		this.order = new MeiweiApp.Models.Order();
    		this.views = {
    			orderDetail: new OrderDetail({
    				model: this.order,
    				el: this.$('.wrapper')
    			})
    		};
    	},
    	onClickRightBtn: function() {
    		MeiweiApp.ProductCart.reset(this.order.get('product_items'));
    		MeiweiApp.goTo('RestaurantOrder', {
    			restaurantId: this.order.get('restaurant'),
    			pendingOrder: this.order
    		});
    	},
    	renderAll: function() {
    		var detail = this.order.get('detail');
            MeiweiApp.loadBgImage(this.$('.item-picture'), detail.picture, { height: 250 });
            this.$('.item-name').html(detail.name);
    		if (this.order.get('editable')) {
    			this.$('.header-btn-right i').attr('class', 'icon icon-edit');
    		} else {
    			this.$('.header-btn-right i').attr('class', 'icon icon-blank');
    			this.$('.btn-cancel').remove();
    			this.onClickRightBtn = function() {};
    		}
    	},
    	render: function() {
    		if (this.options.order) {
    			this.order.set(this.options.order);
    			this.renderAll();
    		} else if (this.options.orderId) {
    			this.order.set({id: this.options.orderId});
    			this.order.fetch({ success: this.renderAll });
    		}
    	}
    }))({el: $("#view-generic-order-detail")});
});
