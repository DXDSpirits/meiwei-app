$(function() {
    MeiweiApp.Views.OrderDetail = MeiweiApp.ModelView.extend({
    	template: TPL['order-detail'],
    	events: { 'tap .btn-cancel': 'cancelOrder' },
    	cancelOrder: function() {
    		var model = this.model;
    		MeiweiApp.showConfirmDialog(
    		    MeiweiApp._('Cancel Order'),
    		    MeiweiApp._('Please confirm the cancellation'),
    		    function() {
    		        model.cancel({success: function() {
    		            MeiweiApp.goTo('OrderList', {nocache: true});
    		        }});
    		    }
    		);
    	}
    });
    
    MeiweiApp.Pages.OrderDetail = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		_.bindAll(this, 'renderAll');
    		this.order = new MeiweiApp.Models.Order();
    		this.views = {
    			orderDetail: new MeiweiApp.Views.OrderDetail({
    				model: this.order,
    				el: this.$('.scroll .scroll-inner')
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
    		var resto = this.order.get('restaurantinfor');
    		var localImage = 'assets/img/bootstrap/restaurant/' + resto.id + '.jpg';
            MeiweiApp.loadBgImage(this.$('.restaurant-picture'), resto.frontpic, { height: 250 });
            MeiweiApp.loadBgImage(this.$('.scroll'), resto.frontpic, { height: 250 });
            this.$('.restaurant-name').html(resto.fullname);
    		if (this.order.get('editable')) {
    			this.$('.header-btn-right i').attr('class', 'icon icon-edit');
    		} else {
    			this.$('.header-btn-right i').attr('class', 'icon icon-blank');
    			this.$('.btn-cancel').remove();
    			this.onClickRightBtn = function() {};
    		}
    		this.initScroller();
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
    }))({el: $("#view-order-detail")});
});
