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
        template: TPL['package-order-detail'],
        serializeData: function() {
            var NAMES = ['圣诞节', '情人节', '生　日', '纪念日'];
            var orders_packed = [];
            _.each(this.model.get('orders_packed'), function(order, index) {
                if (index >= 4) return;
                orders_packed.push({
                    order_no: order.order_no,
                    datetime: NAMES[index] + ' ' + order.attributes.datetime,
                    complete: order.attributes.trackno != null
                });
            });
            return { orders_packed: orders_packed };
        }
    });
    
    var ContactDetail = MeiweiApp.ModelView.extend({
        template: TPL['package-order-contact-detail']
    });

    MeiweiApp.Pages.PackageOrderDetail = new (MeiweiApp.PageView.extend({
        events: {
            'click .header-btn-left': 'onClickLeftBtn',
            'click .header-btn-right': 'onClickRightBtn',
            'click .btn-cancel': 'cancelOrder',
            'click .btn-payable': 'payOrder'
        },
        initPage: function () {
            this.order = new MeiweiApp.Models.PackageOrder();
            this.views = {
                orderDetail: new OrderDetail({ model: this.order, el: this.$('.order-detail') }),
                contactDetail: new ContactDetail({ model: this.order, el: this.$('.contact-detail') })
            };
            this.listenTo(this.order, 'change', this.checkPayment);
        },
        onClickLeftBtn: function () {
            MeiweiApp.goTo('Home');
        },
        payOrder: function () {
            var payment_no = this.order.get('payment').payment_no;
            if (MeiweiApp.isCordova && device.platform === 'iOS') {
                var alipayPayment = new AlipayPayment({ payment_no: payment_no });
                alipayPayment.fetch({success: function (model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            } else {
                var payable_url = MeiweiApp.configs.APIHost + '/alipay/payablewap/' + payment_no;
                //location.href = payable_url;
                MeiweiApp.openWindow(payable_url);
            }
        },
        cancelOrder: function () {
            if (this.order.get('payment').is_payable) {
                this.order.cancel({success: function () {
                    MeiweiApp.goTo('PackageOrder');
                }});
            } else {
                var self = this;
                MeiweiApp.showConfirmDialog(
                    "终止订单",
                    "注意：终止订单后将停止派送余下礼物",
                    function () {
                        self.order.cancel({success: function () {
                            MeiweiApp.goTo('Home');
                        }});
                    }
                );
            }
        },
        onResume: function () {
            this.order.fetch();
        },
        checkPayment: function() {
            if (this.order.get('payment').is_payable) {
                this.$('.header-btn-right').text('修改');
            } else {
                this.$('.header-btn-right').text('终止');
            }
        },
        render: function () {
            this.order.clear({ silent: true });
            if (this.options.order) {
                this.order.set(this.options.order);
            } else {
                this.order.fetch();
            }
        }
    }))({el: $("#view-package-order-detail")});
})();
