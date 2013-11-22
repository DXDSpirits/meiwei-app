MeiweiApp.isCordova = function() {
    return device.cordova;
};

MeiweiApp.showConfirmDialog = function(title, content, onConfirm) {
	if (navigator.notification && _.isFunction(navigator.notification.confirm)) {
		var callback = function(button) { if (button == 2 && onConfirm) onConfirm(); };
		navigator.notification.confirm(content, callback, title, [MeiweiApp._('Cancel'), MeiweiApp._('Confirm')]);
	} else {
		if (confirm(title) == true) onConfirm();
	}
};

MeiweiApp.sendWeixinMsg = function(content) {
    var command = [content];
    var success = function() {}, fail = function() {};
    if (window.Cordova) {
        Cordova.exec(success, fail, "Weixin", "sendTextContent", command);
    }
};

MeiweiApp.shareToMoments = function(url, content, pic) {
    var command = [url, content, content, pic];
    var success = function() {};
    var fail = function() {};
    if (window.Cordova) {
        Cordova.exec(success, fail, "Weixin", "sendAppContent", command);
    }
};

MeiweiApp.preloadImage = function(el, src_preload, src) {
    el.attr('src', src_preload);
    var image = new Image();
    image.onload = function() {
        el.replaceWith(image);
    };
    image.src = src;
};

MeiweiApp.loadBgImage = function(el, src_local, src) {
	el.css('background-image', 'url(' + src_local + ')');
	var ratio = 2;
    var image_src = src + '?imageView/2/w/' + parseInt($('body').innerWidth() * ratio);
    var image = new Image();
    image.onload = function() {
        el.css('background-image', 'url(' + image_src + ')');
    };
    image.src = image_src;
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
