(function() {
    
    document.addEventListener("deviceready", function(e) {
        document.addEventListener("resume", function(e) {
            if (MeiweiApp.history.active) {
                MeiweiApp.history.active.onResume();
            }
        }, false);
        document.addEventListener("backbutton", function(e) {
            if (MeiweiApp.history.active != MeiweiApp.Pages.Home){
                e.preventDefault();
                if (MeiweiApp.history.active && MeiweiApp.history.active.onClickLeftBtn) {
                    MeiweiApp.history.active.onClickLeftBtn();
                }
            }
        }, false);
        MeiweiApp.start();
    }, false);
    
    document.addEventListener('WeixinJSBridgeReady', function() {
        WeixinJSBridge.call('hideToolbar');
    });
    
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
            WeixinJSBridge.invoke('sendAppMessage', MeiweiApp.wechatShareMessage);
        });
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            WeixinJSBridge.invoke('shareTimeline', MeiweiApp.wechatShareMessage);
        });
    }, false);
    
})();
