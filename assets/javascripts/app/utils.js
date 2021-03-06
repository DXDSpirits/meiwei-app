(function() {
    
    MeiweiApp.showAlertDialog = function(content) {
        var dialog = new (MeiweiApp.View.extend({
            className: 'dialog confirm-dialog',
            template: TPL['alert-dialog'],
            events: {
                'click .btn-confirm': 'confirm'
            },
            closeDialog: function() {
                this.remove();
                $('#dialog-overlay').addClass('hidden');
                this.undelegateEvents();
            },
            openDialog: function() {
                $('body').append(this.el);
                $('#dialog-overlay').removeClass('hidden');
                this.delegateEvents();
            },
            confirm: function() {
                this.closeDialog();
            },
            render: function() {
                this.renderTemplate({content: content});
                this.openDialog();
                return this;
            }
        }))();
        dialog.remove();
        dialog.render();
    };
    
    MeiweiApp.showCallDialog = function(phone,title, content, onConfirm) {
        var dialog = new (MeiweiApp.View.extend({
            className: 'dialog confirm-dialog',
            template: TPL['call-dialog'],
            events: {
                'click .btn-cancel': 'closeDialog',
                'click .btn-confirm': 'confirm'
            },
            closeDialog: function() {
                this.remove();
                $('#dialog-overlay').addClass('hidden');
                this.undelegateEvents();
            },
            openDialog: function() {
                $('body').append(this.el);
                $('#dialog-overlay').removeClass('hidden');
                this.delegateEvents();
            },
            confirm: function() {
                this.closeDialog();
                onConfirm();
            },
            render: function() {
                this.renderTemplate({phone:phone,title: title, content: content});
                this.openDialog();
                return this;
            }
        }))();
        dialog.remove();
        dialog.render();
    };
    
    MeiweiApp.showConfirmDialog = function(title, content, onConfirm) {
        var dialog = new (MeiweiApp.View.extend({
            className: 'dialog confirm-dialog',
            template: TPL['confirm-dialog'],
            events: {
                'click .btn-cancel': 'closeDialog',
                'click .btn-confirm': 'confirm'
            },
            closeDialog: function() {
                this.remove();
                $('#dialog-overlay').addClass('hidden');
                this.undelegateEvents();
            },
            openDialog: function() {
                $('body').append(this.el);
                $('#dialog-overlay').removeClass('hidden');
                this.delegateEvents();
            },
            confirm: function() {
                this.closeDialog();
                onConfirm();
            },
            render: function() {
                this.renderTemplate({title: title, content: content});
                this.openDialog();
                return this;
            }
        }))();
        dialog.remove();
        dialog.render();
    };
    
    MeiweiApp.showNativeConfirmDialog = function(title, content, onConfirm) {
        if (navigator.notification && _.isFunction(navigator.notification.confirm)) {
            var callback = function(button) { if (button == 2 && onConfirm) onConfirm(); };
            navigator.notification.confirm(content, callback, title, [MeiweiApp._('Cancel'), MeiweiApp._('Confirm')]);
        } else {
            if (confirm(content) == true) onConfirm();
        }
    };
    
    MeiweiApp.showWechatShareTip = function() {
        var $tip = $('#wechat-share-tip');
        $tip.removeClass('hidden');
        var hideTip = _.once(function() {
            $tip.addClass('hidden');
        });
        $tip.one('click', hideTip);
        _.delay(hideTip, 3000);
    };
    
    MeiweiApp.sendWeixinMsg = function(content) {
        var command = [content];
        var success = function() {}, fail = function() {};
        if (MeiweiApp.isCordova && window.Cordova) {
            Cordova.exec(success, fail, "Weixin", "sendTextContent", command);
        } else {
            MeiweiApp.showWechatShareTip();
        }
    };
    
    MeiweiApp.sendWeixinLink = function(url, content, pic) {
        var command = [url, content, content, pic];
        var success = function() {}, fail = function() {};
        if (MeiweiApp.isCordova && window.Cordova) {
            Cordova.exec(success, fail, "Weixin", "sendLinkContent", command);
        }
    };
    
    MeiweiApp.shareToMoments = function(url, content, pic) {
        var command = [url, content, content, pic];
        var success = function() {}, fail = function() {};
        if (MeiweiApp.isCordova && window.Cordova) {
            Cordova.exec(success, fail, "Weixin", "sendAppContent", command);
        }
    };
    
    MeiweiApp.payByAlipay = function(orderString) {
        var command = [orderString];
        var success = function() {}, fail = function() {};
        if (MeiweiApp.isCordova && window.Cordova) {
            Cordova.exec(success, fail, "Alipay", "payOrder", command);
        } else {
            MeiweiApp.showConfirmDialog(
                MeiweiApp._('Payment'),
                MeiweiApp._('We are working hard on the Ali Payment.'),
                function() {
                    MeiweiApp.openWindow('http://www.clubmeiwei.com/ad/apppromo');
                }
            );
        }
    };
    
    MeiweiApp.openWindow = function(link) {
        window.open(link, '_blank', 'location=no');
    };
    
    MeiweiApp.imageFullpath = function(src, options) {
        image_src = /^http:\/\//.test(src) ? src : MeiweiApp.configs.CDNURL + src;
        var ratio = window.devicePixelRatio || 2;
        var width = options.width || parseInt($('body').innerWidth());
        var height = options.height;
        var size = height ? width * ratio + 'x' + height * ratio : width * ratio;
        image_src += '?imageMogr/v2/thumbnail/' + size;
        return image_src;
    };
    
    MeiweiApp.loadImage = function(img, src, options) {
        if (!src) return;
        options = options || {};
        var image = new Image(), image_src = MeiweiApp.imageFullpath(src, options);
        image.onload = function() {
            img.attr('src', image_src);
        };
        image.src = image_src;
    };
    
    MeiweiApp.loadBgImage = function(el, src, options) {
        if (!src) return;
        options = options || {};
        el.css('background-image', 'url(' + MeiweiApp.configs.CDNURL + 'images/loading.gif' + ')');
        var image = new Image(), image_src = MeiweiApp.imageFullpath(src, options);
        image.onload = function() {
            el.removeClass('img-loading');
            el.css('background-image', 'url(' + image_src + ')');
        };
        el.addClass('img-loading');
        image.src = image_src;
    };
    
    MeiweiApp.calculateDistance = function(lat, lon) {
        var lat1=lat*Math.PI/18000000, lon1 = lon*Math.PI/18000000;
        var lat2=MeiweiApp.coords.latitude*Math.PI/180, lon2=MeiweiApp.coords.longitude*Math.PI/180;
        var R = 6371;
        var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
        var y = (lat2-lat1);
        var d = Math.sqrt(x*x + y*y) * R;
        if (d > 1) {
            return (parseInt(d * 10) / 10) + 'km';
        } else {
            return parseInt(d * 1000) + 'm';
        }
    };
    
    MeiweiApp.sendGaPageView = function(page) {
        ga('send', 'pageview', page);
    };
    
    MeiweiApp.sendGaEvent = function(category, action, label, value) {
        ga('send', 'event', category, action, label, value);
    };
    
    MeiweiApp.sendGaSocial = function(network, action, target) {
        ga('send', 'social', network, action, target);
    };

})();
