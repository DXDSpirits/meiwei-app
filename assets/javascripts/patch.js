(function() {
    window.PATCH = true;
    
    $('#view-package-order-confirm input[name=address]').attr('type', 'text');
    $('#view-package-order-confirm .header-navbar h1').attr('data-i18n', '敢爱礼盒').text('敢爱礼盒');
    $('#view-package-order .header-navbar h1').attr('data-i18n', '敢爱礼盒').text('敢爱礼盒');
    
    (function() {
        MeiweiApp.initTime = function () {
            if (MeiweiApp.isAndroid()) {
                var option = {
                    'date': {
                        preset: 'date'
                    },
                    'datetime': {
                        preset: 'datetime',
                        minDate: new Date(2012, 3, 10, 9, 22),
                        maxDate: new Date(2014, 7, 30, 15, 44),
                        stepMinute: 5
                    },
                    'time': {
                        preset: 'time'
                    }
                };
                var lang = MeiweiApp.getLang() == 'en' ? '' : 'zh';
                var opt = {
                    'theme': 'android-ics light',
                    'mode': 'scroller', //clickpick mixed
                    'lang': lang, //default zh
                    'display': 'bottom', //modal inline bubble top
                    'animate': ''//none
                };
                $('input[type=time]').scroller('destroy').scroller($.extend(option['time'], opt));
                $('input[type=datetime-local]').scroller('destroy').scroller($.extend(option['datetime'], opt));
                $('input[type=date]').scroller('destroy').scroller($.extend(option['date'], opt));
            }
        };
    })();
    
    (function() {
        var page = MeiweiApp.Pages.PackageOrder;
        var html = 
        '<div class="pull-left img" data-bg-src="http://mobile.clubmeiwei.com/assets/images/package/1-3.jpg"></div>' +
        '<div class="pull-right text">' +
            '<p>尺寸：22cm*22cm*16cm</p>' +
            '<p>选材：黄玫瑰，洋牡丹，桂皮，西瓜果，松果，尤加利叶，常春藤，薏米果</p>' +
            '<p class="large">价值 1899</p>' +
            '<p class="small">派送时间：2014年12月24日</p>' +
        '</div>';
        $(page.$('.product-christmas .panel')[2]).html(html);
        $(page.$('.product-christmas .option-tabs .btn')[2]).text('暖冬圣诞');
    })();
    
    (function() {
        var page = MeiweiApp.Pages.PackageOrderDetail;
        page.onClickLeftBtn = function () {
            MeiweiApp.goTo('Home');
        };
        page.payOrder = function () {
            var payment_no = page.order.get('payment').payment_no;
            if (MeiweiApp.isCordova && device.platform === 'iOS') {
                var alipayPayment = new AlipayPayment({ payment_no: payment_no });
                alipayPayment.fetch({success: function (model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            } else {
                var payable_url = MeiweiApp.configs.APIHost + '/alipay/payablewap/' + payment_no;
                location.href = payable_url;
            }
        };
        page.render = function () {
            page.order.clear({ silent: true });
            if (page.options.order) {
                page.order.set(page.options.order);
            } else {
                page.order.fetch();
            }
        };
        page.checkPayment = function() {
            if (page.order.get('payment').is_payable) {
                page.$('.header-btn-right').text('修改');
            } else {
                page.$('.header-btn-right').text('终止');
            }
        };
        page.cancelOrder = function () {
            if (page.order.get('payment').is_payable) {
                page.order.cancel({success: function () {
                    MeiweiApp.goTo('PackageOrder');
                }});
            } else {
                MeiweiApp.showConfirmDialog(
                    "终止订单",
                    "注意：终止订单后将停止派送余下礼物",
                    function () {
                        page.order.cancel({success: function () {
                            MeiweiApp.goTo('Home');
                        }});
                    }
                );
            }
        };
        page.undelegateEvents();
        page.stopListening(page.order);
        page.delegateEvents();
        page.listenTo(page.order, 'change', page.checkPayment);
    })();
    
    (function() {
        var page = MeiweiApp.Pages.PackageOrderConfirm;
        page.submitOrder = function() {
            var name = page.$('.receiver input[name=name]').val() || null;
            var gender = page.$('.receiver input[name=gender]').val() || null;
            var mobile = page.$('.receiver input[name=mobile]').val() || null;
            var address = page.$('.receiver input[name=address]').val() || null;
            var sender_name = page.$('.sender input[name=name]').val() || null;
            var sender_gender = page.$('.sender input[name=gender]').val() || null;
            var sender_mobile = page.$('.sender input[name=mobile]').val() || null;
            var sender_address = page.$('.sender input[name=address]').val() || null;
            var comment = page.$('input[name=wish]').val() || null;
            page.order.set({
                name: name,
                gender: gender,
                mobile: mobile,
                address: address,
                sender_name: sender_name,
                sender_gender: sender_gender,
                sender_mobile: sender_mobile,
                sender_address: sender_address,
                comment: comment
            });
            page.$('.info-text').html('');
            if (!name || !mobile || !address || !sender_name || !sender_mobile || !sender_address) {
                MeiweiApp.showAlertDialog('请完善收件人和寄件人信息');
            } else {
                page.order.save({}, {
                    success: function(model, xhr, options) {
                        MeiweiApp.goTo('PackageOrderDetail');
                    }
                });
            }
        };
        page.undelegateEvents();
        page.delegateEvents();
    })();
    
    (function() {
        var page = MeiweiApp.Pages.GenericOrderDetail;
        page.payOrder = function () {
            var payment_no = page.order.get('payment').payment_no;
            if (MeiweiApp.isCordova && device.platform === 'iOS') {
                var alipayPayment = new AlipayPayment({ payment_no: payment_no });
                alipayPayment.fetch({success: function (model) {
                    MeiweiApp.payByAlipay(model.get('orderString'));
                }});
            } else {
                var payable_url = MeiweiApp.configs.APIHost + '/alipay/payablewap/' + payment_no;
                location.href = payable_url;
            }
        };
        page.undelegateEvents();
        page.delegateEvents();
    })();
    
    (function() {
        var src = 'http://mobile.clubmeiwei.com/assets/images/package-order-banner-jeux.jpg';
        $('#view-package-order-detail .banner').attr('data-bg-src', src);
        MeiweiApp.loadBgImage($('#view-package-order-detail .banner'), src);
        $('#view-package-order .banner').attr('data-bg-src', src);
        MeiweiApp.loadBgImage($('#view-package-order .banner'), src);
    })();
    
})();
