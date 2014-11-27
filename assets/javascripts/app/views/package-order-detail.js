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
        },
        payOrder: function () {
            var payment_no = this.order.get('payment').payment_no;
            if (MeiweiApp.isCordova) {
                var alipayPayment = new AlipayPayment({ payment_no: payment_no });
                alipayPayment.fetch({success: function (model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            } else {
                var payable_url = MeiweiApp.configs.APIHost + '/alipay/payablewap/' + payment_no;
                location.href = payable_url;
            }
        },
        cancelOrder: function () {
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
        },
        onResume: function () {
            this.order.fetch();
        },
        render: function () {
            this.order.fetch();
        }
    }))({el: $("#view-package-order-detail")});
})();
