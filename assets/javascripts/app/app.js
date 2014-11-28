(function() {
    
    var MeiweiApp = window.MeiweiApp = new (Backbone.View.extend({
    
        Version: 3.1,
    
        Models: {},
        Views: {},
        Collections: {},
    
        Templates: {},
        Pages: {},
    
        configs: {
            APIHost: "http://api.clubmeiwei.com",
            CDNURL: "assets/",
            ajaxTimeout: 120000
        },
    
        start: function () {
            MeiweiApp.initDevice();
            MeiweiApp.initVersion();
            MeiweiApp.showSplash();
            MeiweiApp.fillImages();
            MeiweiApp.initAjaxEvents();
            MeiweiApp.initLanguage();
            //MeiweiApp.initGeolocation();
            MeiweiApp.initSync();
            MeiweiApp.initGa();
            Backbone.history.start();
            MeiweiApp.initTime();
            MeiweiApp.fixViewport();
        }
    }))({el: document.body});
    
    _.extend(MeiweiApp, Backbone.Events);
    
    MeiweiApp.EventAggregator = (function() {
        var EA = function() {};
        EA.extend = Backbone.Model.extend;
        _.extend(EA.prototype, Backbone.Events);
        return EA;
    })();
    
    MeiweiApp.showSplash = function () {
        if (navigator.splashscreen) {
            navigator.splashscreen.show();
            setTimeout(function () {
                navigator.splashscreen.hide();
            }, 1000);
        }
    };
    
    MeiweiApp.fillImages = function() {
        $('img[data-src]').each(function() {
            var src = $(this).data('src');
            src && MeiweiApp.loadImage($(this), src);
        });
        $('.img[data-bg-src]').each(function() {
            var src = $(this).data('bg-src');
            src && MeiweiApp.loadBgImage($(this), src);
        });
    };
    
    MeiweiApp.isAndroid = function () {
        return /Android/i.test(navigator.userAgent);
    }
    
    MeiweiApp.initTime = function () {
        if (MeiweiApp.isAndroid()) {
            var option = {
                'date': {
                    preset: 'date',
                    invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] }
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
            }
            var lang = MeiweiApp.getLang() == 'en' ? '' : 'zh';
            var opt = {
                'theme': 'android-ics light',
                'mode': 'scroller', //clickpick mixed
                'lang': lang, //default zh
                'display': 'bottom', //modal inline bubble top
                'animate': ''//none
            }
            $('input[type=time]').scroller('destroy').scroller($.extend(option['time'], opt));
            $('input[type=datetime-local]').scroller('destroy').scroller($.extend(option['datetime'], opt));
            $('input[type=date]').scroller('destroy').scroller($.extend(option['date'], opt));
        }
    };
    
    MeiweiApp.setWeixinShare = function (message) {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                WeixinJSBridge.invoke('sendAppMessage', message);
            });
            WeixinJSBridge.on('menu:share:timeline', function (argv) {
                WeixinJSBridge.invoke('shareTimeline', message);
            });
        }, false);
    };
    
    MeiweiApp.initDevice = function () {
        if (window.device) {
            MeiweiApp.isCordova = true;
        } else if (/MicroMessenger/i.test(navigator.userAgent)) {
            MeiweiApp.isWeixin = true;
            window.device = { platform: 'Weixin' };
            $('title').append(' ' + $('meta[name=description]').attr('content'));
            var redirectUrl = encodeURIComponent('http://mobile.clubmeiwei.com/weixin/weixin.html?showwxpaytitle=1');
            var message = {
                "img_url" : 'http://mobile.clubmeiwei.com/assets/images/default.png',
                "img_width" : "240",
                "img_height" : "150",
                "link" : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0fd053b2f2f80d94&redirect_uri=" + redirectUrl +
                    "&response_type=code&scope=snsapi_base&state=restaurant_search#wechat_redirect",
                "desc" : "百余家高端餐厅预订和贴心的私人管家服务",
                "title" : "美位 - 只为最懂得享受的你"
            };
            MeiweiApp.setWeixinShare(message);
        } else {
            window.device = { platform: 'WebApp' };
        }
        /*
         * Emulate click events on body. Remove 300ms delay.
         */
        new FastClick(document.body);
    };
    
    MeiweiApp.fixViewport = function () {
        var wrapperOffset = 44;
        if (window.device.platform === 'iOS' && parseFloat(window.device.version) >= 7.0) {
            wrapperOffset += 20;
        }
        var fixWrapperHeight = function () {
            $('body>.view>.wrapper').css('height', $(window).height() - wrapperOffset);
        };
        fixWrapperHeight();
        $(window).resize(fixWrapperHeight);
        if (window.device) {
            $('meta[name=viewport]').attr('content', 'width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0');
        } else {
            $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
        }
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            var msViewportStyle = document.createElement("style");
            msViewportStyle.appendChild(
                document.createTextNode(
                    "@-ms-viewport{width:auto!important}"
                )
            );
            document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
        }
    };
    
    MeiweiApp.initVersion = function () {
        var pVersion = parseFloat(localStorage.getItem('version-code')) || 1.0;
        if (MeiweiApp.Version != pVersion) {
            var authToken = localStorage.getItem('auth-token');
            localStorage.clear();
            localStorage.setItem('version-code', MeiweiApp.Version);
            if (authToken) localStorage.setItem('auth-token', authToken);
        }
        if (!MeiweiApp.isCordova) return;
        var app = new MeiweiApp.Models.App();
        app.fetch({
            global: false,
            success: function (model, response, options) {
                var version = parseFloat(model.get('version'));
                var onConfirm = function () {
                    if (device.platform == 'iOS') {
                        var ref = MeiweiApp.openWindow('https://itunes.apple.com/app/id689668571');
                    } else {
                        var ref = MeiweiApp.openWindow('http://web.clubmeiwei.com/ad/apppromo');
                    }
                };
                if (version && version > MeiweiApp.Version) {
                    MeiweiApp.showConfirmDialog(
                        MeiweiApp._('Update Available'),
                        MeiweiApp._('New version is available, go to update?'),
                        onConfirm
                    );
                }
            }
        });
    };
    
    MeiweiApp.initLanguage = function () {
        var langCode = localStorage.getItem('lang-code') || 'zh';
        /*
         * i18n is disabled for the moment
         */
        langCode = 'zh';
        MeiweiApp._ = function (msgId) {
            var msg = MeiweiApp.i18n[msgId];
            return msg ? msg[langCode] : msgId;
        };
        MeiweiApp.initLang = function (context) {
            context = context || document;
            $(context).find('[data-i18n]').each(function () {
                $(this).html(MeiweiApp._($(this).attr('data-i18n')));
            });
            $(context).find('[data-placeholder-i18n]').each(function () {
                $(this).attr('placeholder', MeiweiApp._($(this).attr('data-placeholder-i18n')));
            });
            moment.lang(langCode == 'en' ? 'en' : 'zh-cn');
        };
        MeiweiApp.setLang = function (lang) {
            localStorage.setItem('lang-code', (langCode = lang));
            MeiweiApp.initLang();
        };
        MeiweiApp.getLang = function () {
            return langCode;
        };
        MeiweiApp.initLang();
    };
    
    MeiweiApp.initGeolocation = function (callback) {
        var onSuccess = function (position) {
            MeiweiApp.coords.latitude = position.coords.latitude;
            MeiweiApp.coords.longitude = position.coords.longitude;
            if (callback) callback();
        };
        var onError = function () {
            if (callback) callback();
        };
        MeiweiApp.coords = { longitude: 121.491, latitude: 31.233 };
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };
    
    MeiweiApp.initSync = function () {
        var authToken = localStorage.getItem('auth-token');
        var originalSync = Backbone.sync;
        Backbone.sync = function (method, model, options) {
            options.timeout = options.timeout || MeiweiApp.configs.ajaxTimeout;
            _.extend((options.headers || (options.headers = {})), { 'Accept-Language': MeiweiApp.getLang() });
            if (authToken) {
                _.extend(options.headers, { 'Authorization': 'Token ' + authToken });
            }
            if (options.nocache) {
                _.extend(options.headers, { 'Cache-Control': 'no-cache' });
            }
            if (options.url) {
                options.url = options.url.replace(/^(?:http|https)\:\/{2}[a-zA-Z0-9\-_\.]+(?:\:[0-9]{1,4})?(.*)/,
                    MeiweiApp.configs.APIHost + '$1');
            }
            return originalSync.call(model, method, model, options);
        };
        MeiweiApp.TokenAuth = {
            get: function () {
                return _.clone(authToken);
            },
            set: function (token) {
                authToken = _.clone(token);
                localStorage.setItem('auth-token', authToken);
            },
            clear: function () {
                authToken = null;
                localStorage.removeItem('auth-token');
            }
        };
    };
    
    MeiweiApp.initAjaxEvents = function () {
        var timeout = 1000;
        var xhrPool = [];
        $(document).ajaxStart(function () {
            $('#apploader').removeClass('invisible');
        });
        $(document).ajaxStop(function () {
            setTimeout(function () {
                $('#apploader').addClass('invisible');
                timeout = 1000;
            }, timeout);
        });
        $(document).ajaxError(function (event, jqxhr, settings, exception) {
            var response = jqxhr.responseJSON || {};
            if (jqxhr.status == 401 || jqxhr.status == 403 || jqxhr.status == 499) {
                if (response.detail != 'Authentication credentials were not provided.') {
                    var text = $('#apploader .ajax-error').html();
                    $('#apploader .ajax-error').html(response.detail).removeClass('hidden');
                    setTimeout(function () {
                        $('#apploader .ajax-error').html(text).addClass('hidden');
                    }, (timeout = 2000)/* + 500*/);
                }
                MeiweiApp.TokenAuth.clear();
                MeiweiApp.Pages.MemberLogin.go({ ref: MeiweiApp.history.active });
            } else if (settings.type == 'GET' && jqxhr.statusText != 'abort') {
                $('#apploader .ajax-error').removeClass('hidden');
                setTimeout(function () {
                    $('#apploader .ajax-error').addClass('hidden');
                }, (timeout = 2500)/* + 500*/);
            }
        });
        $.ajaxSetup({
            beforeSend: function (jqXHR) {
                if (xhrPool.length >= 7) {
                    xhrPool[0].abort();
                    xhrPool.splice(0, 1);
                }
                xhrPool.push(jqXHR);
            },
            complete: function (jqXHR) {
                var index = xhrPool.indexOf(jqXHR);
                if (index > -1) xhrPool.splice(index, 1);
            }
        });
        MeiweiApp.abortAllAjax = function () {
            _.each(xhrPool, function (jqXHR) {
                jqXHR.abort();
            });
            xhrPool.length = 0;
            setTimeout(function () {
                $('#apploader').addClass('invisible');
                timeout = 0;
            }, timeout);
        };
    };
    
    MeiweiApp.initGa = function () {
        var clientId = MeiweiApp.TokenAuth.get() ? MeiweiApp.TokenAuth.get() : window.device.uuid;
        if (clientId) {
            ga('create', 'UA-40624648-3', { 'storage': 'none', 'clientId': clientId });
        } else {
            ga('create', 'UA-40624648-3', { 'cookieDomain': 'none' });
        }
    };
    
    MeiweiApp.handleError = function (err) {
        try {
            var error = new MeiweiApp.Models.ClientError();
            error.save({message: err.message, detail: err.stack}, {global: false});
            console.error(err.message);
        } catch (e) {
        }
    };
    
    window.onerror = function (message, file, line, column, errorObj) {
        if (MeiweiApp.configs.Debug) return;
        try {
            MeiweiApp.abortAllAjax();
            var detail = errorObj && errorObj.stack ? errorObj.stack : [file, line, column].join(':');
            var error = new MeiweiApp.Models.ClientError();
            error.save({message: message, detail: detail}, {global: false});
            console.error(message, detail);
        } catch (e) {
        }
    };

})();
