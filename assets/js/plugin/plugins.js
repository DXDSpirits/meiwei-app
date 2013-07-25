// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any Zepto/helper plugins in here.
(function(document) {
	window.MWA = window.MWA || {};
	MWA.fixBlurScroll = function(context) {
		var inputs = $(context).find('input,textarea');
		inputs.on('blur', function() {
			window.scrollTo(0, 0);
		});
	};
	MWA.preventWindowScroll = function() {
		$(window).bind('touchmove', function(ev) { ev.preventDefault(); });
	};
})(document);
