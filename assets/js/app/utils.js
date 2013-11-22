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

MeiweiApp.loadImage = function(img, src, options) {
    options = options || {};
    if (MeiweiApp.isCordova() && options.src_local) img.attr('src', options.src_local);
    var ratio = window.devicePixelRatio ? window.devicePixelRatio: 2;
    var width = options.width || parseInt($('body').innerWidth());
	var height = options.height;
	var size = height ? width * ratio + 'x' + height * ratio + '!' : width * ratio;
	var image_src = src + '?imageMogr/v2/thumbnail/' + size;
    var image = new Image();
    image.onload = function() {
        img.replaceWith(image);
    };
    image.src = image_src;
};

MeiweiApp.loadBgImage = function(el, src, options) {
	options = options || {};
	if (MeiweiApp.isCordova() && options.src_local) el.css('background-image', 'url(' + options.src_local + ')');
	var ratio = window.devicePixelRatio || 2;
	var width = options.width || parseInt($('body').innerWidth());
	var height = options.height;
	var size = height ? width * ratio + 'x' + height * ratio + '^' : width * ratio;
    var image_src = src + '?imageMogr/v2/thumbnail/' + size;
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
