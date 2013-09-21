
MeiweiApp.Views.OrderDetail = MeiweiApp.ModelView.extend({
	template: MeiweiApp.Templates['order-detail'],
	initModelView: function() {
		_.bindAll(this, 'cancelOrder');
		this.bindFastButton(this.$('.btn-cancel'), this.cancelOrder);
	},
	cancelOrder: function() {
		var model = this.model;
		var confirmCancel = function() {
			model.cancel({success: function() { MeiweiApp.goTo('OrderList'); }});
		}
		try {
			var callback = function(button) { if (button == 2) confirmCancel(); }
			navigator.notification.confirm('请确认删除订单。', callback, '删除订单', ['取消', '确认']);
		} catch (e) {
			if (confirm("删除订单?") == true) confirmCancel();
		}
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
		}
	},
	onClickRightBtn: function() {
		MeiweiApp.ProductCart.reset(this.order.get('product_items'));
		MeiweiApp.goTo('RestaurantOrder', {
			restaurantId: this.order.get('restaurant'),
			pendingOrder: this.order
		});
	},
	renderAll: function() {
		if (this.order.get('editable')) {
			this.$('.header-btn-right i').attr('class', 'icon-edit');
		} else {
			this.$('.header-btn-right i').attr('class', 'icon-blank');
			this.$('.btn-cancel').remove();
			this.onClickRightBtn = function() {}
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
