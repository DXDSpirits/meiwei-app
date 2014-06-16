$(function() {
    var AlipayPayment = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/alipay/payable/',
        idAttribute: 'payment_no'
    });

    var WxPayment = MeiweiApp.Model.extend({
        urlRoot: MeiweiApp.configs.APIHost + '/wxpay/payable/',
        idAttribute: 'payment_no'
    });

    var OrderDetail = MeiweiApp.ModelView.extend({
    	template: TPL['order-detail'],
    	events: {
            'click .btn-cancel': 'cancelOrder',
            'click .btn-payable': 'payOrder'
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
    	},
        payOrder: function () {
            if (MeiweiApp.isWeixin) {
                var wxPayment = new WxPayment({
                    payment_no: this.model.get('payment_order').payment_no
                });
                wxPayment.fetch({success: function (model) {
                    if (window.WeixinJSBridge) {
                        WeixinJSBridge.invoke('getBrandWCPayRequest', {
                            "appId": model.get('appid'),
                            "timeStamp": model.get('timestamp'),
                            "nonceStr": model.get('noncestr'),
                            "package": model.get('package'),
                            "signType": model.get('signtype'),
                            "paySign": model.get('paysign')
                        }, function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                window.setTimeout(function () {
                                    MeiweiApp.Pages.OrderDetail.onResume();
                                }, 2000);
                            } else {
//                                alert(res.err_msg);
                            }
                        });
                    } else {

                    }
                }});
            } else {
                var alipayPayment = new AlipayPayment({
                    payment_no: this.model.get('payment_order').payment_no
                });
                alipayPayment.fetch({success: function (model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            }
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
    		var localImage = 'assets/img/bootstrap/restaurant/' + resto.id + '.jpg';
            MeiweiApp.loadBgImage(this.$('.wrapper'), resto.frontpic, { height: 250 });
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
});
