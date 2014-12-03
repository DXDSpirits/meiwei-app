(function() {
    window.PATCH = true;
    
    $('#view-package-order-confirm input[name=address]').attr('type', 'text');
    
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
    
    var page = MeiweiApp.Pages.PackageOrderDetail;
    page.checkPayment = function() {};
    page.stopListening(page.order);
    
    var page = MeiweiApp.Pages.PackageOrderConfirm;
    page.submitOrder = function() {
        var name = this.$('.receiver input[name=name]').val() || null;
        var gender = this.$('.receiver input[name=gender]').val() || null;
        var mobile = this.$('.receiver input[name=mobile]').val() || null;
        var address = this.$('.receiver input[name=address]').val() || null;
        var sender_name = this.$('.sender input[name=name]').val() || null;
        var sender_gender = this.$('.sender input[name=gender]').val() || null;
        var sender_mobile = this.$('.sender input[name=mobile]').val() || null;
        var sender_address = this.$('.sender input[name=address]').val() || null;
        var comment = this.$('input[name=wish]').val() || null;
        this.order.set({
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
        this.$('.info-text').html('');
        if (!name || !mobile || !address || !sender_name || !sender_mobile || !sender_address) {
            MeiweiApp.showAlertDialog('请完善收件人和寄件人信息');
        } else {
            this.order.save({}, {
                success: function(model, xhr, options) {
                    MeiweiApp.goTo('PackageOrderDetail');
                }
            });
        }
    };
    page.undelegateEvents();
    page.delegateEvents();
    
    page = MeiweiApp.Pages.PackageOrderDetail;
    page.onClickLeftBtn = function () {
        MeiweiApp.goTo('Home');
    };
    page.undelegateEvents();
    page.delegateEvents();
    
    var src = 'http://mobile.clubmeiwei.com/assets/images/package-order-banner-jeux.jpg';
    $('#view-package-order-detail .banner').attr('data-bg-src', src);
    MeiweiApp.loadBgImage($('#view-package-order-detail .banner'), src);
    $('#view-package-order .banner').attr('data-bg-src', src);
    MeiweiApp.loadBgImage($('#view-package-order .banner'), src);
    
})();
