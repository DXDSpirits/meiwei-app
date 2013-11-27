
MeiweiApp = new (Backbone.View.extend({
    
    Version: 1.5,
    
    Models: {},
    Views: {},
    Collections: {},
    
    Templates: {},
    Pages: {},
    
    configs: {
        APIHost: "http://api.clubmeiwei.com",
        StaticHost: "http://api.clubmeiwei.com",
        MediaHost: "http://api.clubmeiwei.com",
        ajaxTimeout: 10000
    },
    
    start: function() {
        MeiweiApp.initDevice();
        MeiweiApp.initVersion();
        MeiweiApp.showSplash();
        MeiweiApp.initAjaxEvents();
        MeiweiApp.initLang();
        MeiweiApp.initGeolocation();
        MeiweiApp.initSync();
        MeiweiApp.initGa();
        Backbone.history.start();
    }
}))({el: document.body});

MeiweiApp.showSplash = function() {
    if (navigator.splashscreen) {
        navigator.splashscreen.show();
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 1000);
    }
};

MeiweiApp.initDevice = function() {
    if (window.device) {
        if (window.device.platform === 'iOS' && parseFloat(window.device.version) === 7.0) {
            $('html').addClass('iOS7');
        }
        $('meta[name=viewport]').attr('content', 'width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0');
    } else if(/MicroMessenger/i.test(navigator.userAgent)) {
        window.device = { platform: 'Weixin' };
        $('title').append(' ' + $('meta[name=description]').attr('content'));
        $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    } else {
        window.device = { platform: 'WebApp' };
        $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    }
};

MeiweiApp.initVersion = function() {
    var pVersion = parseFloat(localStorage.getItem('version-code')) || 1.0;
    if (MeiweiApp.Version != pVersion) {
        var authToken = localStorage.getItem('auth-token');
        localStorage.clear();
        localStorage.setItem('version-code', MeiweiApp.Version);
        if (authToken) localStorage.setItem('auth-token', authToken);
    }
    var app = new MeiweiApp.Models.App();
    app.fetch({success: function(model, response, options) {
        var version = parseFloat(model.get('version'));
        if (MeiweiApp.isCordova() && version && version > MeiweiApp.Version) {
            MeiweiApp.showConfirmDialog(
                MeiweiApp._('Update Available'), MeiweiApp._('New version is available, go to update?'),
                function() {
                    if (device.platform == 'iOS') {
                        var ref = window.open('https://itunes.apple.com/app/id689668571' ,'_blank', 'location=no');
                    } else {
                        var ref = window.open('http://web.clubmeiwei.com/ad/apppromo' ,'_blank', 'location=no');
                    }
                }
            );
        }
    }});
};

MeiweiApp.initLang = function() {
    var langCode = localStorage.getItem('lang-code') || 'zh';
    MeiweiApp._ = function(msgId) {
        var msg = MeiweiApp.i18n[msgId];
        return msg ? msg[langCode] : msgId;
    };
    MeiweiApp.initLang = function(context) {
        context = context || document;
        $(context).find('[data-i18n]').each(function() {
            $(this).html(MeiweiApp._($(this).attr('data-i18n')));
        });
        $(context).find('[data-placeholder-i18n]').each(function() {
            $(this).attr('placeholder', MeiweiApp._($(this).attr('data-placeholder-i18n')));
        });
    };
    MeiweiApp.setLang = function(lang) {
        localStorage.setItem('lang-code', (langCode = lang));
        MeiweiApp.initLang();
    };
    MeiweiApp.getLang = function() { return langCode; };
    MeiweiApp.initLang();
};

MeiweiApp.initGeolocation = function(callback) {
    var onSuccess = function(position) {
        MeiweiApp.coords.latitude = position.coords.latitude;
        MeiweiApp.coords.longitude = position.coords.longitude;
        if (callback) callback();
    };
    var onError = function() {
        if (callback) callback();
    };
    MeiweiApp.coords = { longitude: 121.491, latitude: 31.233 };
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

MeiweiApp.initSync = function() {
    var authToken = localStorage.getItem('auth-token');
    var originalSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        options.timeout = options.timeout || MeiweiApp.configs.ajaxTimeout;
        _.extend((options.headers || (options.headers = {})), { 'Accept-Language': MeiweiApp.getLang() });
        if (authToken) {
            _.extend(options.headers, { 'Authorization': 'Token ' + authToken });
        }
        if (options.nocache) {
            _.extend(options.headers, { 'Cache-Control': 'no-cache' });
        }
        return originalSync.call(model, method, model, options);
    };
    MeiweiApp.TokenAuth = {
        get: function() {
            return _.clone(authToken);
        },
        set: function(token) {
            authToken = _.clone(token);
            localStorage.setItem('auth-token', authToken);
        },
        clear: function() {
            authToken = null;
            localStorage.removeItem('auth-token');
        }
    };
};

MeiweiApp.initAjaxEvents = function() {
    var timeout = 0;
    var xhrPool = [];
    $(document).ajaxStart(function() {
        $('#apploader').removeClass('invisible');
    });
    $(document).ajaxStop(function() {
        setTimeout(function() {
            $('#apploader').addClass('invisible');
            timeout = 0;
        }, timeout);
    });
    $(document).ajaxError(function(event, jqxhr, settings, exception) {
        var response = jqxhr.responseJSON || {};
        if (jqxhr.status == 401 || jqxhr.status == 403 || jqxhr.status == 499) {
            if (response.detail != 'Authentication credentials were not provided.') {
                var text = $('#apploader .ajax-error').html();
                $('#apploader .ajax-error').html(response.detail).removeClass('hidden');
                setTimeout(function() {
                    $('#apploader .ajax-error').html(text).addClass('hidden');
                }, (timeout = 1000)/* + 500*/);
            }
            MeiweiApp.TokenAuth.clear();
            MeiweiApp.Pages.MemberLogin.go({ ref: MeiweiApp.history.active });
        } else if (settings.type == 'GET' && jqxhr.statusText != 'abort') {
            $('#apploader .ajax-error').removeClass('hidden');
            setTimeout(function() {
                $('#apploader .ajax-error').addClass('hidden');
            }, (timeout = 1500)/* + 500*/);
        }
    });
    $.ajaxSetup({
        beforeSend: function(jqXHR) {
            xhrPool.push(jqXHR);
        },
        complete: function(jqXHR) {
            var index = xhrPool.indexOf(jqXHR);
            if (index > -1) xhrPool.splice(index, 1);
        }
    });
    MeiweiApp.abortAllAjax = function() {
        _.each(xhrPool, function(jqXHR) { jqXHR.abort(); });
        xhrPool = [];
    };
};

MeiweiApp.initGa = function() {
    var clientId = MeiweiApp.TokenAuth.get() ? MeiweiApp.TokenAuth.get() : window.device.uuid;
    if (clientId) {
        ga('create', 'UA-40624648-3', { 'storage': 'none', 'clientId': clientId });
    } else {
        ga('create', 'UA-40624648-3', { 'cookieDomain': 'none' });
    }
};

MeiweiApp.handleError = function(err) {
    try {
        var error = new MeiweiApp.Models.ClientError();
        error.save({message: err.message, detail: err.stack}, {global: false});
        console.error(err.message);
    } catch (e) {}
};

window.onerror = function(message, filaName, lineNumber) {
    try {
        MeiweiApp.abortAllAjax();
        var detail = [filaName, lineNumber].join(':');
        var error = new MeiweiApp.Models.ClientError();
        error.save({message: message, detail: detail}, {global: false});
        console.error(message, detail);
    } catch (e) {}
};
