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
    	default_template: TPL['generic-order-detail'],
    	templates: {
            30: TPL['generic-order-detail-driver'],
            40: TPL['generic-order-detail-vvip']
        },
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
    	payOrder: function() {
            if(window.WeixinJSBridge) {
                var wxPayment = new WxPayment({
                    payment_no: this.model.get('payment').payment_no
                });
                wxPayment.fetch({success: function(model) {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                        "appId": model.get('appid'),
                        "timeStamp": model.get('timestamp'),
                        "nonceStr": model.get('noncestr'),
                        "package": model.get('package'),
                        "signType": model.get('signtype'),
                        "paySign": model.get('paysign')
                    }, function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            window.setTimeout(function(){
                                MeiweiApp.Pages.GenericOrderDetail.onResume();
                            },2000);
                        } else {
                            alert(res.err_msg);
                        }
                    });
                }});
            } else {
                var alipayPayment = new AlipayPayment({
                    payment_no: this.model.get('payment').payment_no
                });
                alipayPayment.fetch({success: function(model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            }
    	},
        render: function() {
            if (this.model) {
                this.template = this.templates[this.model.get('order_type')] || this.default_template;
                MeiweiApp.ModelView.prototype.render.call(this);
                if (!this.model.get('editable')) {
                    this.$('.btn-cancel').remove();
                }
            }
            return this;
        }
    });
    
    MeiweiApp.Pages.GenericOrderDetail = new (MeiweiApp.PageView.extend({
    	initPage: function() {
    	    _.bindAll(this, 'renderAll');
    		this.order = new MeiweiApp.Models.GenericOrder();
    		this.views = {
    			orderDetail: new OrderDetail({ model: this.order, el: this.$('.wrapper') })
    		};
    	},
    	onClickLeftBtn: function() {
    	    MeiweiApp.goTo('GenericOrderList');
    	},
    	onResume: function() {
    	    this.order.fetch();
    	},
        reset: function() {
            this.$('.wrapper').css('background-image', 'none');
        },
        renderAll: function() {
            var detail = this.order.get('detail');
            if (detail && detail.picture) {
                MeiweiApp.loadBgImage(this.$('.wrapper'), detail.picture, { height: 250 });
            } else {
                MeiweiApp.loadBgImage(this.$('.wrapper'), 'assets/img/default-order-avatar.png', { height: 250 });
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
    }))({el: $("#view-generic-order-detail")});
});
