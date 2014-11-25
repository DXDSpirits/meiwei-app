(function() {
    
    var OrderDetail = MeiweiApp.ModelView.extend({
    	template: TPL['order-detail'],
    	events: {
            'click .btn-cancel': 'cancelOrder'
        },
        render:function(){
            MeiweiApp.ModelView.prototype.render.call(this);
            if (this.model.get('clubseattype') == 0 && this.model.get('restaurantinfor').restaurant_type==20) {
                $('#seatType').text('卡座');
            }
        },
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
    
    MeiweiApp.Pages.OrderDetail = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    		_.bindAll(this, 'renderAll');
    		this.order = new MeiweiApp.Models.Order();
    		this.views = {
    			orderDetail: new OrderDetail({
    				model: this.order,
    				el: this.$('.wrapper')
    			})
    		};
    		this.$('.wrapper').css('background-size', 'auto ' + $(window).width() + 'px');
    	},
    	onClickRightBtn: function() {
    		MeiweiApp.ProductCart.reset(this.order.get('product_items'));
    		MeiweiApp.goTo('RestaurantOrder', {
    			restaurantId: this.order.get('restaurant'),
    			pendingOrder: this.order
    		});
    	},
        reset: function() {
            this.$('.wrapper').css('background-image', 'none');
        },
        onResume: function () {
            this.order.fetch({success: this.renderAll});
        },
    	renderAll: function() {
    		var resto = this.order.get('restaurantinfor');
    		var localImage = 'assets/images/bootstrap/restaurant/' + resto.id + '.jpg';
            MeiweiApp.loadBgImage(this.$('.wrapper'), resto.frontpic, { height: 320 });
            this.$('.item-name').html(resto.fullname);
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
    			this.order.fetch({success: this.renderAll});
    		}
    	}
    }))({el: $("#view-order-detail")});
    
})();
