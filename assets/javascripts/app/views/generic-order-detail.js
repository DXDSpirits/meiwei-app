(function () {
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
            40: TPL['generic-order-detail-vvip'],
            60: TPL['generic-order-detail-vipcard']
        },
        events: {
            'click .btn-cancel': 'cancelOrder',
            'click .btn-payable': 'payOrder'
        },
        callWxPay: function(payment_no) {
            var wxPayment = new WxPayment({ payment_no: payment_no });
            var self = this;
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
                                self.onResume();
                            }, 2000);
                        }
                    });
                }
            }});
        },
        payOrder: function () {
            var payment_no = this.model.get('payment').payment_no;
            if (MeiweiApp.isWeixin && false) {
                this.callWxPay(payment_no);
            } else if (MeiweiApp.isCordova) {
                var alipayPayment = new AlipayPayment({ payment_no: payment_no });
                alipayPayment.fetch({success: function (model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            } else {
                var payable_url = MeiweiApp.configs.APIHost + '/alipay/payablewap/' + payment_no;
                location.href = payable_url;
            }
        },
        render: function () {
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
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .generic-order-cancel': 'cancelOrder'
        },
        initPage: function () {
            _.bindAll(this, 'renderAll');
            this.order = new MeiweiApp.Models.GenericOrder();
            this.views = {
                orderDetail: new OrderDetail({ model: this.order, el: this.$('.wrapper') })
            };
            this.$('.wrapper').css('background-size', 'auto ' + $(window).width() + 'px');
        },
        onClickLeftBtn: function () {
            MeiweiApp.goTo('GenericOrderList');
        },
        cancelOrder: function () {
            var order = this.order;
            MeiweiApp.showConfirmDialog(
                MeiweiApp._('Cancel Order'),
                MeiweiApp._('Please confirm the cancellation'),
                function () {
                    order.cancel({success: function () {
                        MeiweiApp.goTo('GenericOrderList');
                    }});
                    if (order.get('order_type') == 30) {
                        MeiweiApp.showCallDialog(
                            '4-001-002-003',
                            MeiweiApp._('Call Us'),
                            MeiweiApp._('Calling Anshifu and cancel order'),
                            function () {}
                        );
                    }
                }
            );
        },
        onResume: function () {
            this.order.fetch();
        },
        reset: function () {
            this.$('.wrapper').css('background-image', 'none');
        },
        renderAll: function () {
            var detail = this.order.get('detail');
            if (detail && detail.picture) {
                MeiweiApp.loadBgImage(this.$('.wrapper'), detail.picture, { height: 320 });
            } else {
                MeiweiApp.loadBgImage(this.$('.wrapper'), 'assets/images/default-order-avatar.png', { height: 320 });
            }
        },
        render: function () {
            if (this.options.order) {
                this.order.set(this.options.order);
                this.renderAll();
            } else if (this.options.orderId) {
                this.order.set({id: this.options.orderId});
                this.order.fetch({success: this.renderAll});
            }
        }
    }))({el: $("#view-generic-order-detail")});
})();
